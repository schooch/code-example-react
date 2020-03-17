export default (state = [], action) => {
  switch (action.type) {
    case 'RESET_COMMENTS':
      return action.payload;
    case 'SET_COMMENTS':
      return [...state, ...action.payload];
    case 'CLEAR_COMMENTS':
      return [];
    case 'ADD_COMMENT':
      return [action.payload.comment, ...state];
    case 'REMOVE_COMMENT':
      return state.filter(post => post.id !== action.payload.comment);
    default: return state;
  }
}