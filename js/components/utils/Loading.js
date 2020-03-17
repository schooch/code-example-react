import React from 'react';

const Loading = props => (
  <div className="lds-css ng-scope">
    <div style={{ width: '100%', height: '100%' }} className="lds-rolling">
      <div style={{color: props.fill}}></div>
    </div>
  </div>
);

export default Loading;