import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Divider, Typography, Checkbox  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../api';
import customAxios from '../../api/axios.settings';
import { useLocation, useHistory  } from "react-router-dom";
import Themepicker from '../../Components/ThemePicker';
import dayjs from 'dayjs';

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        unit_of_measures: state.libraries.unit_of_measures,
    };
}


const Loginform = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => { unmounted.current = true }
    }, []);
    const location = useLocation();
    const history = useHistory()
    const [errorMessage, setErrorMessage] = useState("");
    const [submit, setSubmit] = useState(false);
    
    const showErrorMessage = () => {
        if(errorMessage != ""){
            return {
                validateStatus: 'error',
                help: errorMessage
            }
        }
    }

    const onFinish = (values) => {
        setErrorMessage("");
        setSubmit(true);
        api.User.login(values)
        .then(res =>{
            if (unmounted.current) { return false; }
            setSubmit(false);
            if(res.data.error_code == "no_user"){
                props.getAdInfo(res.data.data);
                props.setShowRegister(true);
            }else{
                localStorage.setItem("auth_token",JSON.stringify(res.data));
                localStorage.setItem('last_login', dayjs().format('YYYY-MM-DD'));
                customAxios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
                props.dispatch({
                    type: "SET_INITIALIZED",
                    data: false
                });
                history.push('/')
            }
        })
        .catch(err => {
            setSubmit(false);
            setErrorMessage(err.response.data.message);
        })
        ;
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: false, username: "ict", password: "admin123" }}
                onFinish={onFinish}
                layout='vertical'
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                    { ...showErrorMessage() }
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" block disabled={submit} loading={submit}>
                        { submit ? "Logging in" : "Log in" }
                    </Button>                  
                    {/* &nbsp;<span className='custom-pointer' href=""> Forgot password?</span> */}
                </Form.Item>
                <Themepicker />
            </Form>
            <Divider>or</Divider>
            <Button type="ghost" block onClick={() => { props.setShowRegister(true) }  }>
                Request password reset
            </Button>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Loginform);
