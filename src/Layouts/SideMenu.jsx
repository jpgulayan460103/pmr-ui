import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import {
    UserOutlined,
    UploadOutlined,
    FormOutlined ,
  } from '@ant-design/icons';
import { useLocation, Link  } from 'react-router-dom'

const { SubMenu } = Menu;

function mapStateToProps(state) {
    return {
        purchaseRequestFormType: state.purchaseRequest.formType,
    };
}

const Sidemenu = (props) => {
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
                    <Menu.Item key="/purchase-requests/form">
                        <Link to="/purchase-requests/form"></Link>
                        { props.purchaseRequestFormType == "create" ? "Create" : "Edit" } Purchase Requests
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

export default connect(
    mapStateToProps,
  )(Sidemenu);