import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    UploadOutlined,
    FormOutlined ,
  } from '@ant-design/icons';
import { useLocation, Link  } from 'react-router-dom'
const Sidemenu = () => {
    const location = useLocation();
    const [defaultKey, setDefaultKey] = useState('/');
    useEffect(() => {
        setDefaultKey(location.pathname);
    }, [location.pathname]);
    return (
        <React.Fragment>
            <Menu theme="light" mode="inline" selectedKeys={[defaultKey]} >
                <Menu.Item key="/" icon={<UserOutlined />}>
                <Link to="/" style={{textDecoration: "none"}}></Link>
                Home
                </Menu.Item>
                <Menu.Item key="/purchase-request" icon={<FormOutlined />}>
                <Link to="/purchase-request" style={{textDecoration: "none"}}></Link>
                Purchase Request
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
