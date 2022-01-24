import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography, Timeline, Tabs   } from 'antd';
import api from '../../api';
import { CloseOutlined, HeartTwoTone, SelectOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'

const { Title } = Typography;
const { TabPane } = Tabs;


function mapStateToProps(state) {
    return {

    };
}

const Listpurchaserequest = (props) => {
    let navigate = useNavigate()
    useEffect(() => {
        getPurchaseRequests();
    }, []);
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [purchaseRequestOutput, setPurchaseRequestOutput] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [timelines, setTimelines] = useState([]);

    const getPurchaseRequests = () => {
        api.PurchaseRequest.all()
        .then(res => {
            let response = res.data.data;
            setPurchaseRequests(response);
        })
        .catch(res => {})
        .then(res => {})
        ;
    }

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
        setSelectedIndex(index)
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
        setSelectedIndex(null);
    }
    const approvePurchaseRequest = (item, index) => {
        openPurchaseRequest(item, index)
        api.PurchaseRequest.approve(item.id)
        .then(res => {
            getPurchaseRequests();
            closePurchaseRequest();
        })
        .catch(err => {})
        .then(res => {})
        ;
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


    const dataSource = purchaseRequests
      
    const columns = [
        {
            title: 'Particulars',
            dataIndex: 'purpose',
            key: 'purpose',
        },
        {
            title: 'Total Cost',
            dataIndex: 'total_cost',
            key: 'total_cost',
        },
        {
            title: 'PR Date',
            dataIndex: 'pr_date',
            key: 'pr_date',
        },
        {
            title: 'Status',
            key: 'process_complete_status',
            render: (text, item, index) => (
                <span>
                    { item.process_complete_status ? "Approved" : "" }
                </span>
            )
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
                    if(selectedIndex == index){
                        return "selected-row";
                    }
                }} />
            </div>
            
            <div className='col-md-4'>
                { purchaseRequestOutput == "" ? "" : 
                <>
                    <div className='text-right'>
                        <Button size='large' type='primary' onClick={() => openInFull() }><SelectOutlined /></Button>
                        <Button size='large' type='danger' onClick={() => closePurchaseRequest() }><CloseOutlined /></Button>
                    </div>
                    

                    <Tabs defaultActiveKey="1" type="card" size="small">
                    <TabPane tab="File" key="1">
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
            <div className='col-md-4'>
                
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Listpurchaserequest);
