export function setChannels(channels) {
  return {
    type: 'SET_CHANNELS',
    payload: channels
  }
}

export function addChannelToChannels(channel) {
  return {
    type: 'ADD_CHANNEL',
    payload: channel
  }
}

export function modifyChannelInChannels(channel) {
  return {
    type: 'MODIFY_CHANNEL',
    payload: channel
  }
}

///for channel reducer
export function setChannelFollowers(followers) {
  return {
    type: 'SET_CHANNEL_FOLLOWERS',
    payload: followers
  }
}

///for channel reducer
export function setChannel(channel) {
  return {
    type: 'SET_CHANNEL',
    payload: channel
  }
}

export function channelEditor(editor, post) {
  return {
    type: 'SET_CHANNEL_EDITOR',
    payload: {
      editor,
      post
    }
  }
}