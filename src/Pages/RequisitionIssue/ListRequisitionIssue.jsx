import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Dropdown, Menu, Tooltip  } from 'antd';
import api from '../../api';
import Icon, {
    CloseOutlined,
    EllipsisOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
    LoadingOutlined,
    FormOutlined,
    EditOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
import dayjs from 'dayjs';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import filter from '../../Utilities/filter';
import AuditTrail from '../../Components/AuditTrail';
import AttachmentUpload from '../../Components/AttachmentUpload';
import TableFooterPagination from '../../Components/TableFooterPagination';
import helpers from '../../Utilities/helpers';
import TableRefresh from '../../Components/TableRefresh';
import TableResetFilter from '../../Components/TableResetFilter';
import customDayJs from "./../../customDayJs";
import AuditBatches from '../../Components/AuditBatches';
import MaximizeSvg from '../../Icons/MaximizeSvg';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        selectedRequisitionIssue: state.requisitionIssues.list.selectedRequisitionIssue,
        requisitionIssues: state.requisitionIssues.list.requisitionIssues,
        paginationMeta: state.requisitionIssues.list.paginationMeta,
        loading: state.requisitionIssues.list.loading,
        timelines: state.requisitionIssues.list.timelines,
        logger: state.requisitionIssues.list.logger,
        tableFilter: state.requisitionIssues.list.tableFilter,
        defaultTableFilter: state.requisitionIssues.list.defaultTableFilter,
        tab: state.requisitionIssues.list.tab,
        user_sections: state.libraries.user_sections,
    };
}

