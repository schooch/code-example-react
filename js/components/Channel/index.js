import React, { Component } from "react";
import PostForm from "../Form/Post";
import ChannelForm from "../Form/channel";
import CommentForm from "../Form/Post/comment";
import Preview from "../Preview";
import Comments from "../Preview/comments";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setChannels,
  setChannel,
  modifyChannelInChannels,
  channelEditor
} from "../../actions/channels";
import { addComment, clearComments } from "../../actions/comments";
import { setPosts, resetPosts } from "../../actions/posts";
import WidgetChannels from "../Widget/channels";
import WidgetFollowers from "../Widget/followers";
import WidgetTags from "../Widget/tags";
import WidtetActivites from "../Widget/activities";
import { withAlert } from "react-alert";
import _ from "lodash";
import FormData from "form-data";
import Loading from "../utils/Loading";
import { previewScroll } from "../../actions/preview";

class Channel extends Component {
  constructor() {
    super();

    this.state = {
      fetchChannelError: false,
      channelLoading: false,
      loadingChannelEdit: false,
      loadingComment: false,
      showPreview: false
    };

    this.fetchChannel = this.fetchChannel.bind(this);
    this.editChannel = this.editChannel.bind(this);
    this.fetchChannels = this.fetchChannels.bind(this);
  }

  fetchChannel(id) {
    this.setState({ channel: null, fetchChannelError: false });
    axios
      .get(`/web-api/channel/${id ? id : this.props.match.params.id}`)
      .then(response => {
        const { posts, ...channel } = response.data;
        // this.props.setPosts(posts);
        this.props.setChannel(channel);
        this.fetchChannels(channel.company.id);
        this.setState({ showPreview: true });
      })
      .catch(error => {
        console.log(error);
        this.setState({ fetchChannelError: error.response.data.message });
      });
  }

  fetchChannels(companyID) {
    if (!this.props.channels.length) {
      axios
        .get(`/web-api/company/${companyID}`)
        .then(response => {
          this.props.setChannels(response.data.channels);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }

  commentCreate(values) {
    this.setState({ loadingComment: true });
    axios
      .post(`/web-api/comment/create/${this.props.postActive.id}`, {
        message: values.comment
      })
      .then(response => {
        this.props.addComment(response.data, this.props.postActive.id);
        this.commentFormEl.resetForm();
        this.setState({ loadingComment: false });
      })
      .catch(error => {
        console.log(error);
        console.log(error.response);
        this.setState({ loadingComment: false });
      });
  }

  editChannel(values) {
    const that = this;
    let formData = new FormData();
    _.pickBy(values, function(value, key) {
      if (value !== that.props.channel[key]) {
        const val = value === true ? 1 : value === false ? 0 : value;
        formData.append(key, val);
      }
    });

    this.setState({ loadingChannelEdit: true });

    axios
      .post(`/web-api/channel/edit/${this.props.channel.id}`, formData)
      .then(response => {
        this.props.alert.success("Channel has been edited.");
        this.props.channelEditor();
        this.setState({ loadingChannelEdit: false });
        this.props.setChannel(response.data);
        const { active, followers, id, name } = response.data;
        this.props.modifyChannelInChannels({ active, followers, id, name });
      })
      .catch(error => {
        console.log(error.response ? error.response : error);
        this.props.alert.error(error.response.data.message);
        this.setState({ loadingChannelEdit: false });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.channelEditor();
      this.props.clearComments();
      this.setState({ previewID: `previewID-${nextProps.match.params.id}` });
      this.fetchChannel(nextProps.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.channelEditor();
    this.props.resetPosts();
    this.props.clearComments();
    this.setState({ showPreview: false });
  }

  componentWillMount() {
    this.fetchChannel();
  }

  listenScrollEvent(e) {
    this.props.previewScroll(e.target.scrollTop);
  }

  render() {
    const { fetchChannelError } = this.state;
    const { channel, editorActive } = this.props;

    return (
      <React.Fragment>
        {!_.isEmpty(channel) ? (
          <div className="main">
            <div className="sidebar">
              <WidgetFollowers followers={channel.followers} />
              <WidtetActivites activity={channel.activity} />
              <WidgetTags tags={channel.tags_number} />
              <WidgetChannels company={channel.company.name} />
            </div>
            <div className="content-wrapper">
              <div className="content">
                <div className="preview">
                  <div
                    className="preview-frame preview-scroll"
                    ref="previewWrapper"
                    onScroll={e => this.listenScrollEvent(e)}
                  >
                    {this.state.showPreview ? (
                      <Preview
                        ref={this.state.previewID}
                        channel={channel}
                        wrapperOffset={
                          this.refs.previewWrapper
                            ? this.refs.previewWrapper.getBoundingClientRect()
                                .top
                            : 0
                        }
                      />
                    ) : (
                      <div className="preview-loading">
                        <Loading />
                      </div>
                    )}
                  </div>
                </div>
                <div className="editor">
                  {editorActive !== "comments" && (
                    <React.Fragment>
                      <button
                        className={`btn ${editorActive === "editChannel" &&
                          "active"}`}
                        onClick={() => this.props.channelEditor("editChannel")}
                      >
                        Edit Channel
                      </button>
                      <button
                        className={`btn ${editorActive === "createPost" &&
                          "active"}`}
                        onClick={() => this.props.channelEditor("createPost")}
                      >
                        Create New Post
                      </button>
                    </React.Fragment>
                  )}
                  {editorActive === "editChannel" ? (
                    <ChannelForm
                      onSubmit={this.editChannel}
                      serverError={this.state.editChannelServerError}
                      loading={this.state.loadingChannelEdit}
                      initialValues={channel}
                    />
                  ) : editorActive === "createPost" ? (
                    <PostForm
                      closeEditor={this.props.channelEditor.bind(this)}
                    />
                  ) : (
                    editorActive === "comments" && (
                      <React.Fragment>
                        <h1>{this.props.postActive.title}</h1>
                        <CommentForm
                          onRef={ref => (this.commentFormEl = ref)}
                          onSubmit={this.commentCreate.bind(this)}
                          loading={this.state.loadingComment}
                        />
                        <Comments id={this.props.postActive.id} />
                      </React.Fragment>
                    )
                  )}
                  {editorActive && (
                    <div className="form-group">
                      <button
                        className="btn"
                        onClick={() => {
                          this.props.channelEditor();
                          this.props.clearComments();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : !channel && fetchChannelError ? (
          <div className="main">
            <div className="preview scrollable">
              <div className="company-header">
                <h1>{fetchChannelError}</h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="main">
            <div className="preview scrollable">
              <div className="company-header">
                <h1>LOADING...</h1>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  channel: state.channel,
  channels: state.channels,
  editorActive: state.channelEditor.editor,
  postActive: state.channelEditor.post
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setChannel,
      setChannels,
      setPosts,
      resetPosts,
      modifyChannelInChannels,
      channelEditor,
      addComment,
      previewScroll,
      clearComments
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Channel));
