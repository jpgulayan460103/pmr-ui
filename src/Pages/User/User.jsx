import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import UserTable from './UserTable'
import UserPermissions from './UserPermissions'
import UserForm from './UserForm';
import api from '../../api';
import { debounce, map } from 'lodash'
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Dropdown  } from 'antd';
import helpers from '../../Utilities/helpers';
import TableRefresh from '../../Components/TableRefresh';

const { TabPane } = Tabs;



function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        user: state.user.data
    };
}

const User = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => { unmounted.current = true }
    }, []);

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
            if (unmounted.current) { return false; }
            setLoading(false);
            setUsers(res.data.data);
        })
        .catch(err => {
            setLoading(false);
        })
        .then(res => {})
        ;
    }, 250)
    
    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="Users" bordered={false}  >
                        <div className='user-card-content'>
                            <div className="flex justify-end mb-2 space-x-2">
                                <TableRefresh getData={getUsers} />
                            </div>
                            <UserTable loading={loading} users={users} selectUser={selectUser} />
                        </div>
                    </Card>
                </Col>
                <Col sm={24} md={8} lg={10} xl={10}>
                <Card size="small" title="User" bordered={false}>
                    <div className='user-card-content'>

                        <Tabs activeKey={props.tab} type="card" size="small">
                            <TabPane tab="Information" key="information">
                                <UserForm userInfo={formData} type="update" getUsers={getUsers} />
                            </TabPane>
                            <TabPane tab="Roles and Permission" key="roles">
                                <UserPermissions user={selectedUser} allowSuperAdmin={helpers.hasRole(props.user,['super-admin'])} getUsers={getUsers} />
                            </TabPane>
                        </Tabs>
                    </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(User);

