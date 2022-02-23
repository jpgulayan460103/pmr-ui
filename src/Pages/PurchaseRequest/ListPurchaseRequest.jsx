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
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs';
import { debounce, isEmpty } from 'lodash';
import filter from '../../Shared/filter';
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

const Listpurchaserequest = (props) => {
    let navigate = useNavigate()
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
    const [selectedItem, setSelectedItem] = useState(null);
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
        setSelectedItem(item)
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
            // let form_routes_process = item.form_process.form_routes;
            // let new_route = [];
            // for (let index = 0; index < form_routes.length; index++) {
            //     if(form_routes[index]['status'] != "pending"){
            //         new_route.push({
            //             status: "pending",
            //             status_str: form_routes[index]['status_str'],
            //             to_office: form_routes[index]['to_office'],
            //             created_at: form_routes[index]['created_at'],
            //         });
    
            //         new_route.push({
            //             status: form_routes[index]['status'],
            //             status_str: form_routes[index]['status_str'],
            //             to_office: form_routes[index]['to_office'],
            //             created_at: form_routes[index]['updated_at'],
            //         });
            //     }else{
            //         new_route.push({
            //             status: form_routes[index]['status'],
            //             status_str: form_routes[index]['status_str'],
            //             to_office: form_routes[index]['to_office'],
            //             created_at: form_routes[index]['created_at'],
            //         });
            //     }
            // }
            setTimelines(form_routes);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    const closePurchaseRequest = () => {
        setPurchaseRequestOutput("");
        setSelectedItem(null);
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
            navigate("/purchase-requests/form");
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
        // `${timeline.status_str} by the [${timeline.to_office?.name}]`
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
            ...filter.search('total_cost','number', setFilterData, filterData, getPurchaseRequests),
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
            <Menu.Item key="menu-information" icon={<FormOutlined />}  onClick={() => { setTabKey('information');openPurchaseRequest(item, 0) }}>
                View Information
            </Menu.Item>
            <Menu.Item key="menu-route" icon={<FormOutlined />}  onClick={() => { setTabKey('routing');openPurchaseRequest(item, 0) }}>
                View Routing
            </Menu.Item>
            <Menu.Item key="menu-audit" icon={<FormOutlined />}  onClick={() => { setTabKey('audit-trail');openPurchaseRequest(item, 0) }}>
                View Audit Trail
            </Menu.Item>
            <Menu.Item key="menu-items-audit" icon={<FormOutlined />}  onClick={() => { setTabKey('items-audit-trail');openPurchaseRequest(item, 0) }}>
                View Items Audit Trail
            </Menu.Item>
            <Menu.Item key="menu-edit" icon={<EditOutlined />}  onClick={() => { editPurchaseRequest(item, index) }}>
                Edit Purchase Request
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
                                    if(selectedItem?.id == record.id){
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
                                                <AuditTrail logger={logger} tableScroll="65vh" displayProp={ selectedItem.purchase_request_number ? "purchase_request_number" : "uuid_last" } />
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
