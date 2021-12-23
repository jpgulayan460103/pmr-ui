import React, { useState, useEffect } from 'react';
import axios from './../api/axios.settings';

const Login = () => {
    const [token, setToken] = useState("");
    const loginTest = () => {
        axios.post("/api/login",{
            username: "jpgulayan",
            password: "admin123"
        })
        .then(res =>{
            sessionStorage.setItem('session',JSON.stringify(res.data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
        });
    }
    const itemsTest = () => {
        axios.get("/api/items");
    }
    const docuTest = () => {
        axios.get('/api/user')
        .then(response => {
            console.log(response.data);
        });
    }
    return (
        <div>
            <button className='btn btn-primary' onClick={() => { loginTest() }}>Login</button>
            <button className='btn btn-primary' onClick={() => { itemsTest() }}>Items</button>
            <button className='btn btn-primary' onClick={() => { docuTest() }}>Docu</button>
            { token }
        </div>
    );
}

export default Login;
