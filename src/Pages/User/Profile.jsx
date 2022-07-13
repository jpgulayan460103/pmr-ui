import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Select, Menu  } from 'antd';
import UserForm from './UserForm';
import { isEmpty, map } from 'lodash';
import UserPermissions from './UserPermissions';
import helpers from '../../Utilities/helpers';

const { Option } = Select;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        activityLogs: state.activtyLogs.activityLogs,
        loading: state.activtyLogs.loading,
        selectedLogger: state.activtyLogs.selectedLogger,
        usersLibrary: state.libraries.users,
        user: state.user.data,
    };
}


const Profile = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        // console.log(props.user.user_information);
        return () => { unmounted.current = true }
    }, []);

    useEffect(() => {
        document.title = "Profile";
        if(props.isInitialized){
            let officeId = props.user.user_offices.data[0].office_id
            let groupIds = map(props.user.user_groups.data, 'group_id');
            let userDataProp = {
                ...props.user.user_information,
                office_id: officeId,
                group_id: groupIds,
            }
            setUserData(userDataProp);
        }
    }, [props.isInitialized]);

    const [userData, setUserData] = useState({});

    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="My Account Profile" bordered={false}  >
                        <div className='forms-card-form-content'>
                            { !isEmpty(userData) && (<UserForm userInfo={userData} type="update" page="profile" getUsers={() => {}}  />) }
                        </div>                        
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={10} xl={10}>
                    <Card size="small" title="My Account Permissions" bordered={false}  >
                        <div className='forms-card-form-content'>
                            <UserPermissions user={props.user} allowSuperAdmin={helpers.hasRole(props.user,['super-admin'])} getUsers={() => {}} />
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="Activity Logs" bordered={false}  >
                        <div className='forms-card-content'>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={10} xl={10}>
                    <Card size="small" title="Activity Information" bordered={false}  >
                        <div className='forms-card-content'>

                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Profile);

