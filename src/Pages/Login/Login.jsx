import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from './../../api/axios.settings';
import style from './style.css'
import { useLocation } from 'react-router-dom'
import LoginForm from './LoginForm'
import RegistrationFormAccount from './RegistrationFormAccount'
import RegistrationFormActive from './RegistrationFormActive'
import LoginFormActive from './LoginFormActive'

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
    };
}
const Login = () => {
    const location = useLocation();
    useEffect(() => {
        if(location.pathname != "/login"){
            if (sessionStorage.getItem("session") === null) {
                window.location = "/login"
            }
        }
    }, []);

    const [formData, setFormData] = useState({
        firstname: "",
        middlename: "",
        lastname: "",
    });
    const getAdInfo = (user_info) => {
        setFormData(oldArray => ({
            ...oldArray,
            ...user_info
        }));
    }
    const [token, setToken] = useState("");
    const loginTest = () => {
        axios.post("/api/login",{
            username: "jpgulayan",
            password: "admin123"
        })
        .then(res =>{
            sessionStorage.setItem('session',JSON.stringify(res.data));
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
            if(location.pathname == "/login"){
                window.location = "/"
            }
        });
    }


    return (
        <div style={style} id="container">
            {/* <button className='btn btn-primary' onClick={() => { loginTest() }}>Login</button> */}
            {/* <button className='btn btn-primary' onClick={() => { itemsTest() }}>Items</button> */}
            {/* <button className='btn btn-primary' onClick={() => { docuTest() }}>Docu</button> */}
            { token }
            <div id="login-container">
                <div className='row'>
                    <div className='col-md-6 col-sm-12'>
                        <LoginFormActive getAdInfo={getAdInfo} />
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <RegistrationFormActive firstname={formData.firstname} middlename={formData.middlename} lastname={formData.lastname} />
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Login);
