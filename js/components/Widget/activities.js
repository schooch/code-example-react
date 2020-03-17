import React from 'react';

const Activities = props => (
  <div className="widget">
    <h2 className="widget-title">Activity</h2>
    <ul className="widget-list">
      <li className="widget-list-item">Likes: {props.activity.likes}</li>
      <li className="widget-list-item">Comments: {props.activity.comments}</li>
    </ul>
  </div>
);

export default Activities;