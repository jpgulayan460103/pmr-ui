import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Dropdown, Badge, List, Tooltip, Button, Popover, Modal, Form, Input, Select  } from 'antd';
import { QuestionCircleOutlined , CaretDownOutlined, LogoutOutlined, UserOutlined, MessageOutlined, BellFilled, DeleteOutlined, ExclamationCircleOutlined   } from '@ant-design/icons';
import { useLocation, useHistory } from 'react-router-dom'
import logo from './../Images/logo.png'
import api from '../api';
import { cloneDeep, isEmpty } from 'lodash';
import dayjs from 'dayjs';

const { Header } = Layout;
const { Option } = Select;
const { TextArea } = Input;


function mapStateToProps(state) {
    return {
        notifications: state.user.notifications,
        collapsed: state.user.collapsed,
        user: state.user.data,
    };
}

const Headers = ({ notifications, dispatch, collapsed, user }) => {
    let history = useHistory();
    const formRef = React.useRef();

    const userLogout = () => {
        api.User.logout();
        dispatch({
            type: "SET_INITIAL_STATE",
            data: {}
        });
        localStorage.removeItem("auth_token");
        history.push("/login");
    }
    const userProfile = () => {
        history.push("/profile");
    }

    const handleOpen = (item) => {
        // console.log(item);
        history.push("/forms/pending");
    }
    
    const handleDelete = (item) => {
        api.User.deleteNotification(item.id)
        .then(res => {
            dispatch({
                type: "ADD_NOTIFICATION",
                data: res.data.data
            });
        })
        ;
    }

    const clearNotifications = () => {
        api.User.clearNotifications()
        .then(res => {
            dispatch({
                type: "ADD_NOTIFICATION",
                data: res.data.data
            });
        })
        ;
    }

    const [ticketModal, setTicketModal] = useState(false);

    const showTicketModal = () => {
        setTicketModal(true);
    };
  
    const handleOk = () => {
        setTicketModal(false);
    };
  
    const handleCancel = () => {
        formRef.current.resetFields();
        setTicketModal(false);
    };
    
    const handleActions = (item, index) => {
        return [
            <Tooltip placement="top" title="Delete">
                <Button size='small' icon={<DeleteOutlined />} type="link" onClick={()=> handleDelete(item)} />
            </Tooltip>,
        ];
    }
    
    const openNotification = (notification) => {
        // console.log(notification);
        history.push(notification.message.url);
        api.User.readNotifications(notification.id)
        .then(res => {
            dispatch({
                type: "ADD_NOTIFICATION",
                data: res.data.data
            });
        })
        ;
    }

    const notificationClassName = (item) => {
        if(item.status == 1){
            return "notificaton-items-unread";
        }
        return "notificaton-items";
    }

    const fromNow = (time) => {
        var relativeTime = require('dayjs/plugin/relativeTime')
        dayjs.extend(relativeTime)
        return dayjs(time).fromNow()
    }
    
    const NotificationItems = ({notifications, history, dispatch}) => {
        return (
            <div id='notifications-container' style={{height: "40vh", overflow: "auto"}}>
                <List
                size="small"
                header={<div>Notifications</div>}
                footer={<div className='custom-pointer' onClick={clearNotifications}>Clear Notifications</div>}
                bordered
                dataSource={notifications}
                renderItem={(item, index) => (
                    <List.Item
                        actions={handleActions(item, index)}
                        className={notificationClassName(item)}
                    >
                        <div style={{width: "80%"}} onClick={() => openNotification(item)}>
                            <span><b className='font-sans'>{item.message.title}</b></span>
                            <br />
                            <span className='text-base font-sans'>{item.message.body}</span>
                            <br />
                            <i><span className='text-sm font-sans'>{fromNow(item.created_at)}</span></i>
                        </div>
    
                    </List.Item>
                )}
                />
            </div>
        );
    };

    const requestSupport = (issue, concern) => {
        let subject = "Request for Technical Assistance on Procurement System";
        let body = `Issue: ${issue}%0AFull Name: ${user?.user_information?.fullname}%0ADivision: ${user?.user_offices?.data[0]?.office?.parent?.name}%0AUnit/Section: ${user?.user_offices?.data[0]?.office?.name}%0AConcern: ${concern}`;
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${process.env.REACT_APP_ICT_SUPPORT}&su=${subject}&body=${body}`,
                'newwindow',
                'location=yes,height=570,width=520,scrollbars=yes,status=yes');
            return false;
    }

    const onFinish = (values) => {
        let { concern, issue } = values;
        handleCancel();
        requestSupport(issue, encodeURI(concern))
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const MenuItems = ({userLogout}) => {
        return (
            <Menu
                items={[
                    {
                        key: 'profile',
                        label: (
                            // <span style={{fontSize: 18}}>User Profile</span>
                            <span>User Profile</span>
                        ),
                        icon: <UserOutlined />,
                        onClick: userProfile,
                    },
                    {
                        key: 'support',
                        label: (
                            <span>Create IT Support Ticket</span>
                        ),
                        icon: <MessageOutlined />,
                        onClick: () => {
                            setTicketModal(true)
                        },
                    },
                    {
                        key: 'logout',
                        danger: true,
                        label: (
                            <span>Logout</span>
                        ),
                        icon: <LogoutOutlined />,
                        onClick: userLogout,
                    },
                ]}
            />
        );
    };
    
    const MenuIcon = (props) => {
        return (
            <span className="space-x-1">
            <span>{props.icon}</span>
            </span>
        );
    }
    return (
        <React.Fragment>
            <Modal title="Create IT Support Ticket" visible={ticketModal} onOk={handleOk} onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button form="myForm" key="submit" htmlType="submit"  type='primary'>
                        Submit
                    </Button>
                ]}
            >
                <Form
                    ref={formRef}
                    name="normal_login"
                    className="login-form"
                    layout="vertical"
                    onFinish={onFinish}
                    id="myForm"
                >
                    <Form.Item
                        label="Issue"
                        name="issue"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your issue!',
                            },
                        ]}
                    >
                        <Select placeholder="Select an Issue" style={{ width: "100%" }}>
                            <Option value="Account Problem">Account Problem</Option>
                            <Option value="Bug and Error Report">Bug and Error Report (Please attach the screenshot of the error)</Option>
                            {/* <Option value="User Training">User Training</Option> */}
                            {/* <Option value="Suggestions and Recommendations">Suggestions and Recommendations</Option> */}
                            {/* <Option value="Others">Others</Option> */}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Concern"
                        name="concern"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your concern!',
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
            <Header className="site-layout-sub-header-background p-0" style={{ height: "45px"}}>
                {/* { showSide ? <img src={logo} className="h-full bg-white p-1 custom-pointer float-left" onClick={() => { toggleSide() }} /> : "" } */}
                {/* { collapsed ? <span className='header-items' style={{color: "white", marginLeft: 10, fontSize: 20, cursor: "pointer", top: "-12px"}} onClick={() => { toggleSide() }}>{ !showSide ? <MenuFoldOutlined /> : "" }</span> : "" } */}
                <Dropdown overlay={<MenuItems userLogout={userLogout} />}  trigger={['click']} placement="bottomRight" >
                    <p className="float-right mr-4 ml-4 header-items" style={{color:"white", cursor: "pointer"}}> { user.username } <MenuIcon icon={<CaretDownOutlined style={{fontSize: 18}} />} label="Menu" /></p>
                </Dropdown>
                <Dropdown overlay={<NotificationItems notifications={notifications} history={history} dispatch={dispatch} />} overlayStyle={{ zIndex: 1000}}  trigger={['hover']} placement="bottomRight" >
                        <p className="float-right mr-2 header-items" style={{color:"white", cursor: "pointer"}}>
                        <Badge count={isEmpty(notifications) ? 0 : (notifications.filter(not => not.status == 1)).length}>
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

