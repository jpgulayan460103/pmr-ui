import React from 'react';
import { Form, Input, Button, Typography, PageHeader  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../api';

const { Title } = Typography;

const LoginFormActive = ({getAdInfo, setRegisterStep, setShowRegister}) => {

    const onFinish = (values) => {
        console.log('Success:', values);
        api.User.loginAd(values)
        .then(res => {
            console.log(res.data.data);
            getAdInfo(res.data.data);
            setRegisterStep(1);
        })
        .catch(res => {})
        .then(res => {})
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
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
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
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                    </Button>
                    &nbsp;<a className="login-form-forgot" href=""> Forgot password</a>
                </Form.Item>
            </Form>
        </div>
    );
}

export default LoginFormActive;
