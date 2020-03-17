import React from 'react';
import Comment from './comment';
import Loading from '../utils/Loading';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setComments, removeComment, clearComments, resetComments } from '../../actions/comments';
import { withAlert } from "react-alert";
import InfiniteScroll from 'react-infinite-scroller';
import { UserBlockContext } from './context';

const startPage = 1;
class Comments extends React.Component {
  constructor() {
    super();

    this.state = {
      loadingDelete: false,
      hasMore: true,
      perCall: 10,
      nextPage: startPage,
      canFetch: true
    }

    this.deleteComment = this.deleteComment.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.webview) {
      if (newProps.id !== this.props.id) {
        this.props.clearComments();
        this.clearPagination();
      }
    }
  }

  componentWillMount() {
    this.loadComments(this);
  }

  deleteComment(id) {
    this.setState({ loadingDelete: id });
    axios.delete(`/web-api/comment/${id}`)
      .then(response => {
        this.props.removeComment(id, this.props.post.id);
        this.props.alert.success(response.data.info_message);
        this.setState({ loadingDelete: false });
      })
      .catch(error => {
        console.log(error);
        console.log(error.response);
        this.props.alert.error(error.response.message);
        this.setState({ loadingDelete: false });
      })
  }

  clearPagination() {
    this.setState({ hasMore: true, nextPage: startPage });
  }

  loadComments(reset) {
    const { nextPage, perCall, canFetch } = this.state;
    const endpoint = this.props.webview ? `/api/comment/get/${this.props.post.id}` : `/web-api/comment/${this.props.post.id}`;
    if (canFetch) {
      this.setState({ canFetch: false });
      axios.post(endpoint, { page: nextPage, pageSize: perCall })
        .then(response => {
          const { meta, data } = response.data;
          this.setState({
            hasMore: meta.last_page > meta.current_page,
            nextPage: meta.current_page + 1,
            canFetch: true
          })
          if(reset) {
            this.props.resetComments(data);
            return;
          }

          this.props.setComments(data);
        })
        .catch(error => {
          console.log(error);
          console.log(error.response);
        })
    }
  }

  resetComments() {
    this.clearPagination();
    this.loadComments(true);
  }

  render() {
    return (
      
        <div className="comments">
          <InfiniteScroll
            className="comments"
            pageStart={0}
            loadMore={this.loadComments.bind(this)}
            hasMore={this.state.hasMore}
            // initialLoad={false}
            loader={<div className="text-center" key={0} style={{ margin: '30px 0' }}><Loading /></div>}
            useWindow={false}>

            <UserBlockContext.Provider value={{
              resetComments: () => this.resetComments()
            }}>
              {
                this.props.comments.map(comment => {
                  return (
                    <Comment
                      deleteComment={this.deleteComment}
                      comment={comment}
                      loading={this.state.loadingDelete}
                        key={`comment-${comment.id}`} />
                    )
                })
              }
            </UserBlockContext.Provider>
          </InfiniteScroll>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  comments: state.comments,
  webview: state.webview,
  post: state.post
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setComments,
    resetComments,
    removeComment,
    clearComments
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(withAlert(Comments));