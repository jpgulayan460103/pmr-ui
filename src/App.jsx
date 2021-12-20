import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import './App.less';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap'
import 'react-image-lightbox/style.css';
import Layout from './Layouts/Main'
import Login from './Pages/Login'


const App = (props) => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout>home</Layout>} />
        <Route path="/home" element={<Layout>home</Layout>} />
        <Route path="about" element={<Layout>about</Layout>} />
        <Route path="*" element={<Layout>404</Layout>} />
      </Routes>
    </div>
  );
}

export default App;
