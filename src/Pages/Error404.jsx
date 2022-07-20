import { Card, Col, Row } from 'antd';
import React from 'react';
import { StarOutlined, StarFilled, FrownOutlined } from '@ant-design/icons';

const Error404 = () => {
    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <Card size="small" title="" bordered={false}>
                        <div className='forms-card-form-content' style={{height: "85vh"}}>
                            <p className='text-center p-8'>
                                <br />
                                <br />
                                <FrownOutlined style={{color: "#71717A", fontSize: "200px"}} />
                                <br />
                                <br />
                                <span className='text-gray-600 font-bold text-9xl font-mono'>404</span>
                                <br />
                                <br />
                                <span className='text-gray-400 font-bold text-4xl font-serif'>Page not found</span>
                                <br />
                                <br />
                                <br />
                                <span className='text-gray-500 font-bold text-2xl font-serif'>The page you are looking for doesn't exists.</span>
                            </p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Error404;
