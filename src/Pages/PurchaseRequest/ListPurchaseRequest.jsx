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
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
import dayjs from 'dayjs';
import { debounce, isEmpty } from 'lodash';
import filter from '../../Utilities/filter';
import AuditTrail from '../../Components/AuditTrail';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized
    };
}

const MaximizeSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M794.432 983.552H51.2a25.6 25.6 0 0 1-25.6-25.6V214.784a25.6 25.6 0 0 1 25.6-25.6h152.768V66.112a25.6 25.6 0 0 1 25.6-25.6H972.8a25.6 25.6 0 0 1 25.6 25.6v743.232a25.6 25.6 0 0 1-25.6 25.6h-152.768v123.008a25.6 25.6 0 0 1-25.6 25.6z m-717.632-51.2h692.032V240.384H76.8v691.968z m743.232-148.672H947.2V91.648H255.168v97.472h539.264a25.6 25.6 0 0 1 25.6 25.6v568.96z" p-id="2528"></path>
    </svg>
);
const HistorySvg = () => (
    <svg t="1646016733511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5477" width="1.3em" height="1.3em"><path d="M411.733333 885.333333H192c-6.4 0-10.666667-4.266667-10.666667-10.666666V149.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h576c6.4 0 10.666667 4.266667 10.666667 10.666666v219.733334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c0-40.533333-34.133333-74.666667-74.666667-74.666666H192C151.466667 74.666667 117.333333 108.8 117.333333 149.333333v725.333334c0 40.533333 34.133333 74.666667 74.666667 74.666666h219.733333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z" p-id="5478"></path><path d="M704 458.666667c-134.4 0-245.333333 110.933333-245.333333 245.333333S569.6 949.333333 704 949.333333 949.333333 838.4 949.333333 704 838.4 458.666667 704 458.666667z m0 426.666666c-100.266667 0-181.333333-81.066667-181.333333-181.333333s81.066667-181.333333 181.333333-181.333333 181.333333 81.066667 181.333333 181.333333-81.066667 181.333333-181.333333 181.333333z" p-id="5479"></path><path d="M802.133333 716.8l-66.133333-29.866667V597.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v110.933334c0 12.8 8.533333 23.466667 19.2 29.866666l85.333333 38.4c4.266667 2.133333 8.533333 2.133333 12.8 2.133334 12.8 0 23.466667-6.4 29.866667-19.2 6.4-17.066667 0-34.133333-17.066667-42.666667zM693.333333 298.666667c0-17.066667-14.933333-32-32-32H298.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h362.666666c17.066667 0 32-14.933333 32-32zM298.666667 437.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h106.666666c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-106.666666z" p-id="5480"></path></svg>
    );
const RouteSvg = () => (
    <svg t="1646016046903" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2175" width="1.3em" height="1.3em"><path d="M264.64 340.8l5.76 20.8c9.28 30.08 21.44 54.4 54.4 54.4s64-23.68 44.8-83.2l-90.56-256C256 12.16 151.04 16.32 131.2 73.6l-92.8 260.8C21.76 390.08 48.96 416 84.8 416s44.8-27.84 50.56-47.36l8-27.84zM203.52 131.52l37.76 128H166.08z m704 656.32c97.92-9.6 124.16-180.16-59.84-180.16h-139.52c-40 0-53.44 20.16-53.44 58.88v269.76a49.6 49.6 0 0 0 51.2 55.68h151.36c178.88 0 168.64-184 49.28-203.84z m-142.08-96c155.84 0 155.2 64 0 64z m0 215.36V835.2c177.92 0 152.96 72.96-1.28 72.96zM846.4 256c-29.44-120.96-260.16-112.96-373.12-112.96a48 48 0 0 0 0 96c32 0 261.44-4.48 280 39.36 9.6 114.56-657.92 274.56-608 484.16 29.44 120.96 260.16 112.96 373.12 112.96a48 48 0 0 0 0-96c-32 0-261.44 4.48-280-39.36C229.44 624.32 896 464.32 846.4 256z" fill="#231F20" p-id="2176"></path></svg>
);

