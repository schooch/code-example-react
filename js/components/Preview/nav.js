import React from 'react';
import { connect } from 'react-redux';
import SVGshare from '../../../images/share';
import SVGminus from '../../../images/minus.svg';
import SVGplus from '../../../images/plus.svg';

import { PreviewContext } from './context';

import { Dropdown } from '../utils/Dropdown';

const PreviewNav = props => (
  <div className={`preview-top-nav ${props.open ? 'show': ''}`}>
    <h2 className="company-name">{props.channel.company.name}</h2>
    {
      props.webview && props.webview !== 'limited' &&
      <PreviewContext.Consumer>
        {({ followed, toggleFollowed}) => (
          <React.Fragment>
            {/* <button className="share">
              <SVGshare color={'#fff'} />
            </button> */}
            <button className="follow" onClick={toggleFollowed}>
              <img src={followed ? SVGminus : SVGplus} alt="" />
            </button>
          </React.Fragment>
        )}
      </PreviewContext.Consumer>
    }
  </div>
)

const mapStateToProps = state => ({
  webview: state.webview,
  channel: state.channel,
  followed: state.channel.followed
})

export default connect(mapStateToProps)(PreviewNav);