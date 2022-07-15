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
import AuditTrail from '../../Components/AuditTrail';

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
    // const [audit, setAudit] = useState({});

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
        api.ActivityLogs.getLogs(filters)
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


    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedLogger(record);
                },
            };
          }
    }

    const dataSource = props.activityLogs;
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
            title: 'User',
            key: 'user',
            ...onCell,
            render: (text, record, index) => (
                <span>
                    { record.causer?.user_information?.fullname }
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
                    <Card size="small" title="Activity Logs" bordered={false}  >
                        <div className='forms-card-content'>
                            <div className="flex justify-end mb-2 space-x-2">
                                <TableRefresh getData={getLogs} />
                            </div>
                            <Table
                                dataSource={dataSource}
                                columns={columns}
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
                    <Card size="small" title="Activity Information" bordered={false}  >
                        <div className='forms-card-content'>
                            <div>
                            Timestamp: <b>{ props.selectedLogger?.created_at }</b> <br />
                            Activity: <b>{ props.selectedLogger?.form_type_header }</b> <br />
                            User: <b>{ props.selectedLogger?.causer?.user_information?.fullname }</b><br />
                                <AuditTrail audit={props.selectedLogger} tableScroll="65vh" />
                            </div>
                                {/* <Table size='small' dataSource={props.selectedLogger?.properties} columns={logPropertiesColumns} pagination={false} /> */}
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    { props.selectedLogger?.subject?.file  ? (
                        <Card size="small" title="" bordered={false}  >
                            <div className='forms-card-content'>
                                <iframe src={`${props.selectedLogger?.subject?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>
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
)(ActivityLogs);

