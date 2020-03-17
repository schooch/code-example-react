import React, { Component } from 'react';
import { Form, Text, Select, Option } from 'informed';
import { validateThreeCharacters, validateEmail } from './validations';
import { connect } from 'react-redux';
import _ from 'lodash';
import Loading from '../utils/Loading';

class UserForm extends Component {
  constructor() {
    super();

    this.state = {
      formDirty: false,
      channels: false
    }

    this.onFail = this.onFail.bind(this);
    this.setFormApi = this.setFormApi.bind(this);
    this.companyChange = this.companyChange.bind(this);
  }

  onFail() {
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

  companyChange(e) {
    axios.get(`/web-api/company/${e.target.value}`)
      .then(response => {
        this.setState({channels: response.data.channels});
        this.formApi.setValue('channel', '');
      })
      .catch(error => {
        console.log(error.response);
      })
  }

  render() {
    const initValues = this.props.initialValues;
    const initName = initValues ? initValues.name : '';
    const initEmail = initValues ? initValues.email : '';
    const initCompany = initValues ? initValues.company : '';
    const initChannel = initValues ? initValues.channel : '';

    return (
      <Form getApi={this.setFormApi} onSubmit={this.props.onSubmit} onSubmitFailure={this.onFail}>
        {({ formState }) => (
          <React.Fragment>
            <div className="form-group">
              <label htmlFor="user-name" className={!initValues ? 'mandatory' : ''}>Full Name</label>
              <Text
                field="name"
                className="form-control"
                id="user-name"
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
              <label htmlFor="user-email" className={!initValues ? 'mandatory' : ''}>Email</label>
              <Text
                field="email"
                className="form-control"
                id="user-email"
                initialValue={initEmail}
                validate={validateEmail}
                validateOnChange
                validateOnBlur />
              {formState.errors.email &&
                this.state.formDirty &&
                <span style={{ color: 'red', display: 'block', marginTop: '10px' }}>{formState.errors.email}</span>
              }
            </div>

            {
              // this.props.companies &&
              // <div className="form-group">
              //   <label htmlFor="user-company">Assign Company</label>
              //   <Select
              //     className="form-control"
              //     field="company"
              //     id="user-company"
              //     onChange={this.companyChange}
              //     initialValue={initCompany}>
              //     <Option value="" disabled>Select One...</Option>
              //     {
              //       this.props.companies.map(company => <Option key={company.id} value={company.id}>{company.name}</Option>)
              //     }
              //   </Select>
              //   {
              //     this.state.channels && !this.state.channels.length &&
              //       <span style={{ color: 'red', display: 'block', marginTop: '10px' }}>This company has no channels</span>
              //   }
              // </div>
            }
            {
              // this.state.channels && !!this.state.channels.length &&
              // <div className="form-group">
              //   <label htmlFor="user-channel">Assign Channel</label>
              //   <Select
              //     className="form-control"
              //     field="channel"
              //     multiple
              //     id="user-channel"
              //     initialValue={initChannel}
              //     style={{height: '100px'}}>
              //     {
              //       this.state.channels.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option>)
              //     }
              //   </Select> 
              // </div>
            }

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

            {
              // this.props.loading &&
              // <div className="form-group">
              //   <p>LOADING...</p>
              // </div>
            }
          </React.Fragment>
        )}
      </Form>
    )
  }
}

const mapStateToProps = state => ({
  companies: state.companies
});

export default connect(mapStateToProps)(UserForm);