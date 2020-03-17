export function setPosts(posts) {
  return {
    type: 'SET_POSTS',
    payload: posts
  }
}

export function resetPosts() {
  return {
    type: 'RESET_POSTS'
  }
}

export function addPost(post) {
  return {
    type: 'ADD_POST',
    payload: post
  }
}

export function setPostsMore(more) {
  return {
    type: 'SET_POSTS_MORE',
    payload: more
  }
}

export function removePost(postId) {
  return {
    type: 'REMOVE_POST',
    payload: postId
  }
}

export function setPost(post) {
  return {
    type: 'SET_POST',
    payload: post
  }
}

export function likePost(liked) {
  return {
    type: 'LIKE_POST',
    payload: liked
  }
}