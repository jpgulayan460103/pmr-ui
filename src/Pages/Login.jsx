import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [token, setToken] = useState("");
    const loginTest = () => {
        axios.post("http://pmr-api.test/api/login",{
            username: "jpgulayan",
            password: "admin123"
        })
        .then(res =>{
            // setToken(res.data.access_token);
            sessionStorage.setItem('session',JSON.stringify(res.data));
            // cookies.set('token', res.data.access_token, { path: '/' });
            // axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
        });
    }
    const itemsTest = () => {
        let access_token = JSON.parse(sessionStorage.getItem("session")).access_token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        axios.get("http://pmr-api.test/api/items");
    }
    const docuTest = () => {
        // axios.defaults.withCredentials = true;
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        axios.get('http://pmr-api.test/api/user')
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
