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


const App = (props) => {
  // return (
  //   <div>
  //     {/* <PurchaseRequest /> */}
  //     <Login />
  //   </div>
  // );
  return (
    <div className="App">
      <LoadLibraries />
      <Routes>
        <Route path="/" element={<Layout></Layout>} />
        <Route path="/purchase-request/create" element={<Layout><CreatePurchaseRequest /><Login /></Layout>} />
        <Route path="/purchase-request" element={<Layout><ListPurchaseRequest /><Login /></Layout>} />
        <Route path="about" element={<Layout>about</Layout>} />
        <Route path="*" element={<Layout>404</Layout>} />
      </Routes>
    </div>
  );
}

export default App;
