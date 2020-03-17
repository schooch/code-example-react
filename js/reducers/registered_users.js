export default (state = null, action) => {
  switch (action.type) {
    case 'SET_REGISTERED_USERS':
      return action.payload;
    default: return state;
  }
}