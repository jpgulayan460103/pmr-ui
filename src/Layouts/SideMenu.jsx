import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    UploadOutlined,
    VideoCameraOutlined ,
  } from '@ant-design/icons';
import { useLocation, Link  } from 'react-router-dom'
const Sidemenu = () => {
    const location = useLocation();
    const [defaultKey, setDefaultKey] = useState('/home');
    useEffect(() => {
        setDefaultKey(location.pathname);
    }, [location.pathname]);
    return (
        <React.Fragment>
            <Menu theme="light" mode="inline" selectedKeys={[defaultKey]} >
                <Menu.Item key="/home" icon={<UserOutlined />}>
                <Link to="/home" style={{textDecoration: "none"}}>Home</Link>
                </Menu.Item>
                <Menu.Item key="/about" icon={<VideoCameraOutlined />}>
                <Link to="/about" style={{textDecoration: "none"}}>About</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UploadOutlined />}>
                    nav 3
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined />}>
                    nav 4
                </Menu.Item>
            </Menu>
        </React.Fragment>
    );
}

export default Sidemenu;
