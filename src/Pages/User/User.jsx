import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import UserTable from './UserTable'
import UserPermissions from './UserPermissions'
import RegistrationFormActive from '../Login/RegistrationFormActive';
import api from '../../api';
import { map } from 'lodash'
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Dropdown, Menu  } from 'antd';



function mapStateToProps(state) {
    return {

    };
}

const User = () => {

    useEffect(() => {
        getUsers()
    }, []);

    const [formData, setFormData] = useState({});
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [editType, setEditType] = useState("");

    const selectUser = (selected, type) => {
        setSelectedUser(selected);
        selected.user_information.username = selected.username;
        selected.user_information.office_id = map(selected.signatories.data, 'office_id');
        selected.user_information.group_id = map(selected.groups.data, 'group_id');
        selected.user_information.position_id = selected.signatories.data[0].position_id;
        setFormData(selected.user_information);
        setEditType(type);
    }

    const getUsers = () => {
        api.User.all()
        .then(res => {
            setUsers(res.data.data);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    
    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="Users" bordered={false}  className='list-user-applet-container' >
                        <UserTable users={users} selectUser={selectUser} />
                    </Card>
                </Col>
                <Col sm={24} md={8} lg={10} xl={10}>
                    { editType=="edit" ?  (
                        <Card size="small" title="Edit User" bordered={false}  bodyStyle={{padding: "20px"}} className='list-user-applet-container' >
                            <div style={{height: "inherit", overflowY: "auto", overflowX: "hidden", paddingRight: "10px" }}>
                            <RegistrationFormActive userInfo={formData} type="update" />
                            </div>
                        </Card>
                    ) : "" }
                    { editType=="permissions" ?  (
                        <Card size="small" title="Edit Permissions" bordered={false}  className='list-user-applet-container' >
                            <UserPermissions />
                        </Card>
                    ) : "" }
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(User);

