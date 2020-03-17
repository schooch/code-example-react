import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PreviewPost from "./post";
import { setPosts, setPostsMore, resetPosts } from "../../actions/posts";
import { setChannelFollowers } from "../../actions/channels";
import { informApp } from "../../helpers";
import PreviewNav from "./nav";
import PreviewHead from "./head";
import { PreviewContext } from "./context";
import Image from "../utils/Image";
import Loading from "../utils/Loading";
import InfiniteScroll from "react-infinite-scroller";

const startPage = 1;

class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageScale: 1,
      topNavVisible: false,
      followed: this.props.followed,
      followedLoading: false,
      postsPerCall: 10,
      nextPostsPage: startPage,
      canFetchPost: true
    };

    this.setTopNavVisibility = this.setTopNavVisibility.bind(this);
  }

  componentWillMount() {
    if (this.props.posts.length) {
      this.setState({
        nextPostsPage: Math.ceil(
          (this.props.posts.length + 1) / this.state.postsPerCall
        )
      });
    } else {
      this.loadPosts();
    }
  }

  renderPosts() {
    const { posts } = this.props;
    return posts.map(post => (
      <PreviewPost key={`postId-${post.id}`} post={post} />
    ));
  }

  setTopNavVisibility(show) {
    this.setState({
      topNavVisible: show
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.previewScroll !== this.props.previewScroll) {
      let scale = 1 + newProps.previewScroll / 900;
      scale = scale >= 1.5 ? 1.5 : scale;
      scale = scale <= 1 ? 1 : scale;
      this.setState({
        imageScale: scale
      });
    }
    if (newProps.channel.id !== this.props.channel.id) {
      this.props.resetPosts();
      this.props.setPostsMore(true);
      this.setState({ canFetchPost: true, nextPostsPage: startPage });
    }
  }

  loadPosts() {
    const { nextPostsPage, postsPerCall, canFetchPost } = this.state;
    if (canFetchPost) {
      this.setState({ canFetchPost: false });
      axios
        .post(`/api/posts/channel/${this.props.channel.id}`, {
          page: nextPostsPage,
          pageSize: postsPerCall
        })
        .then(response => {
          const { meta, data } = response.data;
          this.setState({
            nextPostsPage: meta.current_page + 1,
            canFetchPost: true
          });
          this.props.setPostsMore(meta.last_page > meta.current_page);
          this.props.setPosts(data);

          console.log(canFetchPost);
        })
        .catch(error => {
          console.log(error);
          console.log(error.response);
        });
    }
  }

  toggleFollowed(followBoolean) {
    if (this.state.followedLoading) return false;
    if (!this.props.token) {
      informApp("unauthorized");
      informApp("unauthorizedFollow");
      return false;
    }
    this.setState({ followedLoading: true });
    axios
      .post(`/api/channel/follow/${this.props.channel.id}`, {
        follow: followBoolean ? followBoolean : !this.state.followed
      })
      .then(response => {
        this.setState({ followedLoading: false });
        this.setState({ followed: response.data.followed });
        this.props.setChannelFollowers(response.data.followers);
        informApp("follow", response.data.followed);
      })

      .catch(error => {
        this.setState({ followedLoading: false });
        console.log(error.response ? error.response : error);
      });
  }

  render() {
    const { channel, webview } = this.props;

    return (
      <PreviewContext.Provider
        value={{
          followed: this.state.followed,
          toggleFollowed: () => this.toggleFollowed()
        }}
      >
        <React.Fragment>
          {webview && <PreviewNav open={this.state.topNavVisible} />}
          <Image
            parentClass="preview-channel-image"
            className="preview-channel-image"
            src={channel.image}
            alt=""
            style={{ transform: `scale(${this.state.imageScale})` }}
          />
          <div className="preview-channel-content">
            <PreviewHead
              wrapperOffset={this.props.wrapperOffset}
              setTopNavVisibility={this.setTopNavVisibility}
            />
          </div>
          {this.props.webview !== "limited" && (
            <InfiniteScroll
              className="preview-posts"
              pageStart={0}
              loadMore={this.loadPosts.bind(this)}
              hasMore={this.props.hasMorePosts}
              initialLoad={false}
              loader={
                <div
                  className="text-center"
                  key={0}
                  style={{ margin: "30px 0" }}
                >
                  <Loading />
                </div>
              }
              useWindow={this.props.webview}
            >
              {this.renderPosts()}
            </InfiniteScroll>
          )}
        </React.Fragment>
      </PreviewContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  channel: state.channel,
  followed: state.channel.followed,
  previewScroll: state.previewScroll,
  token: state.appuser.token,
  posts: state.posts.posts,
  webview: state.webview,
  hasMorePosts: state.posts.hasMore
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setChannelFollowers,
      setPosts,
      resetPosts,
      setPostsMore
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preview);
