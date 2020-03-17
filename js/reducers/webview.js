const initState = false;
export default (state = initState, action) => {
  switch (action.type) {
    case 'SET_WEBVIEW':
      return action.payload;
    default: return state;
  }
}