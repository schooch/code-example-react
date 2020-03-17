import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import SVGshare from "../../../images/share";
import SVGminus from "../../../images/minus.svg";
import SVGplus from "../../../images/plus.svg";
import Image from "../utils/Image";
import gplayPNG from "../../../images/google-play.png";
import appstorePNG from "../../../images/app-store.png";

import { PreviewContext } from "./context";
import Parser from "html-react-parser";

class PreviewHead extends Component {
  componentWillReceiveProps(newProps) {
    if (newProps.previewScroll !== this.props.previewScroll) {
      const infoOffsetTop =
        this.refs.previewInfo.getBoundingClientRect().top -
        (this.props.wrapperOffset ? this.props.wrapperOffset : 0);
      const showTopNav = infoOffsetTop <= 0 ? true : false;
      this.props.setTopNavVisibility(showTopNav);
    }
  }

  render() {
    const { channel } = this.props;
    return (
      <React.Fragment>
        {channel && (
          <div className="preview-channel-head">
            <Image
              parentClass="preview-company-logo"
              src={channel.company.logo}
              alt=""
            />
            {
              // this.props.webview &&
              // <button className="preview-channel-share">
              //   Share <SVGshare />
              // </button>
            }
            <h2 className="preview-company-name">{channel.company.name}</h2>
            {channel.followers > 99 && (
              <h3 className="preview-channel-followers">
                {channel.followers} Followers
              </h3>
            )}
            {this.props.webview && this.props.webview !== "limited" && (
              <PreviewContext.Consumer>
                {({ followed, toggleFollowed }) => (
                  <button
                    className="preview-channel-follow btn-primary"
                    onClick={toggleFollowed}
                  >
                    <span className="btn-wrapper">
                      <img src={followed ? SVGminus : SVGplus} alt="" />
                      <span>{followed ? "Unfollow" : "Follow"}</span>
                    </span>
                  </button>
                )}
              </PreviewContext.Consumer>
            )}
            {this.props.webview === "limited" && (
              <div className="download-buttons">
                <a href="https://play.google.com/store/apps/details?id=me.skute.skutestaging">
                  <Image src={gplayPNG} />
                </a>
                <a href="https://itunes.apple.com/app/Skute/id1438624407?mt=8">
                  <Image src={appstorePNG} />
                </a>
              </div>
            )}
            <div className="preview-channel-head-info" ref="previewInfo">
              <h1 className="preview-channel-name">{channel.name}</h1>
              <div className="preview-channel-details">
                {Parser(channel.details)}
              </div>
              <h4 className="preview-channel-date">
                {moment(channel.created_at * 1000).format("DD MMM YYYY")}
              </h4>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  previewScroll: state.previewScroll,
  webview: state.webview,
  channel: state.channel,
  followed: state.channel.followed
});

export default connect(mapStateToProps)(PreviewHead);
