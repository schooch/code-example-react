import _ from 'lodash';
const initState = null;

export default (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_COMPANIES':
      return action.payload.companies;
    case 'SET_COMPANY':
      const id = action.payload.company.id;
      const index = _.findIndex(state, { id });
      if(index >= 0) {
        return state.map(item => {
          if(item.id === id) {
            return action.payload.company;
          }
          return item;
        })
      }
      return [...state, {...action.payload.company}]
    default: return state;
  }
}