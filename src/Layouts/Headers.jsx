import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Dropdown, Badge } from 'antd';
import { DownOutlined , CaretDownOutlined, LogoutOutlined, UserOutlined, SettingOutlined, BellFilled, MenuFoldOutlined, MenuUnfoldOutlined   } from '@ant-design/icons';

const { Header } = Layout;


function mapStateToProps(state) {
    return {
        notifications: state.user.notifications,
    };
}

const menu = (
    <Menu>
      <Menu.Item icon={<UserOutlined />}>
        <span style={{fontSize: 18}}>Profile</span>
      </Menu.Item>
      <Menu.Item icon={<DownOutlined />} >
        <span style={{fontSize: 18}}>1st menu item</span>
      </Menu.Item>
      <Menu.Item icon={<SettingOutlined />}>
        <span style={{fontSize: 18}}>Settings</span>
      </Menu.Item>
      <Menu.Item icon={<LogoutOutlined />} danger>
      <span style={{fontSize: 18}}>Logout</span>
      </Menu.Item>
    </Menu>
  );

const MenuIcon = (props) => {
    return (
        <span className="space-x-1">
        <span>{props.icon}</span>
        </span>
    );
}
const Headers = ({ setCw, collapsed, notifications }) => {
    const [showSide, setShowSide] = useState(false);
    const toggleSide = () => {
        setShowSide(!showSide);
        if(showSide){
            setCw(80);
        }else{
            setCw(0);
        }
    }
    return (
        <React.Fragment>
            <Header className="site-layout-sub-header-background" style={{ padding: 0 }}>
                { collapsed ? <span style={{color: "white", marginLeft: 10, fontSize: 20, cursor: "pointer"}} onClick={() => { toggleSide() }}>{ !showSide ? <MenuFoldOutlined /> : <MenuUnfoldOutlined /> }</span> : "" }
                <Dropdown overlay={menu}  trigger={['click']} placement="bottomRight" >
                    <p className="px-1 float-right mr-4" style={{color:"white", cursor: "pointer"}}> username <MenuIcon icon={<CaretDownOutlined style={{fontSize: 18}} />} label="Menu" /></p>
                </Dropdown>
                <Dropdown overlay={menu}  trigger={['click']} placement="bottomRight" >
                        <p className="px-1 float-right mr-4" style={{color:"white", cursor: "pointer"}}>
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

