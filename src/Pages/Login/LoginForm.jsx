import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Divider, Typography  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../api';
import customAxios from '../../api/axios.settings';

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
    };
}


const Loginform = (props) => {

    useEffect(() => {
        console.log(props.unit_of_measures);
    }, []);

    const onFinish = (values) => {
        console.log('Success:', values);
        api.User.login(values)
        .then(res =>{
            sessionStorage.setItem('session',JSON.stringify(res.data));
            customAxios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
            // if(location.pathname == "/login"){
            //     window.location = "/"
            // }
        });;
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Title level={2} className='text-center'>User Login</Title>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true, username: "jpgulayan", password: "admin123" }}
                onFinish={onFinish}
                layout='vertical'
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
                    <Button type="primary" htmlType="submit" className="login-form-button" block>
                    Log in
                    </Button>                    
                    &nbsp;<span className='custom-pointer' href=""> Forgot password?</span>
                </Form.Item>
            </Form>
            <Divider>or</Divider>
            <Button type="ghost" block onClick={() => { props.setShowRegister(true) }  }>
                Register using Active Directory Account
            </Button>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Loginform);
