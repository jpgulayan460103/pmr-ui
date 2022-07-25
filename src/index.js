import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ThemeSwitcherProvider } from "react-css-theme-switcher";

const themes = {
  main: `${process.env.PUBLIC_URL}/main-theme.css`,
  green: `${process.env.PUBLIC_URL}/green-theme.css`,
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  purple: `${process.env.PUBLIC_URL}/purple-theme.css`,
  orange: `${process.env.PUBLIC_URL}/orange-theme.css`,
  blue: `${process.env.PUBLIC_URL}/blue-theme.css`,
  pink: `${process.env.PUBLIC_URL}/pink-theme.css`,
  yellow: `${process.env.PUBLIC_URL}/yellow-theme.css`,
};

const defaultTheme = localStorage.getItem("theme");


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={(process.env.NODE_ENV == "development" ? '' : process.env.PUBLIC_URL)}>
    {/* <BrowserRouter> */}
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={defaultTheme}>
      <App />
    </ThemeSwitcherProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// serviceWorkerRegistration.register();
// serviceWorkerRegistration.unregister();

const dir = process.env.NODE_ENV == "development" ? "" : process.env.PUBLIC_URL;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(`${dir}/firebase-messaging-sw.js`, { scope: dir });
}