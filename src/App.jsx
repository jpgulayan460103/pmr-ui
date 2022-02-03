import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import ListForApproval from './Pages/Forms/ListForApproval';
import Procurement from './Pages/Procurement/Procurement'
import Pmr from './Pmr'

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: "12345",
    cluster: "mt1",
    forceTLS: false,
    wsHost: "pmr-api.test",
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
const App = (props) => {
  useEffect(async () => {
    let permission = await Notification.requestPermission();
    
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PrivateRoute><Layout></Layout></PrivateRoute>} />
        <Route path="/procurement" element={<PrivateRoute><Layout><Procurement type="Procurement" /></Layout></PrivateRoute>} />
        <Route path="/procurement/canvass" element={<PrivateRoute><Layout><Procurement type="Canvass" /></Layout></PrivateRoute>} />
        <Route path="/forms/requests" element={<PrivateRoute><Layout><ListForApproval /></Layout></PrivateRoute>} />
        <Route path="/forms/approved" element={<PrivateRoute><Layout><ListForApproval /></Layout></PrivateRoute>} />
        <Route path="/forms/disapproved" element={<PrivateRoute><Layout><ListForApproval /></Layout></PrivateRoute>} />
        <Route path="/purchase-requests/form" element={<PrivateRoute><Layout><CreatePurchaseRequest /></Layout></PrivateRoute>} />
        <Route path="/purchase-requests" element={<PrivateRoute><Layout><ListPurchaseRequest /></Layout></PrivateRoute>} />
        <Route path="/libraries" element={<PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>} />
        <Route path="/libraries/items" element={<PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>} />
        <Route path="/libraries/items/categories" element={<PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>} />
        <Route path="/libraries/items/measures" element={<PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>} />
        <Route path="/libraries/offices/divisions" element={<PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>} />
        <Route path="/libraries/offices/sections" element={<PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>} />
        <Route path="/libraries/signatories/administrators" element={<PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>} />
        <Route path="/libraries/signatories/purchase-requests" element={<PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Layout><User /></Layout></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="*" element={<Layout>404</Layout>} />
      </Routes>
    </div>
  );
}

export default App;
