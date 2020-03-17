import React, { Component, Fragment } from "react";
import { Form, Text, TextArea } from "informed";
import { validateThreeCharacters, validateSpotify } from "../validations";
import { matchSpotifyUrl, embedSpotifyUrl } from "../../../helpers";
import Loading from "../../utils/Loading";
import RteField from "../utils/rte";

class PostYoutube extends Component {
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
    const initUrl = initValues ? initValues.url : "";

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
                htmlFor="spotify-url"
                className={!initValues ? "mandatory" : ""}
              >
                Spotify URL
              </label>
              <Text
                field="url"
                className="form-control"
                id="spotify-url"
                initialValue={initUrl}
                validate={validateSpotify}
                validateOnChange
                validateOnBlur
              />
              {formState.errors.url && this.state.formDirty && (
                <span
                  style={{ color: "red", display: "block", marginTop: "10px" }}
                >
                  {formState.errors.url}
                </span>
              )}
            </div>

            {!!formState.values.url && matchSpotifyUrl(formState.values.url) && (
              <div className="form-group">
                <iframe
                  src={embedSpotifyUrl(formState.values.url)}
                  title={formState.values.title}
                  width="300"
                  height="410"
                  frameBorder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                ></iframe>
              </div>
            )}

            <div className="form-group">
              <label
                htmlFor="spotify-title"
                className={!initValues ? "mandatory" : ""}
              >
                Title
              </label>
              <Text
                field="title"
                className="form-control"
                id="spotify-title"
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
              <label htmlFor="spotify-text">Description</label>
              <RteField
                field="description"
                className="form-control"
                id="spotify-text"
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

export default PostYoutube;
