import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
    notification,
    Tabs,
    Skeleton,
} from 'antd';
import api from '../../api';
import { cloneDeep, isEmpty,  } from 'lodash';
import dayjs from 'dayjs';
import AuditTrail from '../../Components/AuditTrail';

const { TabPane } = Tabs;


function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        procurementTypes: state.library.procurement_types,
        modeOfProcurements: state.library.mode_of_procurements,
        purchaseRequestTab: state.procurement.purchaseRequestTab,
        purchaseRequests: state.procurement.purchaseRequests,
    };
}

const Pruchaserequestworkspace = (props) => {
    const formRef = React.useRef();
    useEffect(() => {
        // if(props.purchaseRequestTab == "edit-form"){
        //     setFormData()
        // }
        if(props.purchaseRequestTab == "audit-trail"){
            loadAuditTrail()
        }
    }, [props.purchaseRequestTab || props.selectedPurchaseRequest]);
    const [errorMessage, setErrorMessage] = useState([]);
    const [logger, setLogger] = useState([]);
    const showErrorMessage = () => {
        if(!isEmpty(errorMessage)){
            return {
                validateStatus: 'error',
                help: errorMessage
            }
        }
    }
    const setFormData = () => {
        setTimeout(() => {
            formRef.current.setFieldsValue({
                purchase_request_number: props.selectedPurchaseRequest.purchase_request_number,
                purchase_request_type_id: props.selectedPurchaseRequest.purchase_request_type_id,
                mode_of_procurement_id: props.selectedPurchaseRequest.mode_of_procurement_id,
                fund_cluster: props.selectedPurchaseRequest.fund_cluster,
                center_code: props.selectedPurchaseRequest.center_code,
            })
        }, 150);
    }
    const loadAuditTrail = () => {
        setLogger([]);
        api.PurchaseRequest.logger(props.selectedPurchaseRequest.id)
        .then(res => {
            setLogger(res.data.data);
        })
        .catch(res => {})
        .then(res => {})
    }
    
    const onFinish = (values) => {
        let formData = {
            ...values,
            id: props.selectedPurchaseRequest.id
        };
        api.PurchaseRequest.save(formData, 'update')
        .then(res => {
            let resData = res.data;
            let clonedPrs = cloneDeep(props.purchaseRequests);
            let index = clonedPrs.findIndex(i => i.id == props.selectedPurchaseRequest.id);
            clonedPrs[index] = {
                ...clonedPrs[index],
                ...resData
            }
            props.dispatch({
                type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS",
                data: clonedPrs
            });
            notification['success']({
                message: `Successfully Saved.`,
                description: `Purchase Request # ${formData.purchase_request_number} has been updated.`,
            });
            if(props.purchaseRequestTab == 'audit-trail'){
                loadAuditTrail();
            }
        })
        .catch(err => {
            
        })
        .then(res => {})
        ;
    };

    const changeTab = (key) => {
        props.dispatch({
            type: "SET_PROCUREMENT_SET_PURCHASE_REQUEST_TAB",
            data: key
        });
    }

    const columns = [
        {
          title: 'Field',
          dataIndex: 'label',
          key: 'label',
        },
        {
          title: 'Old',
          dataIndex: 'old',
          key: 'old',
        },
        {
          title: 'New',
          dataIndex: 'new',
          key: 'new',
        },
      ];
    return (
        <div>

        <Tabs activeKey={props.purchaseRequestTab} type="card" size="small" onChange={(key) => changeTab(key)}>
            <TabPane tab="File" key="pdf">
                <div style={{height: "55vh", minHeight: "55vh", maxHeight: "550px"}}>
                    {props.selectedPurchaseRequest && props.selectedPurchaseRequest.file ? <iframe src={`${props.selectedPurchaseRequest?.file}?view=1`} width="100%" height="95%"></iframe> : ""}
                </div>
            </TabPane>
            {/* <TabPane tab="Edit Form" key="edit-form">
                <Form
                    ref={formRef}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true, username: "ict", password: "admin123" }}
                    onFinish={onFinish}
                    layout='vertical'
                >
                    <Form.Item
                        name="purchase_request_number"
                        label="Purchase Request Number"
                        // rules={[{ required: true, message: 'Please input Purchase Request Number.' }]}
                        { ...showErrorMessage() }
                    >
                        <Input placeholder="Purchase Request Number" />
                    </Form.Item>

                    <Form.Item
                        name="fund_cluster"
                        label="Fund Cluster"
                        // rules={[{ required: true, message: 'Please input Fund Cluster.' }]}
                        { ...showErrorMessage() }
                    >
                        <Input placeholder="Fund Cluster" />
                    </Form.Item>

                    <Form.Item
                        name="center_code"
                        label="Responsibility Center Code"
                        // rules={[{ required: true, message: 'Please input Responsibility Center Code.' }]}
                        { ...showErrorMessage() }
                    >
                        <Input placeholder="Responsibility Center Code" />
                    </Form.Item>

                </Form>
            </TabPane> */}
            <TabPane tab="BAC Task" key="bac-task">
                BAC FORMS
            </TabPane>
            <TabPane tab="Audit Trail" key="audit-trail">
                { !isEmpty(logger) ? (
                    <AuditTrail logger={logger} timelineCss={{height: "50vh", minHeight: "50vh", maxHeight: "500px"}} tableScroll="45vh" displayProp="purchase_request_number" />
                ) : <Skeleton active />  }
            </TabPane>
        </Tabs>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Pruchaserequestworkspace);

