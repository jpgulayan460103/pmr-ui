import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  Redirect,
  BrowserRouter,
} from "react-router-dom";
import './App.less';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-image-lightbox/style.css';
import Layout from './Layouts/Main'
import Login from './Pages/Login/Login'
import CreatePurchaseRequest from './Pages/PurchaseRequest/CreatePurchaseRequest'
import ListPurchaseRequest from './Pages/PurchaseRequest/ListPurchaseRequest'
import ListLibrary from './Pages/Library/ListLibrary'
import User from './Pages/User/User'
import Echo from 'laravel-echo';
import ForwardedForm from './Pages/Forms/ForwardedForm';
import ApprovedForm from './Pages/Forms/ApprovedForm';
import DisapprovedForm from './Pages/Forms/DisapprovedForm';
import Procurement from './Pages/Procurement/Procurement'
import Quotation from './Pages/Quotation/Quotation';
import ActivityLogs from './Pages/ActivityLogs/ActivityLogs';


window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: (process.env.NODE_ENV == "development" ? process.env.REACT_APP_PUSHER_APP_KEY_PRODUCTION : process.env.REACT_APP_PUSHER_APP_KEY_DEVEOPMENT),
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    forceTLS: false,
    wsHost: (process.env.NODE_ENV == "development" ? process.env.REACT_APP_DEVELOPMENT_WS_HOST : process.env.REACT_APP_PRODUCTION_WS_HOST),
    wsPort: 6001,
});
const auth = {
  isAuthenticated: false,
};
const PrivateRoute  = ({ children, ...props }) => {
  let location = useLocation();
  if (sessionStorage.getItem("session") !== null) {
    auth.isAuthenticated = true;
  }
  if (!auth.isAuthenticated) {
    return <Redirect to="/login" />;
  }
  return children;
}
const App = (props) => {
  return (
    <Router>

<BrowserRouter
        getUserConfirmation={() => {
          /* Empty callback to block the default browser prompt */
        }}
      >
        <Switch>
          <Route exact path="/"  >
              <PrivateRoute><Layout></Layout></PrivateRoute>
          </Route>
          <Route exact path="/procurement"  >
              <PrivateRoute><Layout><Procurement /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/procurement/quotations"  >
              <PrivateRoute><Layout><Quotation /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/procurement/quotations/form"  >
              <PrivateRoute><Layout><Quotation /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/procurement/quotations"  >
              <PrivateRoute><Layout><Quotation /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/procurement/quotations/suppliers"  >
              <PrivateRoute><Layout><Quotation /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/forms/forwarded"  >
              <PrivateRoute><Layout><ForwardedForm /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/forms/approved"  >
              <PrivateRoute><Layout><ApprovedForm /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/forms/disapproved"  >
              <PrivateRoute><Layout><DisapprovedForm /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/purchase-requests/form"  >
              <PrivateRoute><Layout><CreatePurchaseRequest /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/purchase-requests"  >
              <PrivateRoute><Layout><ListPurchaseRequest /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/libraries"  >
              <PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/libraries/items"  >
              <PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/libraries/items/categories"  >
              <PrivateRoute><Layout><ListLibrary libraryType="item_categories"/></Layout></PrivateRoute>
          </Route>
          <Route exact path="/libraries/items/measures"  >
              <PrivateRoute><Layout><ListLibrary libraryType="unit_of_measures" /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/libraries/offices/divisions"  >
              <PrivateRoute><Layout><ListLibrary libraryType="user_divisions" options={{parent: true, title: true, parentLabel: "Division"}} /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/libraries/offices/sections"  >
              <PrivateRoute><Layout><ListLibrary libraryType="user_sections" options={{parent: true, title: true, parentLabel: "Division"}} /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/libraries/user_offices/administrators"  >
              <PrivateRoute><Layout><ListLibrary libraryType="user_signatory_names" options={{parent: true, title: true, parentLabel: "Designation"}} /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/libraries/user_offices/purchase-requests"  >
              <PrivateRoute><Layout><ListLibrary libraryType="user_signatory_names" /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/users"  >
              <PrivateRoute><Layout><User /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/activity-logs"  >
              <PrivateRoute><Layout><ActivityLogs /></Layout></PrivateRoute>
          </Route>
          <Route exact path="/login"  >
              <Login />
          </Route>
          <Route exact path="/logout"  >
              <Login />
          </Route>
          <Route exact path="*"  >
            <PrivateRoute><Layout></Layout></PrivateRoute>
          </Route>
        </Switch>
        </BrowserRouter>
    </Router>
  );
}

export default App;
