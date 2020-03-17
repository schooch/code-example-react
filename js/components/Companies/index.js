import React, { Component } from 'react';
import WidgetCompanies from '../Widget/companies';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Companies extends Component {
  render() {
    return (
      <div className="main">
        <div className="scrollable">
          <div className="text-center">
            <Link className="btn" to={'/create-company'} style={{ display: 'inline-block', width: 'auto' }}>Create New Company</Link>
          </div>
          <div className="company-list">
            <WidgetCompanies largeList={true} />
          </div>
        </div>        
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  companies: state.companies
})

export default connect(mapStateToProps)(Companies);