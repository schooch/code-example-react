import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, TextArea  } from 'informed';
import { addComment, changeCommentNumber } from '../../../actions/comments';
import Image from '../../utils/Image';
import SendSvg from '../../../../images/send.svg';
import Loading from '../../utils/Loading';

const fieldHeight = 40;

class WebviewCommentForm extends React.Component {
  constructor() {
    super();

    this.state = {
      fieldHeight,
      loading: false
    }
  }
  formSubmit(values) {
    const message = values.message;
    
    if (!this.props.user.token) {
      informApp('unauthorized');
      return false;
    }
    axios.defaults.headers.common['X-SOURCE'] = 'app';
    this.setState({ loading: true });
    axios.post(`/api/comment/post/${this.props.post.id}`, { message })
      .then(response => {
        const { comment_number, ...data } = response.data;
        this.props.addComment(data, this.props.post.id);
        this.props.changeCommentNumber(comment_number, this.props.post.id);
        this.formApi.reset();
        this.setState({ fieldHeight, loading: false });
      })
      .catch(error => {
        console.log(error);
        console.log(error.response);
      })
  }

  setFormApi(formApi) {
    this.formApi = formApi;
  }

  messageChange({ target: { scrollHeight } }) {
    this.setState({ fieldHeight: scrollHeight })
  }

  render() {
    const { user } = this.props;
    return(
      <div className="comment comment-form">
        <div className="comment-avatar-wrap">
          <Image
            className="comment-avatar image-mask sharp"
            src={user.avatar}
            background />
        </div>
        <Form getApi={this.setFormApi.bind(this)} onSubmit={this.formSubmit.bind(this)} className="comment-content-wrap">
          {({ formState }) => (
            <React.Fragment>
              <TextArea className="comment-field" onChange={this.messageChange.bind(this)} placeholder="Add a comment" style={{ minHeight: 40, maxHeight: 300, height: this.state.fieldHeight }} field="message" />
              <button type="submit" className="comment-submit" disabled={!formState.values.message || (formState.values.message && !formState.values.message.trim().length) || this.state.loading}>
                {
                  this.state.loading ?
                  <Loading fill="#fff" />
                  :
                  <img src={SendSvg} alt="" />
                }
              </button>
            </React.Fragment>
          )}
        </Form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addComment,
    changeCommentNumber
  }, dispatch)
)

const mapStateToProps = state => ({
  user: state.appuser,
  post: state.post
})

export default connect(mapStateToProps, mapDispatchToProps)(WebviewCommentForm);

