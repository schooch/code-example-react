import React, { Component } from "react";
import { Form, Text, Select, Option, Checkbox } from "informed";
import { validateThreeCharacters } from "./validations";
import ImageInput from "./utils/imageInput";
import _ from "lodash";
import Loading from "../utils/Loading";
import RteField from "./utils/rte";

class ChannelForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formDirty: false,
      render: true
    };

    this.onFail = this.onFail.bind(this);
    this.setFormApi = this.setFormApi.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }

  onFail() {
    this.setState({ formDirty: true });
  }

  setFormApi(formApi) {
    this.formApi = formApi;
  }

  disableButton(initValues) {
    if (initValues) {
      return (
        (initValues && _.isMatch(initValues, this.formApi.getState().values)) ||
        this.props.loading
      );
    }

    return this.props.loading;
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.initialValues &&
      nextProps.initialValues.id !== this.props.initialValues.id
    ) {
      this.formApi.reset();
    }
  }

  formSubmit(values) {
    const img = this.formApi.getValue("image");
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
      !!img && !!img.name ? { ...withoutImage, image: img } : withoutImage;

    this.props.onSubmit(val);
  }

  render() {
    const initValues = this.props.initialValues;
    const initName = initValues && initValues.name ? initValues.name : "";
    const initVersion = initValues ? initValues.version : null;
    const initImageSrc = initValues ? initValues.image : "";
    const initDetails = initValues ? initValues.details : "";
    const initActive = initValues ? initValues.active : false;
    return (
      <React.Fragment>
        {this.state.render && (
          <Form
            getApi={this.setFormApi}
            onSubmit={this.formSubmit}
            onSubmitFailure={this.onFail}
          >
            {({ formState }) => (
              <React.Fragment>
                <div className="form-group text-center">
                  <ImageInput field="image" initialValue={initImageSrc} />
                </div>

                {window.user.role_id === 1 && (
                  <div className="form-group">
                    <label
                      htmlFor="channel-name"
                      className={!initValues ? "mandatory" : ""}
                    >
                      Channel Name
                    </label>
                    <Text
                      field="name"
                      className="form-control"
                      id="channel-name"
                      initialValue={initName}
                      validate={validateThreeCharacters}
                      validateOnChange
                      validateOnBlur
                    />
                    {formState.errors.name && this.state.formDirty && (
                      <span
                        style={{
                          color: "red",
                          display: "block",
                          marginTop: "10px"
                        }}
                      >
                        {formState.errors.name}
                      </span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="channel-details">Channel Details</label>

                  <RteField
                    field="details"
                    id="channel-details"
                    initialValue={initDetails}
                  />
                </div>

                {!initValues ||
                  (initValues && !initValues.active && (
                    <div className="form-group">
                      <label htmlFor="channel-version">Channel Version</label>
                      <Select
                        className="form-control"
                        field="version"
                        id="select-status"
                        initialValue={initVersion}
                      >
                        <Option value="" disabled>
                          Select One...
                        </Option>
                        <Option value="v1">Version 1</Option>
                      </Select>
                    </div>
                  ))}

                {!initValues && (
                  <div className="form-group">
                    <label htmlFor="channel-tags">Tags</label>
                    <Text
                      field="tags"
                      className="form-control"
                      id="channel-tags"
                      type="number"
                      min="0"
                    />
                  </div>
                )}

                {initValues &&
                  (!initValues.active || window.user.role_id === 1) && (
                    <div className="form-group">
                      <label className="checkbox">
                        <div className="label">Activate Channel</div>
                        <Checkbox initialValue={initActive} field="active" />
                        <div className="checkbox-field">
                          <div className="checkbox-indicator"></div>
                        </div>
                      </label>
                    </div>
                  )}

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn"
                    disabled={this.disableButton(initValues)}
                  >
                    {this.props.loading && <Loading />}
                    <span className="btn-text">Submit</span>
                  </button>
                </div>
              </React.Fragment>
            )}
          </Form>
        )}
      </React.Fragment>
    );
  }
}

export default ChannelForm;
