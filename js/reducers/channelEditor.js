export default (state = false, action) => {
  switch (action.type) {
    case 'SET_CHANNEL_EDITOR':
    if (!action.payload.editor) {
      return false;
    }
      const { editor, post } = action.payload;
      return { editor, post };
    default: return state;
  }
}