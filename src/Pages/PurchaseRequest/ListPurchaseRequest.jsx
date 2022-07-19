import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Skeleton, Button, Tabs, Card, Col, Row, Tooltip  } from 'antd';
import api from '../../api';
import Icon, {
    CloseOutlined,
} from '@ant-design/icons';
import { debounce, isEmpty } from 'lodash';
import AttachmentUpload from '../../Components/AttachmentUpload';
import AuditBatches from '../../Components/AuditBatches';
import FormRouting from '../../Components/FormRouting';
import InfoPurchaseRequest from './Components/InfoPurchaseRequest';
import TablePurchaseRequest from './Components/TablePurchaseRequest';
import MaximizeSvg from '../../Icons/MaximizeSvg';

const { TabPane } = Tabs;


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        selectedPurchaseRequest: state.purchaseRequests.list.selectedPurchaseRequest,
        purchaseRequests: state.purchaseRequests.list.purchaseRequests,
        paginationMeta: state.purchaseRequests.list.paginationMeta,
        loading: state.purchaseRequests.list.loading,
        timelines: state.purchaseRequests.list.timelines,
        logger: state.purchaseRequests.list.logger,
        tableFilter: state.purchaseRequests.list.tableFilter,
        defaultTableFilter: state.purchaseRequests.list.defaultTableFilter,
        tab: state.purchaseRequests.list.tab,
        user_sections: state.libraries.user_sections,
    };
}

const Listpurchaserequest = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => {
            unmounted.current = true;
            // setPurchaseRequests([]);
        }
    }, []);
    useEffect(() => {
        document.title = "List of Purchase Request";
        if(props.isInitialized){
            if(isEmpty(props.purchaseRequests)){
            }
            getPurchaseRequests();
        }
    }, [props.isInitialized]);
    
    const getPurchaseRequests = debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        setTableLoading(true);
        api.PurchaseRequest.all(filters)
        .then(res => {
            if (!unmounted.current) {
                setTableLoading(false);
                let data = res.data.data;
                let meta = res.data.meta;
                setPurchaseRequests(data);
                setPaginationMeta(meta.pagination);
            }
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {
            setTableLoading(false);
        })
        ;
    }, 200);

    const loadPurchaseRequestData = async (id) => {
        await api.PurchaseRequest.get(id)
        .then(res => {
            if (unmounted.current) { return false; }
            let item = res.data;
            let form_routes = item.form_routes.data;
            setTimelines(form_routes);
            setSelectedPurchaseRequest(item)
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const loadAuditTrail = async (id) => {
        await api.PurchaseRequest.logger(id)
        .then(res => {
            if (unmounted.current) { return false; }
            setLogger(res.data.data);
        })
        .catch(res => {})
        .then(res => {})
    }


    const setTabKey = (value) => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_TAB",
            data: value,
        });
    }

    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_LIST_LOADING",
            data: value,
        });
    }
    const setPurchaseRequests = (value) => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_LIST_PURCHASE_REQUESTS",
            data: value,
        });
    }
    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_LIST_PAGINATION_META",
            data: value,
        });
    }
    const setLogger = (value) => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_LIST_LOGGER",
            data: value,
        });
    }
    const setSelectedPurchaseRequest = (value) => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_LIST_SELECTED_PURCHASE_REQUEST",
            data: value
        });
    }

    const setTimelines = (value) => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_LIST_TIMELINES",
            data: value
        });
    }

    const setTableFilter = (data) => {
        if(data == "reset"){
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
        }else{
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_TABLE_FILTER",
                data: data,
            });
        }
        
    }



     
    const openInFull = () => {
        window.open(`${props.selectedPurchaseRequest.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }

    const openPurchaseRequest = async (item, index) => {
        setSelectedPurchaseRequest(item)
        setTimelines([]);
        setLogger([]);
        loadPurchaseRequestData(item.id);
        loadAuditTrail(item.id);
    }


    const closePurchaseRequest = () => {
        setSelectedPurchaseRequest({});
    }

    const tableProps = {
        getPurchaseRequests: getPurchaseRequests,
        openPurchaseRequest: openPurchaseRequest,
        setTableFilter: setTableFilter,
        setSelectedPurchaseRequest: setSelectedPurchaseRequest,
        tableFilter: props.tableFilter,
        purchaseRequests: props.purchaseRequests,
        paginationMeta: props.paginationMeta,
        loading: props.loading,
        defaultTableFilter: props.defaultTableFilter,
    };

    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Created Puchase Requests" bordered={false}>
                        <div className='purchase-request-card-content'>
                            <TablePurchaseRequest {...tableProps} />
                        </div>
                    </Card>
                </Col>
                { isEmpty(props.selectedPurchaseRequest.file) ? "" : ( 
                    <Col md={24} lg={10} xl={8}>
                            <Card size="small" bordered={false} title="Puchase Request Details" extra={(
                                <div className='text-right space-x-0.5'>
                                    <Tooltip placement="top" title={"Open in new window"}>
                                        <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                    </Tooltip>
                                    <Tooltip placement="top" title={"Close window"}>
                                        <Button size='small' type='danger' onClick={() => closePurchaseRequest() }><CloseOutlined /></Button>
                                    </Tooltip>
                                </div>
                            )}
                            >
                                <div className='purchase-request-card-content'>
                                    <Tabs activeKey={props.tab} type="card" size="small" onChange={setTabKey}>
                                        <TabPane tab="Information" key="information">
                                            <InfoPurchaseRequest form={props.selectedPurchaseRequest} />
                                        </TabPane>
                                        <TabPane tab="Routing" key="routing">
                                            { !isEmpty(props.timelines) ? (
                                                <FormRouting timelines={props.timelines} />
                                            ) : <Skeleton active />  }
                                        </TabPane>
                                        <TabPane tab="Audit Trail" key="audit-trail" style={{padding: "5px", paddingBottom: "50px"}}>
                                            { !isEmpty(props.logger) ? (
                                                <AuditBatches logger={props.logger} />
                                            ) : <Skeleton active /> }
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Card>
                    </Col>
                    )
                }
            </Row>
            { isEmpty(props.selectedPurchaseRequest) ? "" : (
            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Purchase Request Form" bordered={false} loading={props.formLoading}>
                        <div className='forms-card-form-content'>
                            <iframe src={`${props.selectedPurchaseRequest.file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                        </div>
                    </Card>
                </Col>
                <Col md={24} lg={10} xl={8}>
                        <Card size="small" title="Attachments" bordered={false} loading={props.formLoading}>
                            <div className='forms-card-form-content'>
                            <AttachmentUpload formId={props.selectedPurchaseRequest.id} formType="purchase_request" fileList={props.selectedPurchaseRequest.form_uploads?.data} />
                            </div>
                        </Card>
                    </Col>
            </Row>
            ) }
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Listpurchaserequest);
