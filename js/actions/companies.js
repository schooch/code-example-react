export function setCompanies(companies) {
  return {
    type: 'FETCH_COMPANIES',
    payload: {
      companies
    }
  }
}

export function setCompany(company) {
  return {
    type: 'SET_COMPANY',
    payload: {
      company
    }
  }
}

export function setRegisteredUsers(users) {
  return {
    type: 'SET_REGISTERED_USERS',
    payload: users
  }
}

export function fetchCompanies() {
  return dispatch => {
    axios.get('/web-api/company/all')
      .then(response => {
        dispatch(setCompanies(response.data.data));
        dispatch(setRegisteredUsers(response.data.registred_app_users));
      })
      .catch(error => {
        console.log(error.response ? error.response : error);
        dispatch(setCompanies(error.response.message));
      })
  }
}