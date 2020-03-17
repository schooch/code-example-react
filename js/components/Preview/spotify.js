import React from 'react';
import { embedSpotifyUrl } from '../../helpers';
import LoadingSVG from '../../../images/loading.svg';
import ReactDOM from 'react-dom';

class PreviewSpotify extends React.Component {
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
      <div className="post-video">
        <iframe src={embedSpotifyUrl(this.props.url)} ref="iframe" width="300" height="410" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        {
          !this.state.loaded &&
          <div className="placeholder">
            <img src={LoadingSVG} className="placeholder-loading" alt="" />
          </div>
        }
      </div>
    )
  }
}


export default PreviewSpotify;
