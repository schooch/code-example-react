import React, { Component } from 'react';
import { Form, Text } from 'informed';
import { withAlert } from "react-alert";
import { connect } from 'react-redux';
import Loading from '../utils/Loading';

const validateTags = value => {
  return !value  ? 'Filed cannot be empty' : null;
}

class Tags extends Component {
  constructor() {
    super();

    this.state = {
      loading: false
    }
  }
  setFormApi(formApi) {
    this.formApi = formApi;
  }
  onTagsAdd(values) {
    this.setState({loading: true});
    axios.post(`/web-api/channel/tag/${this.props.channel.id}`, {tag_number: values.tags})
      .then(response => {
        this.setState({ loading: false });
        this.props.alert.success(response.data.info_message);
        this.formApi.setValue('tags', '');
      })
      .catch(error => {
        this.setState({ loading: false });
        this.props.alert.success(error.response.data.message);
        console.log(error.response ? error.response.data.message : error)
      })
  }
  
  render() {
    return (
      <div className="widget">
        <h2 className="widget-title">Tags</h2>
        <ul className="widget-list">
          <li className="widget-list-item">Total: {this.props.tags}</li>
        </ul>
        <Form onSubmit={this.onTagsAdd.bind(this)} getApi={this.setFormApi.bind(this)}>
          {({ formState }) => (
            <React.Fragment>
              <div className="form-group">
                <label htmlFor="more-tags">Add more tags:</label>
                <Text
                  type="number"
                  id="more-tags"
                  field="tags"
                  validate={validateTags}
                  min="0"
                  className="form-control" />
                {
                  formState.errors.tags &&
                  <span style={{ color: 'red', display: 'block', marginTop: '10px' }}>{formState.errors.name}</span>
                }
              </div>
              <div className="form-group">
                <button className="btn" type="submit" disabled={this.state.loading || !formState.values.tags || !formState.values.tags.length}>
                  {
                    this.state.loading &&
                    <Loading />
                  }
                  <span className="btn-text">Add</span>
                </button>
              </div>
            </React.Fragment>
          )}
        </Form>
        {
          !!this.props.tags &&
          <div className="form-group">
            <a href={`${window.BASE_URL}/web-api/channel/tag/${this.props.channel.id}`} className="btn" target="_blank">Download CSV file</a>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  channel: state.channel
})

export default connect(mapStateToProps)(withAlert(Tags));