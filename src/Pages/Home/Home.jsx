import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row } from 'antd';
import style from './style.less'
import SummaryPurchaseRequest from './Components/SummaryPurchaseRequest';
import BarPurchaseRequest from './Components/BarPurchaseRequest';
import TopRequestedItems from './Components/TopRequestedItems';

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const Home = () => {
    return (
        <div style={style}>
             <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <SummaryPurchaseRequest label="Total Approved Purchase Request" />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <SummaryPurchaseRequest label="Total Approved Purchase Request" />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <SummaryPurchaseRequest label="Total Approved Purchase Request" />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <SummaryPurchaseRequest label="Total Approved Purchase Request" />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <BarPurchaseRequest label="Total Approved Purchase Request" />
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="mb-3">
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <TopRequestedItems label="Top requested items" />
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Home);

