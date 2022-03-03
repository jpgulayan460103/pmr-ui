import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import UserTable from './UserTable'
import UserPermissions from './UserPermissions'
import UserForm from './UserForm';
import api from '../../api';
import { debounce, map } from 'lodash'
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Dropdown, Menu  } from 'antd';



function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized
    };
}

const User = (props) => {

    useEffect(() => {
        document.title = "List of Purchase Request";
        if(props.isInitialized){
            getUsers();
        }
    }, [props.isInitialized]);

    const [formData, setFormData] = useState({});
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [editType, setEditType] = useState("");
    const [loading, setLoading] = useState(true);

    const selectUser = (selected, type) => {
        setSelectedUser(selected);
        selected.user_information.username = selected.username;
        selected.user_information.office_id = map(selected.user_offices.data, 'office_id');
        selected.user_information.group_id = map(selected.user_groups.data, 'group_id');
        // selected.user_information.position_id = selected.user_offices.data[0].position_id;
        setFormData(selected.user_information);
        setEditType(type);
    }

    const getUsers = debounce(() => {
        setLoading(true);
        api.User.all()
        .then(res => {
            setLoading(false);
            setUsers(res.data.data);
        })
        .catch(err => {
            setLoading(false);
        })
        .then(res => {})
        ;
    }, 150)
    
    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="Users" bordered={false}  >
                        <div className='user-card-content'>
                            <UserTable loading={loading} users={users} selectUser={selectUser} />
                        </div>
                    </Card>
                </Col>
                <Col sm={24} md={8} lg={10} xl={10}>
                    { editType=="edit" ?  (
                        <Card size="small" title="Edit User" bordered={false}>
                            <div className='user-card-content'>
                                <UserForm userInfo={formData} type="update" getUsers={getUsers} />
                            </div>
                        </Card>
                    ) : "" }
                    { editType=="permissions" ?  (
                        <Card size="small" title="Edit Permissions" bordered={false}  >
                            <div className='user-card-content'>
                                <UserPermissions />
                            </div>
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

