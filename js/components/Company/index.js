import React, { Component } from 'react';
import { connect } from 'react-redux';
import WidgetCompanies from '../Widget/companies';
import WidgetChannels from '../Widget/channels';
import CompanyForm from '../Form/company';
import ChannelForm from '../Form/channel';
import { setCompany } from '../../actions/companies';
import { setChannels, addChannelToChannels } from '../../actions/channels';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { withAlert } from "react-alert";
import FormData from 'form-data';
import Image from '../utils/Image';

class Company extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      editorActive: false,
      editServerError: false,
      fatchCompanyError: false,
      loadingEdit: false,
      loadingChannelCreate: false,
      company: null
    }
    this.companyFormEdit = this.companyFormEdit.bind(this);
    this.fetchCompany = this.fetchCompany.bind(this);
    this.createChannel = this.createChannel.bind(this);
  }

  companyFormEdit(values) {
    this.setState({ loadingEdit: true});
    const formData = new FormData();
    _.each(values, function (value, key) {
      formData.append(key, value);
    });

    axios.post(`/web-api/company/${this.state.company.id}`, formData)
      .then(response => {
        this.props.alert.success('Company has been edited.');
        this.changeEditor();
        this.props.setCompany(response.data);
        this.setState({ company: response.data, loadingEdit: false })
      })
      .catch(error => {
        this.props.alert.error(error.response.data.message);
        this.setState({ loadingEdit: false })
      })
  }

  changeEditor(editor) {
    if(editor !== this.state.editorActive) {
      const editorActive = editor ? editor : false;
      this.setState({ editorActive });
    }
  }

  fetchCompany(id) {
    this.setState({ company: null, fatchCompanyError: false })
    axios.get(`/web-api/company/${id ? id : this.props.match.params.id}`)
    .then(response => {
        this.setState({ company: response.data })
        this.props.setChannels(response.data.channels);
      })
      .catch(error => {
        this.setState({ fatchCompanyError: error.response.data.message });
      })
  }

  createChannel(values) {
    this.setState({ loadingChannelCreate: true });
    const formData = new FormData();
    _.each(values, function (value, key) {
      formData.append(key, value)
    });

    formData.append('company_id', this.state.company.id);

    axios.post('/web-api/channel/create', formData)
      .then(response => {
        const { data } = response;
        this.setState({ loadingChannelCreate: false })
        this.props.addChannelToChannels(data);
        this.props.history.push(`/channels/${data.id}`);
      })
      .catch(error => {
        this.setState({ loadingChannelCreate: false });
        this.props.alert.error(error.response.data.message);
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchCompany(nextProps.match.params.id);
    }
  }

  componentWillMount() {
    this.fetchCompany();
  }

  render() {
    const { company, fatchCompanyError } = this.state;
    const companyInfo = company ? {
      name: company.name,
      logo: company.logo,
      contact_person: {
        name: company.contact_person ? company.contact_person.name : '',
        email: company.contact_person ? company.contact_person.email : '',
      }
    } : null;
  
    return (
      <div className="main">
        {
          company ?
          <React.Fragment>
            <div className="sidebar">
              <WidgetCompanies />
            </div>
            <div className="content-wrapper">
              <div className="content">
                <div className="preview scrollable">
                  <div className="company-header">
                    <h1>{company.name}</h1>
                    <Image
                      className="image-mask"
                      src={company.logo}
                      background />
                  </div>
                  <WidgetChannels channels={company.channels} />
                </div>

                <div className="editor">
                  <button
                    className={`btn ${this.state.editorActive === 'company' ? 'active' : ''}`}
                    onClick={() => this.changeEditor('company')}>
                    Edit Company
                    </button>
                  <button
                    className={`btn ${this.state.editorActive === 'channel' ? 'active' : ''}`} 
                    onClick={() => this.changeEditor('channel')}>
                    Create channel
                    </button>
                  {
                    this.state.editorActive === 'company' &&
                    <CompanyForm
                      onSubmit={this.companyFormEdit}
                      serverError={this.state.editServerError}
                      loading={this.state.loadingEdit}
                      initialValues={companyInfo} />
                  }
                  {
                    this.state.editorActive === 'channel' &&
                    <ChannelForm
                      onSubmit={this.createChannel}
                      loading={this.state.loadingChannelCreate} />
                  }
                  {
                    this.state.editorActive &&
                    <div className="form-group">
                      <button
                        className="btn"
                        onClick={() => this.changeEditor()}>
                        Cancel
                    </button>
                    </div>
                  }
                </div>
                </div>

              </div>
          </React.Fragment> :
            !company && fatchCompanyError ?
            <div className="content">
              <div className="preview scrollable">
                <div className="company-header">
                  <h1>{fatchCompanyError}</h1>
                  </div>
              </div>
            </div> :
            <div className="content">
              <div className="preview scrollable">
                <div className="company-header">
                  <h1>LOADING...</h1>
                </div>
              </div>
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  companies: state.companies
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setChannels,
    addChannelToChannels,
    setCompany
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(withAlert(Company));