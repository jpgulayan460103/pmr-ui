import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from './../../api/axios.settings';
import style from './style.css'
import { useLocation } from 'react-router-dom'
import LoginForm from './LoginForm'
import UserForm from '../User/UserForm';
import api from '../../api';
import { Steps, Typography, PageHeader } from 'antd';
import LoadLibraries from '../../Components/LoadLibraries';
import logo from './../../Images/logo.png'


const { Title } = Typography;

const { Step } = Steps;
function mapStateToProps(state) {
    return {
        unit_of_measures: state.libraries.unit_of_measures,
    };
}
const Login = () => {
    const location = useLocation();
    useEffect(() => {
        document.title = "Login";
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
    const [registerStep, setRegisterStep] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const itemsTest = () => {
        api.User.all();
    }
    return (
        <div style={style} id="login-container" className='flex justify-center'>
            <LoadLibraries />
            <div id='login-form-container' className='h-full'>
                <div className="flex justify-center w-fit mb-6">
                    <div className='w-60'>
                        <img src={logo} alt="" />
                    </div>
                </div>
                { showRegister ? (
                    <div style={{width: "450px"}}>
                        <UserForm userInfo={formData} setRegisterStep={setRegisterStep} setShowRegister={setShowRegister} type="create" />
                    </div>
                ) : (
                    <LoginForm getAdInfo={getAdInfo} setShowRegister={setShowRegister} setRegisterStep={setRegisterStep} />
                ) }
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Login);
