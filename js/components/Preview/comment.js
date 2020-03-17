import React from "react";
import { connect } from "react-redux";
import Loading from "../utils/Loading";
import moment from "moment";
import Image from "../utils/Image";
import Report from "../utils/Report";
import Parser from "html-react-parser";

class Comment extends React.Component {
  constructor() {
    super();

    this.state = {
      loadingDelete: false
    };
  }
  deleteComment() {
    this.setState({ loadingDelete: true });
    this.props.deleteComment(this.props.comment.id);
  }
  render() {
    const { comment, user, token } = this.props;
    return (
      <div className="comment">
        <div className="comment-avatar-wrap">
          <Image
            className="comment-avatar image-mask sharp"
            src={comment.user.avatar}
            background
          />
        </div>
        <div className="comment-content-wrap">
          <div className="comment-content">
            <h3 className="name">
              {comment.user.name}
              {token && user.id !== comment.user.id && (
                <Report
                  content={{
                    sender: user.id,
                    id: comment.id,
                    blocked_user: comment.user.id
                  }}
                />
              )}
            </h3>
            <div className="comment-content-message">
              {Parser(comment.message)}
            </div>
            <div className="date">
              {moment(comment.created_at * 1000).fromNow()}
            </div>
          </div>
          {!this.props.webview && (
            <div className="post-buttons-control">
              <button
                onClick={this.deleteComment.bind(this)}
                disabled={
                  this.props.loading && this.props.loading === comment.id
                }
              >
                {this.props.loading && this.props.loading === comment.id && (
                  <Loading fill={"#fff"} />
                )}
                <span className="btn-text">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  webview: state.webview,
  user: state.appuser,
  token: state.appuser.token
});

export default connect(mapStateToProps)(Comment);
