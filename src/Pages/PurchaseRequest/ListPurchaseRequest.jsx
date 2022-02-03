import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker  } from 'antd';
import api from '../../api';
import Icon, { CloseOutlined, HeartTwoTone, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import filter from '../../Shared/filter';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;


function mapStateToProps(state) {
    return {

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
        getPurchaseRequests();
    }, []);
    
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


    const openPurchaseRequest = (item, index) => {
        setPurchaseRequestOutput(item.file);
        setSelectedItem(item)
        let form_routes = item.form_routes.data;
        let form_routes_process = item.form_process.form_routes;
        let new_route = [];
        for (let index = 0; index < form_routes.length; index++) {
            if(form_routes[index]['status'] != "pending"){
                new_route.push({
                    status: "pending",
                    status_str: form_routes[index]['status_str'],
                    to_office: form_routes[index]['to_office'],
                    created_at: form_routes[index]['created_at'],
                });

                new_route.push({
                    status: form_routes[index]['status'],
                    status_str: form_routes[index]['status_str'],
                    to_office: form_routes[index]['to_office'],
                    created_at: form_routes[index]['updated_at'],
                });
            }else{
                new_route.push({
                    status: form_routes[index]['status'],
                    status_str: form_routes[index]['status_str'],
                    to_office: form_routes[index]['to_office'],
                    created_at: form_routes[index]['created_at'],
                });
            }
        }
        setTimelines(form_routes);
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
            console.log(purchaseRequest);
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

    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        getPurchaseRequests(filters)
    };

    const paginationChange = async (e) => {
        setFilterData(prev => ({...prev, page: e}));
        getPurchaseRequests({...filterData, page: e})
    }

    const dataSource = purchaseRequests
      
    const columns = [
        {
            title: 'Particulars',
            dataIndex: 'purpose',
            key: 'purpose',
            ...filter.search('purpose','text', setFilterData, filterData, getPurchaseRequests),
        },
        {
            title: 'Total Cost',
            key: 'total_cost',
            ...filter.search('total_cost','number', setFilterData, filterData, getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    { item.total_cost_formatted }
                </span>
            ),
            
        },
        {
            title: 'PR Date',
            dataIndex: 'pr_date',
            key: 'pr_date',
            ...filter.search('pr_date','date_range', setFilterData, filterData, getPurchaseRequests),
        },
        {
            title: 'Status',
            key: 'status',
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
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, item, index) => (
                <Space size={2}>
                    <span className='custom-pointer' onClick={() => { editPurchaseRequest(item, index) }}>Edit</span> |
                    <span className='custom-pointer' onClick={() => { openPurchaseRequest(item, index) }}>View</span>
                </Space>
            )
        },
    ];
    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <div className='col-md-8'>
                <Title level={2} className='text-center'>Purchase Request</Title>
                <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                    if(selectedItem?.id == record.id){
                        return "selected-row";
                    }
                }}
                onChange={handleTableChange}
                size={"small"}
                pagination={false}
                loading={tableLoading}
                />
                <Pagination
                    current={paginationMeta.current_page}
                    total={paginationMeta.total}
                    pageSize={paginationMeta.per_page}
                    className='mt-2'
                    onChange={paginationChange}
                />
            </div>
            
            <div className='col-md-4'>
                { purchaseRequestOutput == "" ? "" : 
                <>
                    <div className='text-right'>
                        <Button size='large' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                        <Button size='large' type='danger' onClick={() => closePurchaseRequest() }><CloseOutlined /></Button>
                    </div>
                    

                    <Tabs defaultActiveKey="1" type="card" size="small">
                    <TabPane tab="File" key="1" style={{minHeight: "50vh"}}>
                        <iframe src={`${purchaseRequestOutput}?view=1`} width="100%" height="100%"></iframe>
                    </TabPane>
                    <TabPane tab="Routing" key="2">
                        <Timeline mode="left">
                            { timelines.map((timeline, index) => {
                                let color;
                                let label;
                                if(timeline.status == "approved"){
                                    color = "green";
                                    label = `${timeline.status_str} by the [${timeline.to_office?.name}]`;
                                }else if(timeline.status == "rejected"){
                                    color = "red";
                                    label = `Disapproved by the [${timeline.to_office?.name}] remarks: ${timeline.remarks}`;
                                }else if(timeline.status == "with_issues"){
                                    color = "gray";
                                    label = `Returned from the [${timeline.from_office?.name}] to the [${timeline.to_office?.name}]`;
                                }else if(timeline.status == "resolved"){
                                    color = "green";
                                    label = `Resolved issues and returned to the [${timeline.from_office?.name}]  remarks: ${timeline.remarks}`;
                                }else{
                                    color = "gray";
                                    label = `For approval of the [${timeline.to_office?.name}]`;
                                }
                                return <Timeline.Item color={color} label={timeline.updated_at} key={index}>{label}</Timeline.Item>
                            }) }
                        </Timeline>
                    </TabPane>
                    </Tabs>
                </>
                }
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Listpurchaserequest);
