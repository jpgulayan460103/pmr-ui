import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { debounce, map } from 'lodash'
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Dropdown, Menu  } from 'antd';
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

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized
    };
}


const ActivityLogs = (props) => {
    const [filterData, setFilterData] = useState({});
    const [selectedLogger, setSelectedLogger] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "List of Purchase Request";
        if(props.isInitialized){
            getLogs();
        }
    }, [props.isInitialized]);

    const getLogs = debounce((filters) => {
        if(filters == null){
            filters = filterData
        }
        setLoading(true);
        api.Forms.getLogs(filters)
        .then(res => {
            setLoading(false);
            let data = res.data.data;
            let meta = res.data.meta;
            setActivityLogs(data);
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
        setFilterData(prev => ({...prev, page: e}));
        getLogs({...filterData, page: e})
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
    const logsDataSource = activityLogs;
    const logsColumns = [
        {
            title: 'Action Taken',
            dataIndex: 'description_str',
            key: 'description_str',
            width: 150,
            ...onCell,
        },
        {
            title: 'Subject',
            key: 'subject',
            width: 250,
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
            render: (text, record, index) => (
                <span>
                    { record.subject?.parent ? record.subject.display_log : "" }
                </span>
            ),
            ...onCell,
        },
        {
            title: 'Time',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            ...onCell,
        },
        {
            title: 'User',
            key: 'user',
            width: 250,
            render: (text, record, index) => (
                <span>
                    { record.user.user_information.fullname }
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
                            <Table
                                dataSource={logsDataSource}
                                columns={logsColumns}
                                size={"small"}
                                loading={{spinning: loading, tip: "Loading..."}}
                                pagination={false}
                                // onChange={handleTableChange}
                                scroll={{ y: "50vh" }}
                                rowClassName={(record, index) => {
                                    if(selectedLogger?.id == record.id){
                                        return "selected-row";
                                    }
                                }}
                            />
                            <div className="flex justify-end mt-2">
                                <Pagination
                                    current={paginationMeta?.current_page || 1}
                                    total={paginationMeta?.total || 1}
                                    pageSize={paginationMeta?.per_page || 1}
                                    onChange={paginationChange}
                                    showQuickJumper
                                    size="small"
                                    showSizeChanger={false}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={10} xl={10}>
                    <Card size="small" title="Information" bordered={false}  >
                        <div className='forms-card-content'>
                            <div>
                                <p>
                                    <b>Action Taken:</b> <span>{ selectedLogger?.description_str }</span><br />
                                    <b>Subject:</b> <span>{ ( selectedLogger?.subject?.parent ) ? selectedLogger?.subject?.parent?.display_log : selectedLogger?.subject?.display_log }</span><br />
                                    <b>Content:</b> <span>{ ( selectedLogger?.subject?.parent ) ? selectedLogger?.subject?.display_log : "" }</span><br />
                                    <b>User:</b> <span>{ selectedLogger?.user.user_information.fullname }</span><br />
                                    <b>Date and Time:</b> <span>{selectedLogger?.created_at}</span><br />
                                </p>
                            </div>
                            <Table size='small' dataSource={selectedLogger?.properties} columns={logPropertiesColumns} pagination={false} />
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    { selectedLogger?.subject?.parent?.file || selectedLogger?.subject?.file ? (
                        <Card size="small" title="" bordered={false}  >
                            <div className='forms-card-content'>
                                { selectedLogger?.subject?.parent?.file ? (<iframe src={`${selectedLogger?.subject?.parent?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>) : "" }
                                { selectedLogger?.subject?.file ? (<iframe src={`${selectedLogger?.subject?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>) : "" }
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

