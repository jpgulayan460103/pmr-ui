import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Tag, Space, Divider } from 'antd';
import api from '../../api';


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

    const getPurchaseRequest = () => {
        api.PurchaseRequest.get()
        .then(res => {
            setPurchaseRequests(res.data.data);
        })
        .catch(res => {})
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
            title: 'Actions',
            key: 'actions',
            render: item => (
                <>
                    <span className='custom-pointer' onClick={() => { setPurchaseRequestOutput(item.purchase_request_uuid) }}>View</span>
                </>
            )
        },
    ];
    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <div className='col-md-8'>
                <Table dataSource={dataSource} columns={columns} />
            </div>
            <div className='col-md-4'>
                {
                    purchaseRequestOutput == "" ? "" : (<iframe src={`http://pmr-api.test/api/pdf/purchase-requests/${purchaseRequestOutput}`} width="100%" height="100%"></iframe>) 
                }
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Listpurchaserequest);
