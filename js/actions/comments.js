export function setComments(comments) {
  return {
    type: 'SET_COMMENTS',
    payload: comments
  }
}
export function resetComments(comments) {
  return {
    type: 'RESET_COMMENTS',
    payload: comments
  }
}
export function clearComments() {
  return {
    type: 'CLEAR_COMMENTS'
  }
}

export function addComment(comment, id) {
  return {
    type: 'ADD_COMMENT',
    payload: {
      comment,
      id
    }
  }
}

export function removeComment(comment, id) {
  return {
    type: 'REMOVE_COMMENT',
    payload: {
      comment,
      id
    }
  }
}

export function changeCommentNumber(comment_number, id) {
  return {
    type: 'CHANGE_COMMENT_NUMBER',
    payload: {
      comment_number,
      id
    }
  }
}