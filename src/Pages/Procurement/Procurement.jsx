import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row, Button  } from 'antd';
import ApprovedPurchaseRequest from './ApprovedPurchaseRequest';
import PurchaseRequestWorkspace from './PurchaseRequestWorkspace';
import Icon, {
    CloseOutlined,
} from '@ant-design/icons'

function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
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
                    <Card size="small" title="Approved Puchase Requests" bordered={false}  className="procurement-applet-container">
                        <ApprovedPurchaseRequest />
                    </Card>
                </Col>
                {props.selectedPurchaseRequest && props.selectedPurchaseRequest.file ? (
                <Col xs={24} sm={24} md={24} lg={8} xl={6}>
                    <Card size="small" title="Puchase Request Details" bordered={false} className="procurement-applet-container" extra={(
                            <div className='text-right space-x-0.5'>
                                <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                <Button size='small' type='danger' onClick={() => closePurchaseRequest() }><CloseOutlined /></Button>
                            </div>
                        )}>
                        
                            <PurchaseRequestWorkspace />
                    </Card>
                </Col>
                ) : ""}
            </Row>

            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <Card size="small" title="Section 3" bordered={false}  className="procurement-applet-container">
                        {/* <ApprovedPurchaseRequest /> */}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={16} xl={18}>
                    <Card size="small" title="Section 4" bordered={false}  className="procurement-applet-container">

                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={6}>
                    <Card size="small" title="Section 5" bordered={false} className="procurement-applet-container">

                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Procurement);

