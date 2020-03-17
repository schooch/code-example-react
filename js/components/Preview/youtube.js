import React from 'react';
import { matchYoutubeUrl } from '../../helpers';
import LoadingSVG from '../../../images/loading.svg';
import ReactDOM from 'react-dom';

class PreviewVideo extends React.Component {
  constructor() {
    super();

    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    let iframe = ReactDOM.findDOMNode(this.refs.iframe)
    iframe.addEventListener('load', () => { this.setState({ loaded: true }) });
  }

  render() {
    return (
    <div className="video-wrapper post-video">
        <iframe width="560" className="youtube" title={this.props.title} ref="iframe" height="315" src={`https://www.youtube.com/embed/${matchYoutubeUrl(this.props.url)}`} frameBorder="0" allow="autoplay; encrypted-media" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen=""></iframe>
      {
        !this.state.loaded &&
        <div className="placeholder">
            <img src={LoadingSVG} className="placeholder-loading" alt=""/>
        </div>
      }
    </div>
    )
  }
}

export default PreviewVideo;