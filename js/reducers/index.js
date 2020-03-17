import { combineReducers } from 'redux';
import companies from './companies';
import channelEditor from './channelEditor';
import channels from './channels';
import channel from './channel';
import appuser from './appuser';
import post from './post';
import posts from './posts';
import webview from './webview';
import previewScroll from './previewScroll';
import registered_users from './registered_users';
import comments from './comments';

export default combineReducers({
  companies,
  channelEditor,
  channels,
  channel,
  appuser,
  post,
  posts,
  comments,
  previewScroll,
  webview,
  registered_users
})