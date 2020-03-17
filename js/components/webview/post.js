import React from 'react';
import PreviewPost from '../Preview/post';
import Comments from '../Preview/comments';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CommentForm from '../Form/Post/webview-comment';
import { setWebview } from '../../actions/preview';
import { setComments, clearComments } from '../../actions/comments';
import { setPost } from '../../actions/posts';
import Loading from '../utils/Loading';
import { withRouter } from 'react-router-dom';
import { informApp } from '../../helpers';
import { isEmpty } from 'lodash';
import { CommentsContext } from '../Preview/context';

class Post extends React.Component {
  constructor() {
    super();

    this.state = {
      showPost: false
    }

    this.fetchPost = this.fetchPost.bind(this);
  }

  fetchPost() {
    axios.get(`/api/post/${this.props.match.params.id}`)
      .then(response => {
        this.props.setPost(response.data);
        this.setState({ showPost: true });
      })
      .catch(error => {
        const res = error.response
        console.log(error);
        console.log(res);
        if (error.response && error.response.data.message === 'Unauthenticated') {
          informApp('unauthorized');
        }
        if (res && res.data && res.data.redirect_link) {
          docoment.location = res.data.redirect_link;
        }
      })
  }

  componentDidMount() {
    this.props.scrollToTop();
  }

  componentWillMount() {
    this.props.setWebview('post');
    if(isEmpty(this.props.post)) {
      this.fetchPost();
    } else {
      this.setState({ showPost: true });
    }
  }

  componentWillUnmount() {
    this.props.setWebview(true);
    this.setState({ showPost: false });
    this.props.setPost({});
    this.props.clearComments();
  }

  scrollToComments(h) {
    const hash = h ? h : 'comments';
    this.refs[hash].scrollIntoView(true);
  }

  render() {
    return (
      <div className="post-page">
        <CommentsContext.Provider value={{
          scrollToComments: () => this.scrollToComments()
        }}>
          {
          this.state.showPost ?
            
            <React.Fragment>
              <PreviewPost post={this.props.post} />
              <div ref="comments">
                <CommentForm />
                <Comments />
              </div>
            </React.Fragment>
            :
            <div className="preview-loading">
              <Loading />
            </div>
          }
        </CommentsContext.Provider>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  post: state.post,
  posts: state.posts
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setWebview,
    setComments,
    clearComments,
    setPost
  }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Post));