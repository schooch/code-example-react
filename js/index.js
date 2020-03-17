import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from "react-alert-template-basic";
import 'babel-polyfill';

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk))

const alertOptions = {
  timeout: 5000,
  position: "bottom center",
  textTransform: 'none'
};

ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <App />
    </AlertProvider>
  </Provider>,
  document.getElementById('root')
);
