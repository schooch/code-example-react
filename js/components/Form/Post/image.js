import React, { Component, Fragment } from "react";
import { Form, Text } from "informed";
import { validateThreeCharacters, validateImage } from "../validations";
import ImageInput from "../utils/imageInput";
import Loading from "../../utils/Loading";
import RteField from "../utils/rte";

class PostImage extends Component {
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
    const img = this.formApi.getValue("images");
    const object = _.mapKeys(values, (value, key) => {
      const iv = this.props.initialValues;
      if (key === "image") return "blank";
      return iv
        ? iv[key] !== value
          ? key
          : "blank"
        : value !== undefined && !value.length
        ? "blank"
        : key;
    });
    const { blank, ...withoutImage } = object;
    const val =
      !!img && !!img.name
        ? { ...withoutImage, "images[0]": img }
        : withoutImage;
    this.props.onSubmit(val);
  }

  render() {
    const initValues = this.props.initialValues;
    const initTitle = initValues ? initValues.title : "";
    const initText = initValues ? initValues.text : "";
    const initImages = initValues ? initValues.images : "";

    return (
      <Form
        getApi={this.setFormApi}
        onSubmit={this.formSubmit.bind(this)}
        onSubmitFailure={this.onFail}
      >
        {({ formState }) => (
          <Fragment>
            <div className="form-group text-center">
              <ImageInput
                field="images"
                initialValue={initImages}
                validate={validateImage}
                validateOnChange
                validateOnBlur
              />
              {formState.errors.images && this.state.formDirty && (
                <span
                  className="text-left"
                  style={{ color: "red", display: "block", marginTop: "10px" }}
                >
                  {formState.errors.images}
                </span>
              )}
            </div>
            <div className="form-group">
              <label
                htmlFor="image-title"
                className={!initValues ? "mandatory" : ""}
              >
                Title
              </label>
              <Text
                field="title"
                className="form-control"
                id="image-title"
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
              <label htmlFor="image-text">Description</label>
              <RteField
                field="description"
                className="form-control"
                id="image-text"
                initialValue={initText}
              />
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

export default PostImage;
