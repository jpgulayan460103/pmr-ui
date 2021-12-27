import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    UploadOutlined,
    FormOutlined ,
  } from '@ant-design/icons';
import { useLocation, Link  } from 'react-router-dom'

const { SubMenu } = Menu;

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
                <Link to="/"></Link>
                Home
                </Menu.Item>
                <SubMenu key="sub1" icon={<FormOutlined />} title="Navigation One">
                    <Menu.Item key="/purchase-request/create">
                        <Link to="/purchase-request/create"></Link>
                        Create Purchase Requests
                    </Menu.Item>
                    <Menu.Item key="/purchase-request">
                        <Link to="/purchase-request"></Link>
                        View Purchase Requests
                    </Menu.Item>
                    <Menu.Item key="7">Option 7</Menu.Item>
                    <Menu.Item key="8">Option 8</Menu.Item>
                </SubMenu>
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
