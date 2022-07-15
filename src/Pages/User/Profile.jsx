import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Select, Menu  } from 'antd';
import UserForm from './UserForm';
import { cloneDeep, isEmpty, map } from 'lodash';
import UserPermissions from './UserPermissions';
import helpers from '../../Utilities/helpers';
import api from '../../api';
import TableFooterPagination from '../../Components/TableFooterPagination';
import AuditTrail from '../../Components/AuditTrail';

const { Option } = Select;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        activityLogs: state.activtyLogs.activityLogs,
        loading: state.activtyLogs.loading,
        selectedLogger: state.activtyLogs.selectedLogger,
        usersLibrary: state.libraries.users,
        user: state.user.data,
        profile: state.user.profile,
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
            getLogs();
        }
    }, [props.isInitialized]);

    const [userData, setUserData] = useState({});
    const [selectedLogger, setSelectedLogger] = useState({});
    const [tableFilter, setTableFilter] = useState({});

    const getLogs = (filters) => {
        if(filters == null){
            filters = tableFilter
        }
        props.dispatch({
            type: "SET_USER_PROFILE_DATA",
            data: {
                ...cloneDeep(props.profile),
                activity_logs: [],
                loading: true,
            },
        });
        api.ActivityLogs.getUserLogs(filters)
        .then(res =>{
            props.dispatch({
                type: "SET_USER_PROFILE_DATA",
                data: {
                    ...cloneDeep(props.profile),
                    activity_logs: res.data.data,
                    loading: false,
                    paginationMeta: res.data.meta.pagination
                },
            });
        })
        .catch(err =>{
            props.dispatch({
                type: "SET_USER_PROFILE_DATA",
                data: {
                    ...cloneDeep(props.profile),
                    loading: false,
                },
            });
        })
        .then(res =>{
        })
        ;
    }

    const paginationChange = async (e) => {
        setTableFilter(prev => ({...prev, page: e}));
        getLogs({...tableFilter, page: e})
    }

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedLogger(record);
                },
            };
          }
    }

    const dataSource = props.profile.activity_logs;
    const columns = [
        {
            title: 'Type',
            dataIndex: 'form_type_header',
            key: 'form_type_header',
            ...onCell,
        },
        {
            title: 'Subject',
            key: 'subjects',
            ...onCell,
            render: (text, record, index) => (
                <span>
                    { record.subject?.display_log }
                </span>
            ),
        },
        {
            title: 'Timestamp',
            dataIndex: 'created_at',
            key: 'created_at',
            ...onCell,
        },
        {
            title: '',
            key: 'view',
            ...onCell,
            render: (text, record, index) => (
                <span className='custom-pointer'>
                    View
                </span>
            ),
        },
    ];

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

                            <Table
                                    dataSource={dataSource}
                                    columns={columns}
                                    size={"small"}
                                    loading={{spinning: props.profile.loading, tip: "Loading..."}}
                                    pagination={false}
                                    // onChange={handleTableChange}
                                    scroll={{ y: "50vh" }}
                                    rowClassName={(record, index) => {
                                        if(selectedLogger?.id == record.id){
                                            return "selected-row";
                                        }
                                    }}
                                />
                                <TableFooterPagination pagination={props.profile.paginationMeta} paginationChange={paginationChange} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={10} xl={10}>
                    <Card size="small" title="Activity Information" bordered={false}  >
                        <div className='forms-card-content'>
                            <div>
                            Timestamp: <b>{ selectedLogger?.created_at }</b> <br />
                            Activity: <b>{ selectedLogger?.form_type_header }</b> <br />
                            User: <b>{ selectedLogger?.causer?.user_information?.fullname }</b><br />
                                <AuditTrail audit={selectedLogger} tableScroll="65vh" />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={24}>
                    { selectedLogger?.subject?.file  ? (
                        <Card size="small" title="" bordered={false}  >
                            <div className='forms-card-content'>
                                <iframe src={`${selectedLogger?.subject?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>
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
)(Profile);

