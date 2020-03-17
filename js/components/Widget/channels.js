import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import activeImg from '../../../images/active.svg';
import inactiveImg from '../../../images/inactive.svg';
import { withRouter } from 'react-router-dom';

const WidgetChannels = props => (
  <React.Fragment>
    {
      !!props.channels.length &&
        <div className="widget">
          <h2 className="widget-title">{props.company ? props.company + ' / Channels:' : 'Channels:'} </h2>
          <ul className="widget-list">
            {
              props.channels.map(channel => (
                <li key={channel.id} className="widget-list-item">
                  <img src={channel.active ? activeImg : inactiveImg} title={channel.active ? 'Active' : 'Inactive'} alt="" />
                  <NavLink to={`/channels/${channel.id}`} title={channel.active ? 'Active' : 'Inactive'} activeStyle={{ textDecoration: 'underline' }}>
                    <span className="name">{channel.name}</span>
                    <span className="followers">
                      {channel.followers}
                    <span className="word"> {channel.followers === 1 ? 'Follower' : 'Followers'}</span>
                    </span>
                  </NavLink>
                </li>
              ))
            }
          </ul>
        </div>
    }
  </React.Fragment>
)

const mapStateToProps = state => ({
  channels: state.channels
});

export default withRouter(connect(
  mapStateToProps
)(WidgetChannels));