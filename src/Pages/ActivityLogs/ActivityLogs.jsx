import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { cloneDeep, debounce, isEmpty, map } from 'lodash'
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Select, Menu  } from 'antd';
import {
    SettingOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MoreOutlined,
    EllipsisOutlined,
    KeyOutlined,
    UserOutlined,
} from '@ant-design/icons';
import api from '../../api';
import TableFooterPagination from '../../Components/TableFooterPagination';
import filter from '../../Utilities/filter';
import TableRefresh from '../../Components/TableRefresh'

const { Option } = Select;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        activityLogs: state.activtyLogs.activityLogs,
        loading: state.activtyLogs.loading,
        selectedLogger: state.activtyLogs.selectedLogger,
        usersLibrary: state.libraries.users,
    };
}


const ActivityLogs = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => { unmounted.current = true }
    }, []);
    const [tableFilter, setTableFilter] = useState({});
    const [paginationMeta, setPaginationMeta] = useState([]);

    useEffect(() => {
        document.title = "Activity Logs";
        if(props.isInitialized){
            if(isEmpty(props.usersLibrary)){
                getUsers();
            }
            if(isEmpty(props.activityLogs)){
                getLogs();
            }
        }

        return () => {
            // props.dispatch({
            //     type: "SET_ACTIVITY_LOG_ACTIVITY_LOGS",
            //     data: []
            // });
        };
    }, [props.isInitialized]);

    const setLoading = (value) => {
        props.dispatch({
            type: "SET_ACTIVITY_LOG_LOADING",
            data: value
        });
    }
    const setSelectedLogger = (value) => {
        props.dispatch({
            type: "SET_ACTIVITY_LOG_SELECTED_LOGGER",
            data: value
        });
    }

    const getUsers = () => {
        return api.Library.getLibraries('users')
        .then(res => {
            props.dispatch({
                type: "SET_LIBRARY_USERS",
                data: res.data.data
            });
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    

    const getLogs = debounce((filters) => {
        if(filters == null){
            filters = tableFilter
        }
        setLoading(true);
        api.Forms.getLogs(filters)
        .then(res => {
            if (unmounted.current) { return false; }
            setLoading(false);
            let data = res.data.data;
            let meta = res.data.meta;
            props.dispatch({
                type: "SET_ACTIVITY_LOG_ACTIVITY_LOGS",
                data: data
            });
            setPaginationMeta(meta.pagination);
        })
        .catch(res => {
            setLoading(false);
        })
        .then(res => {
            setLoading(false);
        })
        ;
    }, 150)

    const paginationChange = async (e) => {
        setTableFilter(prev => ({...prev, page: e}));
        getLogs({...tableFilter, page: e})
    }

    const usersFilter = cloneDeep(props.usersLibrary).map(i => {
        i.value = i.key;
        i.text = i.user_information.fullname;
        i.name = i.user_information.fullname;
        return i;
    });

    const logTypeFilters = [
        {text: "BAC Task", value: "bac_task"},
        {text: "Form Routing", value: "form_routing"},
        {text: "Form Upload", value: "form_upload"},
        {text: "Purchase Request", value: "purchase_request"},
        {text: "Purchase Request Item", value: "purchase_request_item"},
        {text: "Supplier", value: "supplier"},
        {text: "Supplier Contact Person", value: "supplier_contact_person"},
        {text: "User Login", value: "user_login"},
        {text: "User Logout", value: "user_logout"},
    ];


    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedLogger(record);
                },
            };
          }
    }
    const logsDataSource = props.activityLogs;
    const logsColumns = [
        {
            title: 'Date & Time',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            ...onCell,
            // sorter: (a, b) => a.created_at?.localeCompare(b.created_at),
        },
        {
            title: 'Activity Category',
            dataIndex: 'log_type',
            key: 'log_type',
            width: 150,
            // sorter: (a, b) => a.log_type?.localeCompare(b.log_type),
            ...onCell,
            filters: logTypeFilters,
            ...filter.list('log_type','text', setTableFilter, tableFilter, getLogs),
        },
        {
            title: 'Action Taken',
            dataIndex: 'description_str',
            key: 'description_str',
            width: 150,
            // sorter: (a, b) => a.description_str?.localeCompare(b.description_str),
            ...onCell,
        },
        {
            title: 'Subject',
            key: 'subject',
            width: 250,
            // sorter: (a, b) => {
            //     if(a.subject?.parent){
            //         return a.subject?.parent?.display_log?.localeCompare(b.subject?.parent?.display_log)
            //     }else{
            //         return a.subject?.display_log?.localeCompare(b.subject?.display_log)

            //     }
            // },
            render: (text, record, index) => (
                <span>
                    { record.subject?.parent ? record.subject?.parent?.display_log : record.subject?.display_log }
                </span>
            ),
            ...onCell,
        },
        {
            title: 'Contents',
            key: 'target',
            width: 250,
            // sorter: (a, b) => {
            //     if(a.subject?.parent){
            //         return a.description_str?.localeCompare(b.description_str);
            //     }else{
            //         return a.subject.display_log?.localeCompare(b.subject.display_log);
            //     }
            // },
            render: (text, record, index) => (
                <span>
                    { record.subject?.parent ? record.subject.display_log : "" }
                </span>
            ),
            ...onCell,
        },
        {
            title: 'User',
            key: 'causer_id',
            width: 250,
            filters: usersFilter,
            ...filter.list('causer_id','text', setTableFilter, tableFilter, getLogs),
            // sorter: (a, b) => a.user?.user_information?.fullname?.localeCompare(b.user?.user_information?.fullname),
            render: (text, record, index) => (
                <span>
                    { record.user?.user_information?.fullname }
                </span>
            ),
            ...onCell,
        },
    ];


    const logPropertiesColumns = [
        {
          title: 'Field',
          dataIndex: 'label',
          key: 'label',
          width: 100,
        },
        {
          title: 'Old',
        //   dataIndex: 'old',
          key: 'old',
          render: (text, record, index) => (
                <span>
                    { record.is_url && record.old ? (<a href={record.old} target="_blank">Download</a>) : record.old }
                </span>
            ),
        },
        {
          title: 'New',
        //   dataIndex: 'new',
          key: 'new',
          render: (text, record, index) => (
            <span>
                { record.is_url && record.new ? (<a href={record.new} target="_blank">Download</a>) : record.new }
            </span>
        ),
        },
    ];


    const menu = (item, index) => (
        <Menu>
            <Menu.Item key="menu-view" icon={<UserOutlined />}  onClick={() => { setSelectedLogger(item) }}>
                Edit
            </Menu.Item>
            <Menu.Item key="menu-edit" icon={<KeyOutlined />}  onClick={() => { setSelectedLogger(item) }}>
                Permissions
            </Menu.Item>
        </Menu>
    );
    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="Activity Logs" bordered={false}  >
                        <div className='forms-card-content'>
                            <div className="flex justify-end mb-2 space-x-2">
                                <TableRefresh getData={getLogs} />
                            </div>
                            <Table
                                dataSource={logsDataSource}
                                columns={logsColumns}
                                size={"small"}
                                loading={{spinning: props.loading, tip: "Loading..."}}
                                pagination={false}
                                // onChange={handleTableChange}
                                scroll={{ y: "50vh" }}
                                rowClassName={(record, index) => {
                                    if(props.selectedLogger?.id == record.id){
                                        return "selected-row";
                                    }
                                }}
                            />
                            <TableFooterPagination pagination={paginationMeta} paginationChange={paginationChange} />
                        </div>                        
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={10} xl={10}>
                    <Card size="small" title="Information" bordered={false}  >
                        <div className='forms-card-content'>
                            <div>
                                <p>
                                    <b>Action Taken:</b> <span>{ props.selectedLogger?.description_str }</span><br />
                                    <b>Subject:</b> <span>{ ( props.selectedLogger?.subject?.parent ) ? props.selectedLogger?.subject?.parent?.display_log : props.selectedLogger?.subject?.display_log }</span><br />
                                    <b>Content:</b> <span>{ ( props.selectedLogger?.subject?.parent ) ? props.selectedLogger?.subject?.display_log : "" }</span><br />
                                    <b>User:</b> <span>{ props.selectedLogger?.user?.user_information?.fullname }</span><br />
                                    <b>Date and Time:</b> <span>{props.selectedLogger?.created_at}</span><br />
                                </p>
                            </div>
                                <Table size='small' dataSource={props.selectedLogger?.properties} columns={logPropertiesColumns} pagination={false} />
                        </div>
                    </Card>
                </Col>
            </Row>
            { props.selectedLogger?.description == "" ? (
                <Row gutter={[16, 16]} className="mb-3">
                    <Col span={24}>
                        { props.selectedLogger?.subject?.parent?.file || props.selectedLogger?.subject?.file ? (
                            <Card size="small" title="" bordered={false}  >
                                <div className='forms-card-content'>
                                    { props.selectedLogger?.subject?.parent?.file ? (<iframe src={`${props.selectedLogger?.subject?.parent?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>) : "" }
                                    { props.selectedLogger?.subject?.file ? (<iframe src={`${props.selectedLogger?.subject?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>) : "" }
                                </div>
                            </Card>
                        ) : "" }
                    </Col>
                </Row>
            ) : ""}
        </div>
    );
}

export default connect(
    mapStateToProps,
)(ActivityLogs);

