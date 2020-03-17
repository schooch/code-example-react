import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPost } from '../../../actions/posts';
import { withAlert } from "react-alert";

import PostParagraph from './paragraph';
import PostImage from './image';
import PostYoutube from './youtube';
import PostSpotify from './spotify';

import ImageSvg from '../../../../images/image.svg';
import ParagraphSvg from '../../../../images/paragraph.svg';
import YoutubeSvg from '../../../../images/youtube.svg';
import SpotifySvg from '../../../../images/spotify.svg';

class PostForm extends Component {
  constructor() {
    super();

    this.state = {
      postEditorActive: false,
      types: ['PARAGRAPH', 'IMAGES', 'YOUTUBE', 'SPOTIFY'],
      loading: false
    }

    this.changeEditor = this.changeEditor.bind(this);
  }

  changeEditor(editor) {
    if (editor !== this.state.postEditorActive) {
      const postEditorActive = editor ? editor : false;
      this.setState({ postEditorActive });
    }
  }

  imageSrc(type) {
    switch (type) {
      case 'IMAGES':
        return ImageSvg
      case 'YOUTUBE':
        return YoutubeSvg
      case 'PARAGRAPH':
        return ParagraphSvg
      case 'SPOTIFY':
        return SpotifySvg
      default:
        return false;
    }
  }

  postSubmit(values) {
    let formData = new FormData()
    _.each(values, function (value, key) {
      formData.append(key, value);
    });

    formData.append('channel_id', this.props.channel.id);
    formData.append('type', this.state.postEditorActive);

    this.setState({ loading: true });
    axios.post('/web-api/post/create', formData)
      .then(response => {
        this.props.addPost(response.data);
        this.setState({ loading: false });
        this.props.alert.success('A post has been created');
        this.props.closeEditor();
      })
      .catch(error => {
        this.props.alert.error(error.response.data.message);
        this.setState({ loading: false });
      })
  }

  render() {
    const editor = this.state.postEditorActive;
    return (
      <Fragment>
        <div className="post-types">
          {this.state.types.map(type => (
            <div
              className={`post-type ${editor === type ? 'active' : ''}`}
              onClick={() => this.changeEditor(type)}
              title={type}
              key={`type-option-${type}`}>
              <img src={this.imageSrc(type)} alt="" />
            </div>
          ))}
        </div>
        {
          editor === 'PARAGRAPH' ?
          <PostParagraph loading={this.state.loading} onSubmit={this.postSubmit.bind(this)} /> :
          editor === 'IMAGES' ?
          <PostImage loading={this.state.loading} onSubmit={this.postSubmit.bind(this)} /> :
          editor === 'YOUTUBE' ?
          <PostYoutube loading={this.state.loading} onSubmit={this.postSubmit.bind(this)} /> :
          editor === 'SPOTIFY' &&
          <PostSpotify loading={this.state.loading} onSubmit={this.postSubmit.bind(this)} />
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  channel: state.channel
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addPost
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(withAlert(PostForm));