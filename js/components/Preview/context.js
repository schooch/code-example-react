import React from 'react';

export const PreviewContext = React.createContext({
  followed: false,
  toggleFollowed: () => {}
});

export const CommentsContext = React.createContext({
  scrollToComments: () => {},
  resetComments: () => {}
});

export const UserBlockContext = React.createContext({
  resetComments: () => {}
});