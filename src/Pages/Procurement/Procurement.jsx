import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row, Button  } from 'antd';
import ApprovedPurchaseRequest from './ApprovedPurchaseRequest';
import PurchaseRequestWorkspace from './PurchaseRequestWorkspace';
import Icon, {
    CloseOutlined,
} from '@ant-design/icons'
import api from '../../api';
import { debounce } from 'lodash';

function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        purchaseRequestsTableFilter: state.procurement.purchaseRequestsTableFilter,
    };
}

const MaximizeSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M794.432 983.552H51.2a25.6 25.6 0 0 1-25.6-25.6V214.784a25.6 25.6 0 0 1 25.6-25.6h152.768V66.112a25.6 25.6 0 0 1 25.6-25.6H972.8a25.6 25.6 0 0 1 25.6 25.6v743.232a25.6 25.6 0 0 1-25.6 25.6h-152.768v123.008a25.6 25.6 0 0 1-25.6 25.6z m-717.632-51.2h692.032V240.384H76.8v691.968z m743.232-148.672H947.2V91.648H255.168v97.472h539.264a25.6 25.6 0 0 1 25.6 25.6v568.96z" p-id="2528"></path>
    </svg>
);


const Procurement = (props) => {

    useEffect(() => {
        document.title = "Procurement";
    }, []);

    const openInFull = () => {
        window.open(`${props.selectedPurchaseRequest.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }


    const getPurchaseRequests = debounce((filters) => {
        if(filters == null){
            filters = props.purchaseRequestsTableFilter
        }
        props.dispatch({
            type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS_TABLE_LOADING",
            data: true
        });
        api.PurchaseRequest.all(filters)
        .then(res => {
            props.dispatch({
                type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS_TABLE_LOADING",
                data: false
            });
            let data = res.data.data;
            let meta = res.data.meta;
            props.dispatch({
                type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS",
                data: data
            });
            props.dispatch({
                type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS_PAGINATION",
                data: meta.pagination
            });
        })
        .catch(res => {
            props.dispatch({
                type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS_TABLE_LOADING",
                data: false
            });
        })
        .then(res => {})
        ;
    }, 200);
    
    const closePurchaseRequest = () => {
        props.dispatch({
            type: "SELECT_PURCHASE_REQUEST",
            data: {},
        });
    }
    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={16} xl={18}>
                    <Card size="small" title="Approved Puchase Requests" bordered={false}>
                        <div className="procurement-card-container">
                            <ApprovedPurchaseRequest getPurchaseRequests={getPurchaseRequests} />
                        </div>
                    </Card>
                </Col>
                {props.selectedPurchaseRequest && props.selectedPurchaseRequest.file ? (
                <Col xs={24} sm={24} md={24} lg={8} xl={6}>
                    <Card title="Puchase Request Details" size="small" bordered={false} extra={(
                            <div className='text-right space-x-0.5'>
                                <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                <Button size='small' type='danger' onClick={() => closePurchaseRequest() }><CloseOutlined /></Button>
                            </div>
                        )}
                        >
                        <div className="procurement-card-container">
                            <PurchaseRequestWorkspace getPurchaseRequests={getPurchaseRequests} />
                        </div>
                    </Card>
                </Col>
                ) : ""}
            </Row>

            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <Card size="small" title="Section 3" bordered={false} >
                        <div className="procurement-card-container">

                        </div>
                        {/* <ApprovedPurchaseRequest /> */}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={16} xl={18}>
                    <Card size="small" title="Section 4" bordered={false} >

                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={6}>
                    <Card size="small" title="Section 5" bordered={false}>

                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Procurement);

