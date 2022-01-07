import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import './App.less';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap'
import 'react-image-lightbox/style.css';
import Layout from './Layouts/Main'
import Login from './Pages/Login/Login'
import LoadLibraries from './Components/LoadLibraries'
import CreatePurchaseRequest from './Pages/PurchaseRequest/CreatePurchaseRequest'
import ListPurchaseRequest from './Pages/PurchaseRequest/ListPurchaseRequest'
import ListLibrary from './Pages/Library/ListLibrary'
import User from './Pages/User/User'
import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: "12345",
    cluster: "mt1",
    forceTLS: false,
    wsHost: "pmr-api.test",
    wsPort: 6001,
});

const App = (props) => {
  useEffect(async () => {
    let permission = await Notification.requestPermission();
    
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Layout></Layout>} />
        <Route path="purchase-requests/create" element={<Layout><CreatePurchaseRequest /></Layout>} />
        <Route path="purchase-requests" element={<Layout><ListPurchaseRequest /></Layout>} />
        <Route path="libraries" element={<Layout><ListLibrary /></Layout>} />
        <Route path="users" element={<Layout><User /></Layout>} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Login />} />
        <Route path="*" element={<Layout>404</Layout>} />
      </Routes>
    </div>
  );
}

export default App;
