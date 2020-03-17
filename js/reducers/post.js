export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_POST':
      return action.payload;
    case 'ADD_COMMENT': {
      return { ...state, comment_number: state.comment_number + 1 };
    }
    case 'LIKE_POST':
      const { liked, likes } = action.payload;
      return { ...state, liked, likes_number: likes };
    case 'CHANGE_COMMENT_NUMBER':
      const { comment_number } = action.payload;
      return { ...state, comment_number };
    default: return state;
  }
}