import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row  } from 'antd';
import style from './style.less'

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const Home = () => {
    return (
        <div style={style}>
             <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                    <Card size="small" bordered={false}  >
                        <div>
                            Purchase Request
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                    <Card size="small" bordered={false}  >
                        <div>
                            Forwarded Forms
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                    <Card size="small" bordered={false}  >
                        <div>
                            Approved Forms
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                    <Card size="small" bordered={false}  >
                        <div>
                            Disapproved Forms
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Home);