const Listpurchaserequest = (props) => {
    let history = useHistory()
    useEffect(() => {
        document.title = "List of Purchase Request";
        if(props.isInitialized){
            getPurchaseRequests();
        }
    }, [props.isInitialized]);
    
    
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState({
        current_page: 1,
        total: 1,
        per_page: 1,
    });
    const [purchaseRequestOutput, setPurchaseRequestOutput] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [timelines, setTimelines] = useState([]);
    const [filterData, setFilterData] = useState({
        page: 1,
    });
    const [loggerItems, setLoggerItems] = useState([]);
    const [logger, setLogger] = useState([]);
    const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState({});
    const [tabKey, setTabKey] = useState('information');

    const getPurchaseRequests = debounce((filters) => {
        if(filters == null){
            filters = filterData
        }
        setTableLoading(true);
        api.PurchaseRequest.all(filters)
        .then(res => {
            setTableLoading(false);
            let data = res.data.data;
            let meta = res.data.meta;
            setPurchaseRequests(data);
            setPaginationMeta(meta.pagination);
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {})
        ;
    }, 200);
     

    const getPurchaseRequest = (id) => {
        api.PurchaseRequest.get(id);
    }
    

    const openInFull = () => {
        window.open(`${purchaseRequestOutput}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }


    const openPurchaseRequest = async (item, index) => {
        setPurchaseRequestOutput(item.file);
        setSelectedPurchaseRequest(item)
        setTimelines([]);
        setLogger([]);
        setLoggerItems([]);
        await loadPurchaseRequestData(item.id);
        await loadAuditTrail(item.id);
        await loadItemsAuditTrail(item.id);
    }

    const loadPurchaseRequestData = async (id) => {
        await api.PurchaseRequest.get(id)
        .then(res => {
            let item = res.data;
            let form_routes = item.form_routes.data;
            setTimelines(form_routes);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    const closePurchaseRequest = () => {
        setPurchaseRequestOutput("");
        setSelectedPurchaseRequest({});
    }

    const editPurchaseRequest = (item, index) => {
        api.PurchaseRequest.get(item.id)
        .then(res => {
            let purchaseRequest = res.data;
            purchaseRequest.items = res.data.items.data;
            purchaseRequest.requestedBy = purchaseRequest.requested_by.title;
            purchaseRequest.approvedBy = purchaseRequest.approved_by.title;
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_FORM_DATA",
                data: purchaseRequest
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_FORM_TYPE",
                data: "update"
            });
            history.push("/purchase-requests/form");
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const loadAuditTrail = async (id) => {
        await api.PurchaseRequest.logger(id)
        .then(res => {
            setLogger(res.data.data);
        })
        .catch(res => {})
        .then(res => {})
    }

    const loadItemsAuditTrail = async (id) => {
        await api.PurchaseRequest.loggerItems(id)
        .then(res => {
            setLoggerItems(res.data.data);
        })
        .catch(res => {})
        .then(res => {})
    }

    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        getPurchaseRequests(filters)
    };

    const paginationChange = async (e) => {
        setFilterData(prev => ({...prev, page: e}));
        getPurchaseRequests({...filterData, page: e})
    }

    const timelineContent = (timeline) => {
        let label = (<>
            {timeline.status_str} on <i>{ timeline.updated_at }</i><br /> 
            <b>{timeline.to_office?.name}</b> <br />
            {timeline.status == 'with_issues' ? "For resolution" : timeline.remarks}
        </>)
        let color =""
        let logo =""
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
                color = "gray";
                logo = <LoadingOutlined />
                break;
        }
        return { label, color, logo }
    }

    const dataSource = purchaseRequests

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedPurchaseRequest(record)
                    if(isEmpty(selectedPurchaseRequest)){
                        openPurchaseRequest(record, colIndex);
                    }else{
                        if(selectedPurchaseRequest.id != record.id){
                            openPurchaseRequest(record, colIndex);
                        }
                    }
                },
            };
          }
    }
      
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 450,
            ...filter.search('title','text', setFilterData, filterData, getPurchaseRequests),
            ...onCell
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 450,
            ...filter.search('purpose','text', setFilterData, filterData, getPurchaseRequests),
            ...onCell
        },
        {
            title: 'Total Cost',
            key: 'total_cost',
            width: 150,
            align: "center",
            // ...filter.search('total_cost','number', setFilterData, filterData, getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    { item.total_cost_formatted }
                </span>
            ),
            ...onCell,
        },
        {
            title: 'PR Date',
            dataIndex: 'pr_date',
            key: 'pr_date',
            width: 120,
            align: "center",
            ...filter.search('pr_date','date_range', setFilterData, filterData, getPurchaseRequests),
            ...onCell,
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
            ...filter.list('status','text', setFilterData, filterData, getPurchaseRequests),
            ...onCell,
        },
        {
            title: "Action",
            key: "action",
            fixed: 'right',
            width: 60,
            align: "center",
            render: (text, item, index) => (
                <Dropdown overlay={menu(item, index)} trigger={['click']}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
              )
        },
    ];
    
    const menu = (item, index) => (
        <Menu>
            <Menu.Item key="menu-route" icon={<Icon component={RouteSvg} />}  onClick={() => { setTabKey('routing');openPurchaseRequest(item, 0) }}>
                Routing
            </Menu.Item>
            <Menu.Item key="menu-audit" icon={<Icon component={HistorySvg} />}  onClick={() => { setTabKey('audit-trail');openPurchaseRequest(item, 0) }}>
                Audit Trail
            </Menu.Item>
            <Menu.Item key="menu-items-audit" icon={<Icon component={HistorySvg} />}  onClick={() => { setTabKey('items-audit-trail');openPurchaseRequest(item, 0) }}>
                Items Audit Trail
            </Menu.Item>
            <Menu.Item key="menu-edit" icon={<EditOutlined />}  onClick={() => { editPurchaseRequest(item, index) }}>
                Edit
            </Menu.Item>
        </Menu>
      );


    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Created Puchase Requests" bordered={false}>
                        <div className='purchase-request-card-content'>
                            <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                                    if(selectedPurchaseRequest?.id == record.id){
                                        return "selected-row";
                                    }
                                }}
                                onChange={handleTableChange}
                                size={"small"}
                                pagination={false}
                                scroll={{ y: "50vh" }}
                                loading={{spinning: tableLoading, tip: "Loading..."}}
                            />

                            <div className="flex justify-end mt-2">
                                <Pagination
                                    current={paginationMeta?.current_page || 1}
                                    total={paginationMeta?.total || 1}
                                    pageSize={paginationMeta?.per_page || 1}
                                    onChange={paginationChange}
                                    // showSizeChanger
                                    showQuickJumper
                                    size="small"
                                    // onShowSizeChange={(current, size) => changePageSize(current, size)}
                                />
                            </div>
                        </div>
                    </Card>
                </Col>
                { purchaseRequestOutput == "" ? "" : (
                    <Col md={24} lg={10} xl={8}>
                            <Card size="small" bordered={false} title="Puchase Request Details" extra={(
                                <div className='text-right space-x-0.5'>
                                    <Tooltip placement="top" title={"Open in new window"}>
                                        <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                    </Tooltip>
                                    <Tooltip placement="top" title={"Close window"}>
                                        <Button size='small' type='danger' onClick={() => closePurchaseRequest() }><CloseOutlined /></Button>
                                    </Tooltip>
                                </div>
                            )}
                            >
                                <div className='purchase-request-card-content'>
                                    <Tabs activeKey={tabKey} type="card" size="small" onChange={setTabKey}>
                                        <TabPane tab="Information" key="information">
                                            <div className='p-2'>
                                                <p>
                                                    <b>PR No.:</b> {selectedPurchaseRequest?.purchase_request_number || ""} <br />
                                                    <b>PR Date:</b> {selectedPurchaseRequest?.pr_date || ""} <br />
                                                    <b>Procurement Category:</b> {selectedPurchaseRequest.procurement_type?.parent?.name || ""} <br />
                                                    <b>Procurement Type:</b> {selectedPurchaseRequest.procurement_type?.name || ""} <br />
                                                    <b>Mode of Procurement:</b> {selectedPurchaseRequest.mode_of_procurement?.name || ""} <br />
                                                    <b>End User:</b> {selectedPurchaseRequest?.end_user?.name || ""} <br />
                                                    <b>Fund Cluster:</b> {selectedPurchaseRequest?.fund_cluster || ""} <br />
                                                    <b>Responsibility Center Code:</b> {selectedPurchaseRequest?.center_code || ""} <br />
                                                    <b>Total Unit Cost:</b> {selectedPurchaseRequest?.total_cost_formatted || ""} <br />
                                                    <b>Purpose:</b> {selectedPurchaseRequest?.purpose || ""} <br />
                                                    <b>Charge To:</b> {selectedPurchaseRequest?.charge_to || ""} <br />
                                                    <b>Alloted Amount:</b> {selectedPurchaseRequest?.alloted_amount || ""} <br />
                                                    <b>UACS Code:</b> {selectedPurchaseRequest?.uacs_code || ""} <br />
                                                    <b>SA/OR:</b> {selectedPurchaseRequest?.sa_or || ""} <br />
                                                </p>
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Routing" key="routing">
                                            { !isEmpty(timelines) ? (
                                                <div className='pt-4'>
                                                    <Timeline>
                                                        { timelines.map((timeline, index) => {
                                                            return <Timeline.Item dot={timelineContent(timeline).logo} color={timelineContent(timeline).color} key={index}>{timelineContent(timeline).label}</Timeline.Item>
                                                        }) }
                                                    </Timeline>
                                                </div>
                                            ) : <Skeleton active />  }
                                        </TabPane>
                                        <TabPane tab="Audit Trail" key="audit-trail" style={{padding: "5px", paddingBottom: "50px"}}>
                                            { !isEmpty(logger) ? (
                                                <AuditTrail logger={logger} tableScroll="65vh" displayProp={ selectedPurchaseRequest.purchase_request_number ? "purchase_request_number" : "uuid_last" } />
                                            ) : <Skeleton active /> }
                                        </TabPane>
                                        <TabPane tab="Items Audit Trail" key="items-audit-trail">
                                            { !isEmpty(loggerItems) ? (
                                                <AuditTrail logger={loggerItems} tableScroll="65vh" displayProp="item_name" />
                                            ) : <Skeleton active /> }
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Card>
                    </Col>
                    )
                }
            </Row>
            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <div className='purchase-request-card-content'>
                        { isEmpty(selectedPurchaseRequest) ? "" : (
                            <iframe src={`${purchaseRequestOutput}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                        ) }
                    </div>
                </Col>
            </Row>
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Listpurchaserequest);
