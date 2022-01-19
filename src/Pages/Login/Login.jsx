import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from './../../api/axios.settings';
import style from './style.css'
import { useLocation } from 'react-router-dom'
import LoginForm from './LoginForm'
import RegistrationFormAccount from './RegistrationFormAccount'
import RegistrationFormActive from './RegistrationFormActive'
import LoginFormActive from './LoginFormActive'
import api from '../../api';
import { Steps, Typography, PageHeader } from 'antd';
import LoadLibraries from '../../Components/LoadLibraries';


const { Title } = Typography;

const { Step } = Steps;
function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
    };
}
const Login = () => {
    const location = useLocation();
    useEffect(() => {
        
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
        <div style={style} id="container">
            <LoadLibraries />
            {/* <button className='btn btn-primary' onClick={() => { loginTest() }}>Login</button> */}
            {/* <button className='btn btn-primary' onClick={() => { itemsTest() }}>Items</button> */}
            {/* <button className='btn btn-primary' onClick={() => { docuTest() }}>Docu</button> */}
            <div id="login-container">
                <div className='row'>
                    <div className='col-md-6 col-sm-12'>
                        { showRegister ? (
                            <>
                                <Title level={2} className='text-center'>User Registration</Title>
                                <RegistrationFormActive userInfo={formData} setRegisterStep={setRegisterStep} type="create" />
                            </>
                        ) : (
                            <LoginForm getAdInfo={getAdInfo} setShowRegister={setShowRegister} setRegisterStep={setRegisterStep} />
                        ) }
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        {/* { showRegister ? (<RegistrationFormActive firstname={formData.firstname} middlename={formData.middlename} lastname={formData.lastname} />) : "" } */}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Login);
