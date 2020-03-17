import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removePost, likePost, setPost } from '../../actions/posts';
import { clearComments } from '../../actions/comments';
import PreviewImage from './image';
import PreviewYoutube from './youtube';
import PreviewSpotify from './spotify';
import PreviewTitle from './title';
import PreviewText from './text';
import BubbleIcon from '../../../images/bubble.svg';
import HeartSvg from '../../../images/heart';
import { withAlert } from "react-alert";
import moment from 'moment';
import Loading from '../utils/Loading';
import { informApp } from '../../helpers';
import { withRouter } from 'react-router-dom';
import { channelEditor } from '../../actions/channels';
import { CommentsContext } from './context';
import Report from '../utils/Report';

class PreviewPost extends React.Component {
  constructor() {
    super();

    this.state = {
      deleteLoading: false
    }
  }

  deletePost() {
    if(!this.props.webview) {
      this.setState({ deleteLoading: true });
      axios.delete(`/web-api/post/${this.props.post.id}`)
        .then(response => {
          this.setState({ deleteLoading: false });
          this.props.removePost(response.data.post_id);
          this.props.alert.success(response.data.info_message);
          if (this.props.postActive && this.props.post.id === this.props.postActive.id) {
            this.props.channelEditor();
          }
        })
        .catch(error => {
          this.props.alert.error(error.response.data.message);
          this.setState({ deleteLoading: false });
        })
    }
  }

  scrollToPost() {
    const isFirefox = typeof InstallTrigger !== 'undefined';
    const isChrome = !!window.chrome && !!window.chrome.webstore;
    const param = isFirefox || isChrome ? { behavior: "smooth", block: "nearest", inline: "nearest" } : true; 
    this.refs.post.scrollIntoView(param);
  }

  likeClick() {
    const like = !this.props.post.liked;

    if (!this.props.webview) false; 

    if(!this.props.token) {
      informApp('unauthorized');
      informApp('unauthorizedLike', this.props.post.id);
      return false;
    }
    axios.post(`/api/like/post/${this.props.post.id}`, { like })
      .then(response => {
        const { liked, likes } = response.data;
        this.props.likePost({ liked, likes, id: this.props.post.id});
      })
      .catch(error => {
        console.log(error);
        console.log(error.response);
      })
  }

  commentClick() {
    this.props.setPost(this.props.post)
    if (!this.props.webview) {
      if (this.props.postActive && this.props.postActive.id !== this.props.post.id) {
        this.props.clearComments();
      }
      this.props.channelEditor('comments', {
        id: this.props.post.id,
        title: this.props.post.title
      });
      this.scrollToPost();
    } else {
      if (!this.props.token) {
        informApp('unauthorized');
        informApp('unauthorizedPostEnter', this.props.post.id);
        return false;
      }
      this.props.history.push(`/post/${this.props.post.id}`)
    }
  }


  render() {
    const { post, postActive, webview, user, token} = this.props;
    return (
      <div ref='post' className={`preview-post ${post.type === 'SPOTIFY' ? 'spotify' : ''} ${postActive && postActive.id === post.id ? 'post-active': ''}`} >
        <div className="preview-post-inner">
          <div className="post-date">
            <span>{moment(post.created_at * 1000).fromNow()}</span>
            {
              this.props.webview &&
              token &&
              <Report post={true} content={{sender: user.id, id: post.id }} />
            }
          </div>
          {
            post.type === 'SPOTIFY' ?
            <PreviewSpotify url={post.url} title={post.title} /> :
            post.type === 'IMAGES' ?
            <PreviewImage images={post.images} title={post.title} id={post.id} scrollToPost={this.scrollToPost.bind(this)} setPost={() => { this.props.setPost(post) }} /> :
            post.type === 'YOUTUBE' &&
            <PreviewYoutube url={post.url} title={post.title} />
          }
          <PreviewTitle title={post.title} id={post.id} setPost={() => {this.props.setPost(post)}} scrollToPost={this.scrollToPost.bind(this)} />
          {
            post.description &&
            <PreviewText text={post.description} />
          }
          <div className="post-buttons">
            <button className="post-button" onClick={this.likeClick.bind(this)}>
              <HeartSvg fill={post.liked || !webview ? false : '#e3e3e3'} />
              {post.likes_number} {this.props.webview === 'post' && 'Likes'}
            </button>
            {
              this.props.webview !== 'post' &&
              <button onClick={this.commentClick.bind(this)} className="post-button">
                <img src={BubbleIcon} alt="" />
                {post.comment_number}
              </button>
            }
          </div>
          {
            this.props.webview === 'post' &&
            <div className="comments-link-wrap">
              <CommentsContext.Consumer>
                {({ scrollToComments }) => (
                  <span className="comments-link" onClick={scrollToComments}>{post.comment_number} Comments</span>
                )}
              </CommentsContext.Consumer>
            </div>
          }
          {
            window.user && (window.user.role_id === 1 || window.user.role_id === 2) &&
            <React.Fragment>
              <div className="post-buttons-control">
                <button disabled={this.state.deleteLoading} onClick={this.deletePost.bind(this)}>
                  {
                    this.state.deleteLoading &&
                    <Loading fill="#fff" />
                  }
                  <span className="btn-text">Delete</span>
                </button>
                {
                  !post.published &&
                  <button onClick={editPost}>Edit</button>
                }
                {
                  !post.published &&
                  <button>Publish</button>
                }
              </div>
            </React.Fragment>
          }
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    removePost,
    likePost,
    channelEditor,
    setPost,
    clearComments
  }, dispatch)
  )
  
const mapStateToProps = state => ({
  user: state.appuser,
  token: state.appuser.token,
  webview: state.webview,
  postActive: state.channelEditor.post
})
export default connect(mapStateToProps, mapDispatchToProps)(withAlert(withRouter(PreviewPost)));