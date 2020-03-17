import React, { Component } from 'react';
import { connect } from 'react-redux'
import { previewScroll, setWebview } from '../../actions/preview';
import { setAppUser } from '../../actions/users';
import { bindActionCreators } from 'redux';
import Post from '../webview/post';
import Channel from '../webview/channel';
import NoMatch from '../NoMatch';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ScrollMemory from 'react-router-scroll-memory';

window.location.hash = window.decodeURIComponent(window.location.hash);

class Webview extends Component {
  constructor() {
    super();

    this.scrollToTop = this.scrollToTop.bind(this);
  }
  listenScrollEvent() {
    this.props.previewScroll(window.scrollY);
  }

  componentWillMount() {
    this.props.setAppUser({ ...window.user, token: window.token });   
    this.props.setWebview(true);
  }

  componentDidMount() {
    window.addEventListener('scroll', () => this.listenScrollEvent());
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <BrowserRouter basename="/web-api/channel">
        <div className="preview-wrapper" ref="scrollingElement" >
          <ScrollMemory />
          <Switch>
            <Route strict path={'/tag_uuid/:id'} component={Channel} />
            <Route exact path={'/post/:id'} render={() => <Post scrollToTop={this.scrollToTop} />} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    previewScroll,
    setWebview,
    setAppUser
  }, dispatch)
)
export default connect(mapStateToProps, mapDispatchToProps)(Webview);