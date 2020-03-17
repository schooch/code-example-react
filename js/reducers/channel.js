export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_CHANNEL':
      return action.payload;
    case 'SET_CHANNEL_FOLLOWERS':
      if (!state) state;
      return {...state, followers: action.payload};
    default:
      return state;
  }
}