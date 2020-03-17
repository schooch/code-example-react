export default (state = [], action) => {
  switch (action.type) {
    case 'SET_CHANNELS':
      return action.payload;
    case 'ADD_CHANNEL':
      return [...state, action.payload];
    case 'MODIFY_CHANNEL':
      return state.map(channel => {
          if(channel.id === action.payload.id) {
          const changes = _.pickBy(action.payload, function (value, key) {
            return value !== channel[key];
          });
          return {...channel, ...changes};
        }
        return channel;
      });
    default: return state;
  }
}