import React, { useState } from 'react';
import { Form, Input, Button, Typography, Divider  } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import api from '../../api';

const { Title } = Typography;

const LoginFormActive = ({getAdInfo, setRegisterStep, setShowRegister}) => {

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
        api.User.loginAd(values)
        .then(res => {
            setSubmit(false);
            getAdInfo(res.data.data);
            setRegisterStep(1);
        })
        .catch(err => {
            setSubmit(false);
            setErrorMessage(err.response.data.message);
        })
        .then(res => {});
    };

    return (
        <div>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
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
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" block disabled={submit} loading={submit}>
                        { submit ? "Logging in" : "Log in" }
                    </Button>                    
                    &nbsp;<span className='custom-pointer' href=""> Forgot password?</span>
                </Form.Item>
            </Form>
            <Divider>or</Divider>
            <Button type="danger" block onClick={() => { setShowRegister(false) }  } >
                Back to Login Page
            </Button>
        </div>
    );
}

export default LoginFormActive;