const ListRequisitionIssue = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => {
            unmounted.current = true;
            // setRequisitionIssues([]);
        }
    }, []);
    let history = useHistory()
    useEffect(() => {
        document.title = "List of Requisition and Issue Plan";
        if(props.isInitialized){
            if(isEmpty(props.requisitionIssues)){
            }
            getRequisitionIssues();
        }
    }, [props.isInitialized]);
    
    

    const setTableFilter = (data) => {
        if(typeof data == "function"){
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_TABLE_FILTER",
                data: data(),
            });
        }else{
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
        }
    }

    const setTabKey = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_TAB",
            data: value,
        });
    }

    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_LOADING",
            data: value,
        });
    }
    const setRequisitionIssues = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_PURCHASE_REQUESTS",
            data: value,
        });
    }
    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_PAGINATION_META",
            data: value,
        });
    }
    const setLogger = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_LOGGER",
            data: value,
        });
    }
    const setSelectedRequisitionIssue = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_SELECTED_PURCHASE_REQUEST",
            data: value
        });
    }

    const setTimelines = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_TIMELINES",
            data: value
        });
    }

    const getRequisitionIssues = debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        setTableLoading(true);
        api.RequisitionIssue.all(filters)
        .then(res => {
            if (!unmounted.current) {
                setTableLoading(false);
                let data = res.data.data;
                let meta = res.data.meta;
                setRequisitionIssues(data);
                setPaginationMeta(meta.pagination);
            }
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {
            setTableLoading(false);
        })
        ;
    }, 200);
     
    const openInFull = () => {
        window.open(`${props.selectedRequisitionIssue.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }




    const openRequisitionIssue = async (item, index) => {
        setSelectedRequisitionIssue(item)
        setTimelines([]);
        setLogger([]);
        loadRequisitionIssueData(item.id);
        loadAuditTrail(item.id);
    }

    const loadRequisitionIssueData = async (id) => {
        await api.RequisitionIssue.get(id)
        .then(res => {
            if (unmounted.current) { return false; }
            let item = res.data;
            let form_routes = item.form_routes.data;
            setTimelines(form_routes);
            setSelectedRequisitionIssue(item)
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    const closeRequisitionIssue = () => {
        setSelectedRequisitionIssue({});
    }

    const editRequisitionIssue = (item, index) => {
        api.RequisitionIssue.get(item.id)
        .then(res => {
            let ris = res.data;
            ris.items = ris.items.data;
            ris.issued_items = [];
            ris.form_route_id = item.id;
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_CREATE_FORM_TYPE",
                data: "update"
            });

            props.dispatch({
                type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
                data: ris
            });

            history.push("/requisition-and-issues/form");
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const loadAuditTrail = async (id) => {
        await api.RequisitionIssue.logger(id)
        .then(res => {
            if (unmounted.current) { return false; }
            setLogger(res.data.data);
        })
        .catch(res => {})
        .then(res => {})
    }


    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            getRequisitionIssues(filters)
        }else{
            getRequisitionIssues(filters)
        }
    };

    const paginationChange = async (e) => {
        setTableFilter(prev => ({...prev, page: e}));
        getRequisitionIssues({...props.tableFilter, page: e})
    }

    const timelineContent = (timeline) => {
        let created;
        let tat_text;
        let status;
        let remarks;
        let office;
        let remarksUser;
        let forwardedUser;
        let color =""
        let logo =""
        created = <span>Created on <i>{ timeline.created_at }</i><br /></span>;
        status = <span>{timeline.status_str} on <i>{ timeline.updated_at }</i><br /></span>;
        tat_text = <span>Turnaround Time: <i>{ helpers.turnAroundTime(timeline.updated_at_raw, timeline.created_at_raw) }</i><br /></span>;
        office = <span><b>{timeline.to_office?.name}</b> <br /></span>;
        remarks = <span>Remarks: {timeline.remarks}<br /></span>;
        forwardedUser = <span>From: {timeline.forwarded_by?.user_information?.fullname}<br /></span>;
        remarksUser = <span>{timeline.status_str} by {timeline.processed_by?.user_information?.fullname}<br /></span>;
        switch (timeline.status) {
            case "approved":
                color = "green";
                logo = <CheckCircleOutlined />;
                break;
            case "rejected":
                color = "red";
                logo = <ExclamationCircleOutlined />;
                break;
            case "with_issues":
                color = "blue";
                logo = <QuestionCircleOutlined />;
                break;
            case "resolved":
                color = "blue";
                logo = <CheckCircleOutlined />;
                break;
            default:
                tat_text = "";
                color = "gray";
                logo = <LoadingOutlined />
                break;
        }
        if(timeline.action_taken == null){
            color = "gray";
            logo = <LoadingOutlined />
            tat_text = "";
            remarks = "";
            forwardedUser = "";
            remarksUser = "";
        }
        let label = (<>
            { office }
            { created }
            { status }
            { tat_text }
            { remarks }
            { forwardedUser }
            { remarksUser }
        </>)
        return { label, color, logo }
    }

    const endUserFilter = cloneDeep(props.user_sections).map(i => {
        i.value = i.id;
        return i;
    });

    const addToPurchaseRequest = (item, index) => {
        api.RequisitionIssue.get(item.id)
        .then(res => {
            let risRes = res.data;
            let ris = {
                purpose: risRes.purpose,
                end_user_id: risRes.end_user_id,
                items: risRes.items.data,
                pr_date: customDayJs().format('YYYY-MM-DD'),
                requisition_issue_id: risRes.id,
                requisition_issue_file: risRes.file,
                from_ppmp: risRes.from_ppmp,
            };
            ris.items = ris.items.filter(risItem => risItem.is_pr_recommended == 1).map(risItem => {
                risItem.item_name = risItem.description;
                risItem.item_code = risItem.item?.item_code;
                risItem.quantity = risItem.request_quantity - risItem.issue_quantity;
                risItem.unit_cost = risItem.procurement_plan_item ? risItem.procurement_plan_item.price : 0;
                risItem.requisition_issue_item_id = risItem.id;
                return risItem;
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
                data: ris
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
                data: {}
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_SELECTED_REQUISITION_ISSUE",
                data: risRes
            });

            history.push("/purchase-requests/form");
        })
        .catch(err => {})
        .then(res => {})
        ;
    }


    const dataSource = props.requisitionIssues;

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedRequisitionIssue(record)
                    if(isEmpty(props.selectedRequisitionIssue)){
                        openRequisitionIssue(record, colIndex);
                    }else{
                        if(props.selectedRequisitionIssue.id != record.id){
                            openRequisitionIssue(record, colIndex);
                        }
                    }
                },
            };
          }
    }
      
    const columns = [
        {
            title: 'RIS Date',
            dataIndex: 'ris_date',
            key: 'ris_date',
            width: 120,
            align: "center",
            ...filter.search('ris_date','date_range', setTableFilter, props.tableFilter, getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'RIS No.',
            dataIndex: 'ris_number',
            key: 'ris_number',
            width: 150,
            align: "center",
            ...filter.search('ris_number','text', setTableFilter, props.tableFilter, getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            ...filter.search('title','text', setTableFilter, props.tableFilter, getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 400,
            ...filter.search('purpose','text', setTableFilter, props.tableFilter, getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },

        {
            title: 'Status',
            key: 'status',
            align: "center",
            width: 120,
            render: (text, item, index) => (
                <span>
                    { item.status }
                </span>
            ),
            filters: [
                { text: 'Approved', value: "Approved" },
                { text: 'Pending', value: "Pending" },
            ],
            ...filter.list('status','text', setTableFilter, props.tableFilter, getRequisitionIssues),
            ...onCell,
        },
        {
            title: 'End User',
            key: 'end_user',
            ellipsis: true,
            width: 250,
            filters: endUserFilter,
            ...filter.list('end_user_id','text', setTableFilter, props.tableFilter, getRequisitionIssues),
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            ),
            ...onCell,
        },
        {
            title: "Action",
            key: "action",
            fixed: 'right',
            width: 100,
            align: "center",
            render: (text, item, index) => (
                <div className='space-x-0.5'>
                    <Tooltip placement="bottom" title={"Edit"}>
                        <Button size='small' type='default' icon={<EditOutlined />}  onClick={() => { editRequisitionIssue(item, index) }}>

                        </Button>
                    </Tooltip>
                    { item.status == "Issued" && (
                        <Tooltip placement="bottom" title={"Create Purchase Request"}>
                            <Button size='small' type='default' icon={<ShoppingCartOutlined />}  onClick={() => { addToPurchaseRequest(item, index) }}>

                            </Button>
                        </Tooltip>
                    ) }
                    {/* <Tooltip placement="bottom" title={"Cancel"}>
                        <Button size='small' type='danger' icon={<StopOutlined />}  onClick={() => { editRequisitionIssue(item, index) }}>

                        </Button>
                    </Tooltip> */}
                </div>
              )
        },
    ];



    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Created Requisition and Issue Slips" bordered={false}>
                        <div className='purchase-request-card-content'>
                            <div className="flex justify-end mb-2 space-x-2">
                                <TableResetFilter defaultTableFilter="reset" setTableFilter={setTableFilter} />
                                <TableRefresh getData={getRequisitionIssues} />
                            </div>
                            <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                                    if(props.selectedRequisitionIssue?.id == record.id){
                                        return "selected-row";
                                    }
                                }}
                                onChange={handleTableChange}
                                size={"small"}
                                pagination={false}
                                scroll={{ y: "50vh" }}
                                loading={{spinning: props.loading, tip: "Loading..."}}
                            />

                            <TableFooterPagination pagination={props.paginationMeta} paginationChange={paginationChange} />
                        </div>
                    </Card>
                </Col>
                { isEmpty(props.selectedRequisitionIssue.file) ? "" : ( 
                    <Col md={24} lg={10} xl={8}>
                            <Card size="small" bordered={false} title="Requisition and Issue Slip Details" extra={(
                                <div className='text-right space-x-0.5'>
                                    <Tooltip placement="top" title={"Open in new window"}>
                                        <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                    </Tooltip>
                                    <Tooltip placement="top" title={"Close window"}>
                                        <Button size='small' type='danger' onClick={() => closeRequisitionIssue() }><CloseOutlined /></Button>
                                    </Tooltip>
                                </div>
                            )}
                            >
                                <div className='purchase-request-card-content'>
                                    <Tabs activeKey={props.tab} type="card" size="small" onChange={setTabKey}>
                                        <TabPane tab="Information" key="information">
                                            <div className='p-2'>
                                                <p>
                                                    <b>RIS No.:</b> {props.selectedRequisitionIssue?.ris_number || ""} <br />
                                                    <b>RIS Date:</b> {props.selectedRequisitionIssue?.ris_date || ""} <br />
                                                    <b>End User:</b> {props.selectedRequisitionIssue?.end_user?.name || ""} <br />
                                                    <b>Purpose:</b> {props.selectedRequisitionIssue?.purpose || ""} <br />
                                                </p>
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Routing" key="routing">
                                            { !isEmpty(props.timelines) ? (
                                                <div className='pt-4'>
                                                    <Timeline>
                                                        { props.timelines.map((timeline, index) => {
                                                            return <Timeline.Item dot={timelineContent(timeline).logo} color={timelineContent(timeline).color} key={index}>{timelineContent(timeline).label}</Timeline.Item>
                                                        }) }
                                                    </Timeline>
                                                </div>
                                            ) : <Skeleton active />  }
                                        </TabPane>
                                        <TabPane tab="Audit Trail" key="audit-trail" style={{padding: "5px", paddingBottom: "50px"}}>
                                            { !isEmpty(props.logger) ? (
                                                <AuditBatches logger={props.logger} />
                                            ) : <Skeleton active /> }
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Card>
                    </Col>
                    )
                }
            </Row>
            { isEmpty(props.selectedRequisitionIssue) ? "" : (
            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Requisition and Issue Slip" bordered={false} loading={props.formLoading}>
                        <div className='forms-card-form-content'>
                            <iframe src={`${props.selectedRequisitionIssue.file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                        </div>
                    </Card>
                </Col>
                <Col md={24} lg={10} xl={8}>
                        <Card size="small" title="Attachments" bordered={false} loading={props.formLoading}>
                            <div className='forms-card-form-content'>
                            <AttachmentUpload formId={props.selectedRequisitionIssue.id} formType="requisition_issue" fileList={props.selectedRequisitionIssue.form_uploads?.data} />
                            </div>
                        </Card>
                    </Col>
            </Row>
            ) }
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ListRequisitionIssue);
