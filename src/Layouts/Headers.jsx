import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Dropdown, Badge, List, Tooltip, Button, Popover, Modal, Form, Input, Select  } from 'antd';
import { QuestionCircleOutlined , CaretDownOutlined, LogoutOutlined, UserOutlined, MessageOutlined, BellFilled, DeleteOutlined, ExclamationCircleOutlined   } from '@ant-design/icons';
import { useLocation, useHistory } from 'react-router-dom'
import logo from './../Images/logo.png'
import api from '../api';
import { cloneDeep } from 'lodash';

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
        history.push("/forms/forwarded");
    }
    
    const handleDelete = (index) => {
        // console.log(index);
        let clonedNotif = cloneDeep(notifications)
        clonedNotif.splice(index, 1)
        dispatch({
            type: "ADD_NOTIFICATION",
            data: clonedNotif
        });
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
                <Button size='small' icon={<DeleteOutlined />} type="link" onClick={()=> handleDelete(index)} />
            </Tooltip>
        ];
    }
    
    const popOverContent = (item) => {
        return (
            <div style={{width: "240px"}}>
                <p>
                    <b>Form Type:</b> <span>{ item.notification_title }</span><br />
                    <b>Form:</b> <span>{ item.notification_data.form }</span><br />
                    <b>Status:</b> <span>{ item.notification_data.status }</span><br />
                    <b>User:</b> <span>{ item.notification_data.user }</span><br />
                    <b>Remarks:</b> <span>{ item.notification_data.remarks }</span><br />
                    <i>{ item.notification_data.datetime }</i><br />
                </p>
            </div>
        )
    }
    
    
    const NotificationItems = ({notifications, history, dispatch}) => {
        return (
            <div id='notifications-container'>
                <List
                size="small"
                header={<div>Notifications</div>}
                footer={<div className='custom-pointer' onClick={() => {
                    dispatch({
                        type: "ADD_NOTIFICATION",
                        data: []
                    });
                }}>Clear Notifications</div>}
                bordered
                dataSource={notifications}
                renderItem={(item, index) => (
                    <List.Item
                        actions={handleActions(item, index)}
                        className="notificaton-items"
                    >
                        <div className="truncate" style={{width: "80%"}} onClick={showTicketModal}>
                            <Popover placement="left" title={item.title} content={popOverContent(item)} trigger="hover">
                                { item.notification_type == "rejected_form" ?  (
                                    <Button size='small' icon={<ExclamationCircleOutlined />} type="link" style={{ color: "red" }} />
                                ) : (
                                    <Button size='small' icon={<QuestionCircleOutlined />} type="link" />
                                ) }
                            </Popover>
                            <span className='ml-2'>{item.notification_title}</span>
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
            <Menu>
                <Menu.Item icon={<UserOutlined />} key="1"  onClick={userProfile}>
                    <span style={{fontSize: 18}}>User Profile</span>
                </Menu.Item>
                <Menu.Item icon={<MessageOutlined />} key="3" onClick={() => setTicketModal(true)}>
                    <span style={{fontSize: 18}}>Create IT Support Ticket</span>
                </Menu.Item>
                <Menu.Item icon={<LogoutOutlined />} key="4" danger onClick={userLogout}>
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
                            <Option value="User Training">User Training</Option>
                            <Option value="Suggestions and Recommendations">Suggestions and Recommendations</Option>
                            <Option value="Others">Others</Option>
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
                <Dropdown overlay={<NotificationItems notifications={notifications} history={history} dispatch={dispatch} />} overlayStyle={{ zIndex: 1000}}  trigger={['click']} placement="bottomRight" >
                        <p className="float-right mr-2 header-items" style={{color:"white", cursor: "pointer"}}>
                        <Badge count={notifications.length}>
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

