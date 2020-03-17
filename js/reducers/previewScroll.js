const initState = 0;
export default (state = initState, action) => {
  switch (action.type) {
    case 'SET_PREVIEW_SCROLL':
      return action.payload;
    default: return state;
  }
}