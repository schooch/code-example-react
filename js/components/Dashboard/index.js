import React from 'react';
import WidgetCompanies from '../Widget/companies';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Welcome = props => (
  <div className="main">
    <div className="sidebar">
      <WidgetCompanies/>
    </div>
    <div className="dashboard scrollable">
      <h1>Welcome to Skute dashboard.</h1>
      {
        props.registered_users !== undefined &&
        <h2>{props.registered_users} Registered {props.registered_users === 1 ? 'User' : 'Users'}</h2>
      }
      
      <div className="buttons">
        <Link className="btn" to="/companies">All companies</Link>  
        <Link className="btn" to="/create-company">Create new company</Link>  
      </div>
    </div>
  </div>
)

const mapStateToProps = state => ({
  registered_users: state.registered_users
})

export default connect(mapStateToProps)(Welcome);