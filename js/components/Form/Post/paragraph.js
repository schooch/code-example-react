import React, { Component, Fragment } from "react";
import { Form, Text, TextArea } from "informed";
import { validateThreeCharacters } from "../validations";
import Loading from "../../utils/Loading";
import RteField from "../utils/rte";

class PostParagraph extends Component {
  constructor() {
    super();

    this.state = {
      formDirty: false,
      channels: false
    };

    this.onFail = this.onFail.bind(this);
    this.setFormApi = this.setFormApi.bind(this);
  }

  onFail() {
    this.setState({ formDirty: true });
  }

  setFormApi(formApi) {
    this.formApi = formApi;
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.initialValues &&
      prevProps.initialValues.id !== this.props.initialValues.id
    ) {
      this.formApi.reset();
    }
  }

  formSubmit(values) {
    const object = _.mapKeys(values, (value, key) => {
      const iv = this.props.initialValues;
      return iv
        ? iv[key] !== value
          ? key
          : "blank"
        : value !== undefined && !value.length
        ? "blank"
        : key;
    });
    const { blank, ...val } = object;
    this.props.onSubmit(val);
  }

  render() {
    const initValues = this.props.initialValues;
    const initTitle = initValues ? initValues.title : "";
    const initText = initValues ? initValues.text : "";

    return (
      <Form
        getApi={this.setFormApi}
        onSubmit={this.formSubmit.bind(this)}
        onSubmitFailure={this.onFail}
      >
        {({ formState }) => (
          <Fragment>
            <div className="form-group">
              <label
                htmlFor="paragraph-title"
                className={!initValues ? "mandatory" : ""}
              >
                Title
              </label>
              <Text
                field="title"
                className="form-control"
                id="paragraph-title"
                initialValue={initTitle}
                validate={validateThreeCharacters}
                validateOnChange
                validateOnBlur
              />
              {formState.errors.title && this.state.formDirty && (
                <span
                  style={{ color: "red", display: "block", marginTop: "10px" }}
                >
                  {formState.errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="paragraph-text"
                className={!initValues ? "mandatory" : ""}
              >
                Description
              </label>
              <RteField
                field="description"
                className="form-control"
                id="paragraph-text"
                initialValue={initText}
                validate={validateThreeCharacters}
                validateOnChange
                validateOnBlur
              />
              {formState.errors.text && this.state.formDirty && (
                <span
                  style={{ color: "red", display: "block", marginTop: "10px" }}
                >
                  {formState.errors.text}
                </span>
              )}
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn"
                disabled={
                  (initValues &&
                    _.isMatch(initValues, this.formApi.getState().values)) ||
                  this.props.loading
                }
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

export default PostParagraph;
