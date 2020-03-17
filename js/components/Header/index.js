import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import LogoSvg from '../../../images/logo.svg'; 

class Header extends Component {
  logout() {
    axios.get('/web-api/logout')
      .then(response => {
        window.location.replace('/');
      })
      .catch(err => {
      })
  }
  render() {
    return (
      <div className="header">
        <h2 className="logo"><Link to={'/'}>
          <img src={LogoSvg} width="100px" alt=""/>
          <span className="version">{window.cmsVersion}</span>
        </Link></h2>
        {window.user.role_id === 1 &&
          <ul className="left">
            <li><NavLink to={'/'} exact activeStyle={{ textDecoration: 'underline' }}>Dashboard</NavLink></li>
            <li><NavLink to={'/companies'} exact activeStyle={{ textDecoration: 'underline' }}>Companies</NavLink></li>
            <li><NavLink to={'/users'} exact activeStyle={{ textDecoration: 'underline' }}>Users</NavLink></li>
          </ul>
        }
        {window.user.role_id === 2 &&
          <ul className="left">
            <li><NavLink to={'/'} exact activeStyle={{ textDecoration: 'underline' }}>Dashboard</NavLink></li>
          </ul>
        }
        <ul>
          <li><button onClick={() => this.logout()}>Sign-Out</button></li>
        </ul>
      </div>
    )
  }
}

export default Header;