export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_APP_USER':
      return action.payload;
    default:
      return state;
  }
}