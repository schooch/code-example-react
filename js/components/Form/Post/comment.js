import React, { Component, Fragment } from "react";
import { Form, TextArea } from "informed";
import { connect } from "react-redux";
import Loading from "../../utils/Loading";
import RteField from "../utils/rte";

class PostComment extends Component {
  constructor() {
    super();

    this.state = {
      formDirty: false,
      channels: false,
      loading: false
    };

    this.onFail = this.onFail.bind(this);
    this.setFormApi = this.setFormApi.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  onFail() {
    this.setState({ formDirty: true });
  }

  setFormApi(formApi) {
    this.formApi = formApi;
  }

  resetForm() {
    this.formApi.reset();
    this.rteField.clear();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.post &&
      this.props.post &&
      prevProps.post.id !== this.props.post.id
    ) {
      this.resetForm();
    }
  }

  render() {
    return (
      <Form
        getApi={this.setFormApi}
        onSubmit={this.props.onSubmit}
        onSubmitFailure={this.onFail}
      >
        {({ formState }) => (
          <Fragment>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <RteField
                onRef={ref => (this.rteField = ref)}
                field="comment"
                className="form-control"
                id="comment"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn"
                disabled={!formState.values.comment || this.props.loading}
              >
                {this.props.loading && <Loading />}
                <span className="btn-text">Submit</span>
              </button>
            </div>
          </Fragment>
        )}
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  post: state.channelEditor.post
});

export default connect(mapStateToProps)(PostComment);
