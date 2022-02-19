import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={(process.env.NODE_ENV == "development" ? '' : process.env.PUBLIC_URL)}>
    {/* <BrowserRouter> */}
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
