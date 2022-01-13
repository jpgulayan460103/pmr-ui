import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography  } from 'antd';
import api from '../../api';
import { CloseOutlined, HeartTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

const { Title } = Typography;


function mapStateToProps(state) {
    return {

    };
}

const Listpurchaserequest = () => {
    useEffect(() => {
        getPurchaseRequest();
    }, []);
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [purchaseRequestOutput, setPurchaseRequestOutput] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);

    const getPurchaseRequest = () => {
        api.PurchaseRequest.get()
        .then(res => {
            let response = res.data.data;
            setPurchaseRequests(response);
        })
        .catch(res => {})
        .then(res => {})
        ;
    }


    const openPurchaseRequest = (item, index) => {
        setPurchaseRequestOutput(item.purchase_request_uuid);
        setSelectedIndex(index)
    }
    const closePurchaseRequest = () => {
        setPurchaseRequestOutput("");
        setSelectedIndex(null);
    }
    const approvePurchaseRequest = (item, index) => {
        openPurchaseRequest(item, index)
        api.PurchaseRequest.approve(item.id)
        .then(res => {
            getPurchaseRequest();
            closePurchaseRequest();
        })
        .catch(err => {})
        .then(res => {})
        ;
    }


    const dataSource = purchaseRequests
      
    const columns = [
        {
            title: 'End User',
            dataIndex: '',
            key: 'end_user',
            render: (text, item, index) => (
                <span>{ item.end_user.name }</span>
            )
        },
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
            title: 'Actions',
            key: 'actions',
            render: (text, item, index) => (
                <Space size={2}>
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
                { purchaseRequestOutput == "" ? "" : <div className='text-right'>
                    <Button type='danger' onClick={() => closePurchaseRequest() }><CloseOutlined /></Button>
                </div> }
                {
                    purchaseRequestOutput == "" ? "" : (<iframe src={`http://pmr-api.test/api/pdf/purchase-requests/${purchaseRequestOutput}?view=1`} width="100%" height="100%"></iframe>) 
                }
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Listpurchaserequest);
