export function previewScroll(scroll) {
  return {
    type: 'SET_PREVIEW_SCROLL',
    payload: scroll
  }
}

export function setWebview(state) {
  return {
    type: 'SET_WEBVIEW',
    payload: state
  }
}