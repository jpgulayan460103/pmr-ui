import React, { useState, useEffect } from 'react';
import axios from './../../api/axios.settings';
import style from './style.css'

import { Form, Input, Button, Checkbox } from 'antd';

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

    const onFinish = (values) => {
        console.log('Success:', values);
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    return (
        <div style={style} id="container">
            <button className='btn btn-primary' onClick={() => { loginTest() }}>Login</button>
            <button className='btn btn-primary' onClick={() => { itemsTest() }}>Items</button>
            <button className='btn btn-primary' onClick={() => { docuTest() }}>Docu</button>
            { token }
            {/* <div id="login-container">
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div> */}
        </div>
    );
}

export default Login;
