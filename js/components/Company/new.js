import React, { Component } from 'react';
import CompanyForm from '../Form/company';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCompany } from '../../actions/companies';
import FormData from 'form-data';
import { withAlert } from "react-alert";

class CreateNew extends Component {
  constructor() {
    super();

    this.state = {
      loading: false
    }

    this.companyFormSubmit = this.companyFormSubmit.bind(this);
  }

  companyFormSubmit(values) {
    this.setState({ loading: true });
    const formData = new FormData();
    _.each(values, function (value, key) {
      formData.append(key, value)
    });

    axios.post('/web-api/company/create', formData)
    .then(response => {
      const { data } = response;
      this.setState({ loading: false })
      this.props.setCompany(data);
      this.props.alert.success(response.statusText);
      this.props.history.push(`/companies/${data.id}`);
    })
    .catch(error => {
      console.log(error.response ? error.response : error)
      this.setState({ loading: false });
      this.props.alert.error(error.response.data.message);
    })
  }

  render() {
    return (
      <div className="main">
        <div className="content-wrapper">
          <div className="editor">
            <h1 className="text-center">Create New Company</h1>
            <CompanyForm
              onSubmit={this.companyFormSubmit}
              loading={this.state.loading} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setCompany
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(withAlert(CreateNew));