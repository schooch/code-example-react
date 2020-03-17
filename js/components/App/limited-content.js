import React, { Component } from 'react';
import { connect } from 'react-redux'
import { previewScroll, setWebview } from '../../actions/preview';
import { setChannel } from '../../actions/channels';
import { bindActionCreators } from 'redux';
import Preview from '../Preview';

class Webview extends Component {
  listenScrollEvent(e) {
    this.props.previewScroll(e.target.scrollTop);
  }

  componentWillMount() {
    const channel = window.channel;
    this.props.setWebview('limited');
    this.props.setChannel(channel);
  }

  render() {
    return (
      <div className="preview-wrapper" ref="scrollingElement" onScroll={(e) => this.listenScrollEvent(e)}>
        <Preview />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    previewScroll,
    setWebview,
    setChannel
  }, dispatch)
)
export default connect(mapStateToProps, mapDispatchToProps)(Webview);