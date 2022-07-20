import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row, Button, Tooltip  } from 'antd';
import ApprovedPurchaseRequest from './ApprovedPurchaseRequest';
import PurchaseRequestWorkspace from './PurchaseRequestWorkspace';
import Icon, {
    CloseOutlined,
    VerticalAlignTopOutlined,
} from '@ant-design/icons'
import api from '../../api';
import { debounce } from 'lodash';
import MaximizeSvg from '../../Icons/MaximizeSvg';

function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurements.purchaseRequest.selectedPurchaseRequest,
        tableFilter: state.procurements.purchaseRequest.tableFilter,
        workspaceLoading: state.procurements.purchaseRequest.workspaceLoading,
        uploadingFiles: state.user.uploadingFiles,
    };
}



const Procurement = (props) => {

    useEffect(() => {
        document.title = "Procurement";
    }, []);

    const [fRow1, setfRow1] = useState(14);
    const [fRow2, setfRow2] = useState(10);

    const openInFull = () => {
        window.open(`${props.selectedPurchaseRequest.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }


    const getPurchaseRequests = debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        props.dispatch({
            type: "SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_LOADING",
            data: true
        });
        api.PurchaseRequest.all(filters)
        .then(res => {
            props.dispatch({
                type: "SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_LOADING",
                data: false
            });
            let data = res.data.data;
            let meta = res.data.meta;
            props.dispatch({
                type: "SET_PROCUREMENT_PURCHASE_REQUESTS_PURCHASE_REQUESTS",
                data: data
            });
            props.dispatch({
                type: "SET_PROCUREMENT_PURCHASE_REQUESTS_PAGINATION",
                data: meta.pagination
            });
        })
        .catch(res => {
            props.dispatch({
                type: "SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_LOADING",
                data: false
            });
        })
        .then(res => {})
        ;
    }, 250);
    
    const closePurchaseRequest = () => {
        props.dispatch({
            type: "SELECT_PURCHASE_REQUEST",
            data: {},
        });
    }
    return (
        <div>
{/*             <div className='mb-2'>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="">Application Center</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                    <a href="">Application Center</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                    <a href="">Application List</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
            </div> */}
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={fRow1} xl={fRow1+2}>
                    <Card size="small" title="Approved Puchase Requests" bordered={false}>
                        <div className="procurement-card-container">
                            <ApprovedPurchaseRequest getPurchaseRequests={getPurchaseRequests} />
                        </div>
                    </Card>
                </Col>
                {props.selectedPurchaseRequest && props.selectedPurchaseRequest.file ? (
                <Col xs={24} sm={24} md={24} lg={fRow2} xl={fRow2-2}>
                    <Card title="Puchase Request Details" size="small" loading={props.workspaceLoading} bordered={false} extra={(
                            <div className='text-right space-x-0.5'>
                                <Tooltip placement="top" title={fRow1 == 14 ? "Larger window" : "Normal window"}>
                                    <Button size='small' onClick={() => {
                                        if(fRow1 == 14){
                                            setfRow2(14);
                                            setfRow1(10);
                                        }else{
                                            setfRow2(10);
                                            setfRow1(14);
                                        }
                                    } }>
                                        <VerticalAlignTopOutlined rotate={fRow1 == 14 ? -90 : 90} />
                                    </Button>
                                </Tooltip>
                                <Tooltip placement="top" title={"Open in new window"}>
                                    <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                </Tooltip>
                                <Tooltip placement="top" title={"Close window"}>
                                    <Button size='small' type='danger' onClick={() => closePurchaseRequest() } disabled={props.uploadingFiles}><CloseOutlined /></Button>
                                </Tooltip>
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

