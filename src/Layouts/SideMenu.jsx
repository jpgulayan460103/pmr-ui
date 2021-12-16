import React from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    UploadOutlined,
    VideoCameraOutlined ,
  } from '@ant-design/icons';
const Sidemenu = () => {
    return (
        <React.Fragment>
            <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} >
                <Menu.Item key="1" icon={<UserOutlined />}>
                    nav 1
                </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    nav 2
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
