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
    StopOutlined,
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

const MaximizeSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M794.432 983.552H51.2a25.6 25.6 0 0 1-25.6-25.6V214.784a25.6 25.6 0 0 1 25.6-25.6h152.768V66.112a25.6 25.6 0 0 1 25.6-25.6H972.8a25.6 25.6 0 0 1 25.6 25.6v743.232a25.6 25.6 0 0 1-25.6 25.6h-152.768v123.008a25.6 25.6 0 0 1-25.6 25.6z m-717.632-51.2h692.032V240.384H76.8v691.968z m743.232-148.672H947.2V91.648H255.168v97.472h539.264a25.6 25.6 0 0 1 25.6 25.6v568.96z" p-id="2528"></path>
    </svg>
);
const HistorySvg = () => (
    <svg t="1646016733511" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5477" width="1.3em" height="1.3em"><path d="M411.733333 885.333333H192c-6.4 0-10.666667-4.266667-10.666667-10.666666V149.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h576c6.4 0 10.666667 4.266667 10.666667 10.666666v219.733334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c0-40.533333-34.133333-74.666667-74.666667-74.666666H192C151.466667 74.666667 117.333333 108.8 117.333333 149.333333v725.333334c0 40.533333 34.133333 74.666667 74.666667 74.666666h219.733333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z" p-id="5478"></path><path d="M704 458.666667c-134.4 0-245.333333 110.933333-245.333333 245.333333S569.6 949.333333 704 949.333333 949.333333 838.4 949.333333 704 838.4 458.666667 704 458.666667z m0 426.666666c-100.266667 0-181.333333-81.066667-181.333333-181.333333s81.066667-181.333333 181.333333-181.333333 181.333333 81.066667 181.333333 181.333333-81.066667 181.333333-181.333333 181.333333z" p-id="5479"></path><path d="M802.133333 716.8l-66.133333-29.866667V597.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v110.933334c0 12.8 8.533333 23.466667 19.2 29.866666l85.333333 38.4c4.266667 2.133333 8.533333 2.133333 12.8 2.133334 12.8 0 23.466667-6.4 29.866667-19.2 6.4-17.066667 0-34.133333-17.066667-42.666667zM693.333333 298.666667c0-17.066667-14.933333-32-32-32H298.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h362.666666c17.066667 0 32-14.933333 32-32zM298.666667 437.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h106.666666c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-106.666666z" p-id="5480"></path></svg>
    );
const RouteSvg = () => (
    <svg t="1646016046903" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2175" width="1.3em" height="1.3em"><path d="M264.64 340.8l5.76 20.8c9.28 30.08 21.44 54.4 54.4 54.4s64-23.68 44.8-83.2l-90.56-256C256 12.16 151.04 16.32 131.2 73.6l-92.8 260.8C21.76 390.08 48.96 416 84.8 416s44.8-27.84 50.56-47.36l8-27.84zM203.52 131.52l37.76 128H166.08z m704 656.32c97.92-9.6 124.16-180.16-59.84-180.16h-139.52c-40 0-53.44 20.16-53.44 58.88v269.76a49.6 49.6 0 0 0 51.2 55.68h151.36c178.88 0 168.64-184 49.28-203.84z m-142.08-96c155.84 0 155.2 64 0 64z m0 215.36V835.2c177.92 0 152.96 72.96-1.28 72.96zM846.4 256c-29.44-120.96-260.16-112.96-373.12-112.96a48 48 0 0 0 0 96c32 0 261.44-4.48 280 39.36 9.6 114.56-657.92 274.56-608 484.16 29.44 120.96 260.16 112.96 373.12 112.96a48 48 0 0 0 0-96c-32 0-261.44 4.48-280-39.36C229.44 624.32 896 464.32 846.4 256z" fill="#231F20" p-id="2176"></path></svg>
);

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
            let purchaseRequest = res.data;
            purchaseRequest.items = res.data.items.data;
            // purchaseRequest.requestedBy = purchaseRequest.requested_by.title;
            // purchaseRequest.approvedBy = purchaseRequest.approved_by.title;
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
                data: purchaseRequest
            });
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_CREATE_FORM_TYPE",
                data: "update"
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
            width: 150,
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
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 450,
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
                    {/* <Tooltip placement="bottom" title={"Cancel"}>
                        <Button size='small' type='danger' icon={<StopOutlined />}  onClick={() => { editRequisitionIssue(item, index) }}>

                        </Button>
                    </Tooltip> */}
                </div>
              )
        },
    ];
    
    const menu = (item, index) => (
        <Menu>
            <Menu.Item key="menu-route" icon={<Icon component={RouteSvg} />}  onClick={() => { setTabKey('routing');openRequisitionIssue(item, 0) }}>
                Routing
            </Menu.Item>
            <Menu.Item key="menu-audit" icon={<Icon component={HistorySvg} />}  onClick={() => { setTabKey('audit-trail');openRequisitionIssue(item, 0) }}>
                Audit Trail
            </Menu.Item>
            <Menu.Item key="menu-items-audit" icon={<Icon component={HistorySvg} />}  onClick={() => { setTabKey('items-audit-trail');openRequisitionIssue(item, 0) }}>
                Items Audit Trail
            </Menu.Item>
            <Menu.Item key="menu-edit" icon={<EditOutlined />}  onClick={() => { editRequisitionIssue(item, index) }}>
                Edit
            </Menu.Item>
        </Menu>
      );


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
                                                    <b>PR No.:</b> {props.selectedRequisitionIssue?.purchase_request_number || ""} <br />
                                                    <b>PR Date:</b> {props.selectedRequisitionIssue?.pr_date || ""} <br />
                                                    <b>Requisition and Issue Description Classification:</b> {props.selectedRequisitionIssue.account?.parent?.name || ""} <br />
                                                    <b>Requisition and Issue Description:</b> {props.selectedRequisitionIssue.account?.name || ""} <br />
                                                    <b>Mode of Requisition and Issue:</b> {props.selectedRequisitionIssue.mode_of_procurement?.name || ""} <br />
                                                    <b>End User:</b> {props.selectedRequisitionIssue?.end_user?.name || ""} <br />
                                                    <b>Fund Cluster:</b> {props.selectedRequisitionIssue?.fund_cluster || ""} <br />
                                                    <b>Responsibility Center Code:</b> {props.selectedRequisitionIssue?.center_code || ""} <br />
                                                    <b>Total Unit Cost:</b> {props.selectedRequisitionIssue?.total_cost_formatted || ""} <br />
                                                    <b>Purpose:</b> {props.selectedRequisitionIssue?.purpose || ""} <br />
                                                    <b>Charge To:</b> {props.selectedRequisitionIssue?.charge_to || ""} <br />
                                                    <b>Alloted Amount:</b> {props.selectedRequisitionIssue?.alloted_amount || ""} <br />
                                                    <b>UACS Code:</b> {props.selectedRequisitionIssue?.uacs_code?.name || ""} <br />
                                                    <b>SA/OR:</b> {props.selectedRequisitionIssue?.sa_or || ""} <br />
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
                                                <AuditTrail logger={props.logger} tableScroll="65vh" hasChild childProp="purchase_request"  displayProp="display_log" />
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
                <Col md={24} lg={16} xl={18}>
                    <Card size="small" title="Requisition and Issue Slip" bordered={false} loading={props.formLoading}>
                        <div className='forms-card-form-content'>
                            <iframe src={`${props.selectedRequisitionIssue.file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                        </div>
                    </Card>
                </Col>
                <Col md={24} lg={8} xl={6}>
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
