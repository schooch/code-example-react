import React from 'react';
import Image from '../utils/Image';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { channelEditor } from '../../actions/channels';
import { informApp } from '../../helpers';
import { withRouter } from 'react-router-dom';

class PreviewImage extends React.Component {
  imageClick() {
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
    return(
      <Image
        parentClass="post-image"
        className="post-image"
        onClick={this.imageClick.bind(this)}
        src={this.props.images[0].imageURL}
        alt="" />
    )
  }
}

const mapStateToProps = state => ({
  webview: state.webview,
  token: state.appuser.token
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    channelEditor
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PreviewImage));