import React, { useState } from 'react';
import axios from "axios";


const Login = () => {
    const [token, setToken] = useState(null);
    const login = () => {
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:8000/api/login',{ username: "cortez.wisoky@example.net", password: "password" })
        .then(res => {
            setToken(res.data.access_token);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    const users = () => {
        axios.defaults.withCredentials = true;
        // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        axios.get('http://localhost:8000/api/user');
    }
    return ( 
        <div>
            <input type="text" />
            <button type="button" onClick={() => { login() }}>login</button>
            <button type="button" onClick={() => { users() }}>users</button>
        </div>
     );
}
 
export default Login;