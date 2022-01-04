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
                <SubMenu key="sub1" icon={<FormOutlined />} title="Purchase Requests">
                    <Menu.Item key="/purchase-requests/create">
                        <Link to="/purchase-requests/create"></Link>
                        Create Purchase Requests
                    </Menu.Item>
                    <Menu.Item key="/purchase-requests">
                        <Link to="/purchase-requests"></Link>
                        View Purchase Requests
                    </Menu.Item>
                    <Menu.Item key="7">Option 7</Menu.Item>
                    <Menu.Item key="8">Option 8</Menu.Item>
                </SubMenu>
                <Menu.Item key="/users" icon={<UserOutlined />}>
                    <Link to="/users"></Link>
                    Users
                </Menu.Item>
                <Menu.Item key="/libraries" icon={<UploadOutlined />}>
                    <Link to="/libraries"></Link>
                    Libraries
                </Menu.Item>
                {/* <Menu.Item key="4" icon={<UserOutlined />}>
                    nav 4
                </Menu.Item> */}
            </Menu>
        </React.Fragment>
    );
}

export default Sidemenu;
