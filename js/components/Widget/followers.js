import React from 'react';

const Followers = props => (
  <div className="widget">
    <h2 className="widget-title">{props.followers} {props.followers === 1 ? 'Follower' : 'Followers'}</h2>
  </div>
);

export default Followers;