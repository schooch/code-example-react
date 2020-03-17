import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Image from '../utils/Image';

const CompaniesWidget = props => {
  return (
    <div className="widget">
      {
        !props.largeList &&
        <h2 className="widget-title">Companies:</h2>
      }
      <ul className="widget-list">
        {
          props.companies ?
            <React.Fragment>
              {
                props.companies.length ?
                  props.companies.map(company => (
                    <li key={company.id} className="widget-list-item">
                      <NavLink to={`/companies/${company.id}`} className={props.largeList && 'large-link'} activeStyle={{ textDecoration: 'underline' }}>
                        {
                          props.largeList &&
                          <div className="image-mask-wrapper">
                            <Image
                              className="image-mask"
                              src={company.logo}
                              background />
                          </div>
                        }
                        <span className="name">{company.name}</span>
                        <span className="likes">{company.followers}{props.largeList && company.followers === 1 ? ' Follower' : ' Followers'}</span>
                      </NavLink>
                    </li>
                  )) : <div>0 companies found</div>
              }
            </React.Fragment> : <div>LOADING...</div>
        }
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({
  companies: state.companies
});

export default connect(
  mapStateToProps
)(CompaniesWidget);