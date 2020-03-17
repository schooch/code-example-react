import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { channelEditor } from '../../actions/channels';
import { informApp } from '../../helpers';
import { withRouter } from 'react-router-dom';
import Report from '../utils/Report';

class PreviewTitle extends React.Component {
  titleClick() {
    this.props.setPost();
    if (this.props.webview && this.props.webview !== 'post') {
      if (!this.props.token) {
        informApp('unauthorized');
        informApp('unauthorizedPostEnter', this.props.id);
        return false;
      }
      this.props.history.push(`/post/${this.props.id}`)
    } else if (!this.props.webview) {
      this.props.channelEditor('comments', {
        id: this.props.id,
        title: this.props.title
      });
      this.props.scrollToPost();
    }
  }

  render() {
    const { title, userID, postID } = this.props;
    return (
      <React.Fragment>
        {
          this.props.webview === 'post' ?
          <div className="post-title">
            <span>
              { title }
            </span>
              <Report post={true} content={{ sender: userID, id: postID }} />
          </div>
          :
          <button className="post-title" onClick={this.titleClick.bind(this)} >
            {title}
          </button >
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  webview: state.webview,
  userID: state.appuser.id,
  token: state.appuser.token,
  postID: state.post.id
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    channelEditor,
  }, dispatch)
)
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PreviewTitle));