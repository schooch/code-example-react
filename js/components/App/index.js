import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Channel from '../Channel';
import Company from '../Company';
import Companies from '../Companies';
import Dashboard from '../Dashboard';
import Header from '../Header';
import Users from '../Users';
import CreateUser from '../User/new';
import CreateCompany from '../Company/new';
import NoMatch from '../NoMatch';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { fetchCompanies } from '../../actions/companies';

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    window.user.role_id === 1
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Route component={Header} />
          <Switch>
            <Route exact path={'/'} component={Dashboard} />
            <Route strict path={'/channels/:id'} component={Channel} />
            <AdminRoute strict exact path={'/companies'} component={Companies} />
            <AdminRoute strict exact path={'/companies/:id'} component={Company} />
            <AdminRoute strict exact path={'/create-company'} component={CreateCompany} />
            <AdminRoute strict exact path={'/users'} component={Users} />
            <AdminRoute strict exact path={'/create-user'} component={CreateUser} />
            <Route path='/web-api/channel/post/' component={() => window.location = 'https://skute.me'} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }

  componentWillMount() {
    this.props.fetchCompanies();
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    fetchCompanies
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(App);
