import React, { Component } from 'react';
import { Form, Text, Scope } from 'informed';
import { validateThreeCharacters, validateEmail } from './validations';
import ImageInput from './utils/imageInput';
import _ from 'lodash';
import Loading from '../utils/Loading';

class CompanyForm extends Component {
  constructor() {
    super();

    this.state = {
      formDirty: false
    }

    this.onFail = this.onFail.bind(this);
    this.setFormApi = this.setFormApi.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  onFail(error) {
    console.log(error)
    this.setState({ formDirty: true });
  }

  setFormApi(formApi) {
    this.formApi = formApi;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialValues && prevProps.initialValues.id !== this.props.initialValues.id) {
      this.formApi.reset();
    }
  }

  formSubmit(values) {
    let iv = this.props.initialValues;
    if (iv && (values.contact_person_name !== iv.contact_person.name || values.contact_person_email !== iv.contact_person.email)) {
      iv.contact_person.name = "";
      iv.contact_person.email = "";
    }
    const img = this.formApi.getValue('logo');
    const object = _.mapKeys(values, (value, key) => {
      
      if (key === 'logo') return 'blank';
      if (key.startsWith('contact_person')) {
        const k = key.replace('contact_person_', '');
        return iv ?
          (iv.contact_person[k] !== value ? key : 'blank') :
          (value !== undefined && !value.length ? 'blank' : key);
      }
      return iv ?
        (iv[key] !== value ? key : 'blank') :
        (value !== undefined && !value.length ? 'blank' : key);
    });
    const { blank, ...withoutImage } = object;
    const val = !!img && !!img.name ? { ...withoutImage, logo: img } : withoutImage;
    this.props.onSubmit(val)
  }

  render() {
    const initValues = this.props.initialValues;
    const initName = initValues && initValues.name ? initValues.name : '';
    const initContactName = initValues ? initValues.contact_person.name : '';
    const initContactEmail = initValues ? initValues.contact_person.email : '';
    const initLogoSrc = initValues ? initValues.logo : null;

    return (
      <Form getApi={this.setFormApi} onSubmit={this.formSubmit} onSubmitFailure={this.onFail}>
        {({ formState }) => (
          <React.Fragment>
            <div className="form-group text-center">
              <ImageInput
                logo={true}
                field="logo"
                initialValue={initLogoSrc}
              />
            </div>

            <div className="form-group">
              <label htmlFor="company-name" className={!initValues ? 'mandatory': ''}>Company Name</label>
              <Text
                field="name"
                className="form-control"
                id="company-name"
                initialValue={initName}
                validate={validateThreeCharacters}
                validateOnChange
                validateOnBlur />
              {
                formState.errors.name &&
                this.state.formDirty &&
                <span style={{ color: 'red', display: 'block', marginTop: '10px' }}>{formState.errors.name}</span>
              }
            </div>

            <div className="form-group">
              <label htmlFor="contact-name" className={!initValues ? 'mandatory': ''}>Contact Name</label>
              <Text
                field="contact_person_name"
                className="form-control"
                initialValue={initContactName}
                validate={validateThreeCharacters}
                validateOnChange
                validateOnBlur
                />
              {
                formState.errors.contact_person_name  &&
                this.state.formDirty &&
                <span style={{ color: 'red', display: 'block', marginTop: '10px' }}>{formState.errors.contact_person_name}</span>
              }
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className={!initValues ? 'mandatory': ''}>Contact Email</label>
              <Text
                field="contact_person_email"
                className="form-control"
                id="contact-email"
                initialValue={initContactEmail}
                validate={validateEmail}
                validateOnChange
                validateOnBlur />
              {
                formState.errors.contact_person_email &&
                this.state.formDirty &&
                <span style={{ color: 'red', display: 'block', marginTop: '10px' }}>{formState.errors.contact_person_email}</span>
              }
            </div>

            <div className="form-group">
              <button type="submit"
                className="btn"
                disabled={initValues && _.isMatch(initValues, this.formApi.getState().values) || this.props.loading}>
                {
                  this.props.loading &&
                  <Loading />
                }
                <span className="btn-text">Submit</span>
              </button>
            </div>
          </React.Fragment>
        )}
      </Form>
    )
  }
}

export default CompanyForm;