import React, { Component } from 'react';
import UserForm from '../Form/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { setUser } from '../../actions/users';
import { withAlert } from "react-alert";

class CreateNew extends Component {
  constructor() {
    super();

    this.state = {
      loading: false
    }

    this.userFormSubmit = this.userFormSubmit.bind(this);
  }
  userFormSubmit(values) {
    this.setState({ loading: true });
    axios.post('/web-api/user/create', values)
      .then(response => {
        const { data } = response;
        this.setState({ loading: false })
        this.props.history.push(`/users`);
        this.props.alert.success('User has been created.');
      })
      .catch(error => {
        console.log(error)
        this.setState({ loading: false });
        this.props.alert.error(error.response.data.message);
      })
  }
  render() {
    return (
      <div className="main">
        <div className="content-wrapper">
          <div className="editor">
            <h1 className="text-center">Create New User</h1>
            <UserForm
              onSubmit={this.userFormSubmit}
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
    // setUser
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(withAlert(CreateNew));