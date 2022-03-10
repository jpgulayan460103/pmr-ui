import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Dropdown, Badge } from 'antd';
import { DownOutlined , CaretDownOutlined, LogoutOutlined, UserOutlined, SettingOutlined, BellFilled, MenuFoldOutlined, MenuUnfoldOutlined   } from '@ant-design/icons';
import { useLocation, useHistory } from 'react-router-dom'
import logo from './../Images/logo.png'
import api from '../api';

const { Header } = Layout;


function mapStateToProps(state) {
    return {
        notifications: state.user.notifications,
        collapsed: state.user.collapsed,
        user: state.user.data,
    };
}

const MenuItems = ({userLogout}) => {
    return (
        <Menu>
            <Menu.Item icon={<UserOutlined />} key="1">
                <span style={{fontSize: 18}}>Profile</span>
            </Menu.Item>
            <Menu.Item icon={<SettingOutlined />} key="3">
                <span style={{fontSize: 18}}>Settings</span>
            </Menu.Item>
            <Menu.Item icon={<LogoutOutlined />} key="4" danger onClick={() => { userLogout() }}>
            <span style={{fontSize: 18}}>Logout</span>
            </Menu.Item>
        </Menu>
    );
};

const MenuIcon = (props) => {
    return (
        <span className="space-x-1">
        <span>{props.icon}</span>
        </span>
    );
}
const Headers = ({ notifications, dispatch, collapsed, user }) => {
    let history = useHistory();
    const [showSide, setShowSide] = useState(false);
    const toggleSide = () => {
        setShowSide(!showSide);
        if(showSide){
            // setCw(80);
            dispatch({
                type: "SET_COLLAPSE_WIDTH",
                data: 80
            });
        }else{
            // setCw(0);
            dispatch({
                type: "SET_COLLAPSE_WIDTH",
                data: 0
            });
        }
    }

    const userLogout = () => {
        api.User.logout();
        dispatch({
            type: "SET_INITIAL_STATE",
            data: {}
        });
        sessionStorage.removeItem('session');
        history.push("/login");
    }
    return (
        <React.Fragment>
            <Header className="site-layout-sub-header-background p-0" style={{ height: "45px"}}>
                {/* { showSide ? <img src={logo} className="h-full bg-white p-1 custom-pointer float-left" onClick={() => { toggleSide() }} /> : "" } */}
                {/* { collapsed ? <span className='header-items' style={{color: "white", marginLeft: 10, fontSize: 20, cursor: "pointer", top: "-12px"}} onClick={() => { toggleSide() }}>{ !showSide ? <MenuFoldOutlined /> : "" }</span> : "" } */}
                <Dropdown overlay={<MenuItems userLogout={userLogout} />}  trigger={['click']} placement="bottomRight" >
                    <p className="float-right mr-4 header-items" style={{color:"white", cursor: "pointer"}}> { user.username } <MenuIcon icon={<CaretDownOutlined style={{fontSize: 18}} />} label="Menu" /></p>
                </Dropdown>
                <Dropdown overlay={<MenuItems userLogout={userLogout} />}  trigger={['click']} placement="bottomRight" >
                        <p className="float-right mr-2 header-items" style={{color:"white", cursor: "pointer"}}>
                        <Badge count={notifications}>
                            <span  style={{color:"white", cursor: "pointer"}}>
                                <MenuIcon icon={<BellFilled style={{fontSize: 18}} />} label="Menu" />
                            </span>
                        </Badge>
                        </p>
                </Dropdown>
            </Header>
        </React.Fragment>
    );
}

export default connect(
    mapStateToProps,
  )(Headers);

