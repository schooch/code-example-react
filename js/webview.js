window.axios = require('axios');
window.axios.defaults.headers.common['Authorization'] = window.token;

if (window.token) {
  window.axios.defaults.headers.common['Authorization'] = window.token;
}

if (window.source) {
  window.axios.defaults.headers.common['X-SOURCE'] = window.source;
}

require('./index-webview');
