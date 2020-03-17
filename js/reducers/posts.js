export default (state = {
  hasMore: true,
  posts: []
}, action) => {
  switch (action.type) {
    case 'SET_POSTS_MORE':
      return {...state, hasMore: action.payload}
    case 'SET_POSTS':
      return {...state, posts: [...state.posts, ...action.payload]};
    case 'RESET_POSTS':
      return {...state, posts: []};
    case 'ADD_POST':
      return {...state, posts: [action.payload, ...state.posts]};
    case 'ADD_COMMENT': {
      const { id } = action.payload;
      return {
        ...state, posts: state.posts.map(post => {
          if (post.id === id) {
            return { ...post, comment_number: post.comment_number + 1 };
          }
        return post;
      })
    }}
    case 'REMOVE_COMMENT': {
      const { id } = action.payload;
      return {
        ...state, posts: state.posts.map(post => {
          if (post.id === id) {
            return { ...post, comment_number: post.comment_number - 1 };
          }
          return post;
      })
    }}
    case 'LIKE_POST': {
      const { id, liked, likes } = action.payload;
      return {
        ...state, posts: state.posts.map(post => {
        if(post.id === id) {
          return {...post, liked, likes_number: likes};
        }
        return post;
      })
    }}
    case 'REMOVE_POST':
      return {...state, posts: state.posts.filter(post => post.id !== action.payload)};
    default: return state;
  }
}