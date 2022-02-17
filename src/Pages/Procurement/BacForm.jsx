import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
    notification,
    Tabs,
    Skeleton,
    Form,
    Input,
    Button,
    DatePicker,
} from 'antd';
import api from '../../api';
import { cloneDeep, isEmpty,  } from 'lodash';
import dayjs from 'dayjs';
import AuditTrail from '../../Components/AuditTrail';
import moment from 'moment';

function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        procurementTypes: state.library.procurement_types,
        modeOfProcurements: state.library.mode_of_procurements,
        purchaseRequestTab: state.procurement.purchaseRequestTab,
        purchaseRequests: state.procurement.purchaseRequests,
    };
}

const Bacform = (props) => {
    const [errorMessage, setErrorMessage] = useState([]);
    const [logger, setLogger] = useState([]);
    const formRef = React.useRef();
    useEffect(() => {
        formRef.current.setFieldsValue({
            preproc_conference: props.selectedPurchaseRequest.bac_task?.preproc_conference,
            post_of_ib: props.selectedPurchaseRequest.bac_task?.post_of_ib,
            prebid_conf: props.selectedPurchaseRequest.bac_task?.prebid_conf,
            eligibility_check: props.selectedPurchaseRequest.bac_task?.eligibility_check,
            open_of_bids: props.selectedPurchaseRequest.bac_task?.open_of_bids,
            bid_evaluation: props.selectedPurchaseRequest.bac_task?.bid_evaluation,
            post_qual: props.selectedPurchaseRequest.bac_task?.post_qual,
            notice_of_award: props.selectedPurchaseRequest.bac_task?.notice_of_award ? moment(props.selectedPurchaseRequest.bac_task.notice_of_award) : null,
            contract_signing: props.selectedPurchaseRequest.bac_task?.contract_signing ? moment(props.selectedPurchaseRequest.bac_task.contract_signing) : null,
            notice_to_proceed: props.selectedPurchaseRequest.bac_task?.notice_to_proceed ? moment(props.selectedPurchaseRequest.bac_task.notice_to_proceed) : null,
            estimated_ldd: props.selectedPurchaseRequest.bac_task?.estimated_ldd,
            abstract_of_qoutations: props.selectedPurchaseRequest.bac_task?.abstract_of_qoutations,
        })
        return () => {

        };
    }, [props.selectedPurchaseRequest]);

    const showErrorMessage = () => {
        if(!isEmpty(errorMessage)){
            return {
                validateStatus: 'error',
                help: errorMessage
            }
        }
    }
    const onFinish = (value) => {
        value.purchase_request_id = props.selectedPurchaseRequest.id;
        value.notice_of_award = value.notice_of_award ? moment(value.notice_of_award).format('YYYY-MM-DD') : "";
        value.contract_signing = value.contract_signing ? moment(value.contract_signing).format('YYYY-MM-DD') : "";
        value.notice_to_proceed = value.notice_to_proceed ? moment(value.notice_to_proceed).format('YYYY-MM-DD') : "";
        props.saveBacForm(value);
    }
    return (
        <div>
            <Form
                ref={formRef}
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
                layout='vertical'
            >
                <Form.Item
                    name="preproc_conference"
                    label="Pre-Proc Conference"
                    // rules={[{ required: true, message: 'Please input Pre-Proc Conference.' }]}
                    { ...showErrorMessage('preproc_conference') }
                >
                    <Input placeholder="Pre-Proc Conference" />
                </Form.Item>

                <Form.Item
                    name="post_of_ib"
                    label="Ads/Post of IB"
                    // rules={[{ required: true, message: 'Please input Ads/Post of IB.' }]}
                    { ...showErrorMessage('post_of_ib') }
                >
                    <Input placeholder="Ads/Post of IB" />
                </Form.Item>

                <Form.Item
                    name="prebid_conf"
                    label="Pre-bid Conf"
                    // rules={[{ required: true, message: 'Please input Pre-bid Conf.' }]}
                    { ...showErrorMessage('prebid_conf') }
                >
                    <Input placeholder="Pre-bid Conf" />
                </Form.Item>

                <Form.Item
                    name="eligibility_check"
                    label="Pre-bid Conf"
                    // rules={[{ required: true, message: 'Please input Pre-bid Conf.' }]}
                    { ...showErrorMessage('eligibility_check') }
                >
                    <Input placeholder="Pre-bid Conf" />
                </Form.Item>

                <Form.Item
                    name="open_of_bids"
                    label="Sub/Open of Bids"
                    // rules={[{ required: true, message: 'Please input Sub/Open of Bids.' }]}
                    { ...showErrorMessage('open_of_bids') }
                >
                    <Input placeholder="Sub/Open of Bids" />
                </Form.Item>

                <Form.Item
                    name="bid_evaluation"
                    label="Bid Evaluation"
                    // rules={[{ required: true, message: 'Please input Bid Evaluation.' }]}
                    { ...showErrorMessage('bid_evaluation') }
                >
                    <Input placeholder="Bid Evaluation" />
                </Form.Item>

                <Form.Item
                    name="post_qual"
                    label="Post Qual"
                    // rules={[{ required: true, message: 'Please input Post Qual.' }]}
                    { ...showErrorMessage('post_qual') }
                >
                    <Input placeholder="Post Qual" />
                </Form.Item>

                <Form.Item
                    name="notice_of_award"
                    label="Notice of Award"
                    // rules={[{ required: true, message: 'Please input Notice of Award.' }]}
                    { ...showErrorMessage('notice_of_award') }
                >
                    <DatePicker format={'YYYY-MM-DD'} style={{width: "100%"}}/>
                    {/* <Input placeholder="Notice of Award" /> */}
                </Form.Item>


                <Form.Item
                    name="contract_signing"
                    label="Contract Signing"
                    // rules={[{ required: true, message: 'Please input Contract Signing.' }]}
                    { ...showErrorMessage('contract_signing') }
                >
                    <DatePicker format={'YYYY-MM-DD'} style={{width: "100%"}}/>
                    {/* <Input placeholder="Contract Signing" /> */}
                </Form.Item>

                <Form.Item
                    name="notice_to_proceed"
                    label="Notice to Proceed"
                    // rules={[{ required: true, message: 'Please input Notice to Proceed.' }]}
                    { ...showErrorMessage('notice_to_proceed') }
                >
                    <DatePicker format={'YYYY-MM-DD'} style={{width: "100%"}}/>
                    {/* <Input placeholder="Notice to Proceed" /> */}
                </Form.Item>

                <Form.Item
                    name="estimated_ldd"
                    label="Estimated LDD"
                    // rules={[{ required: true, message: 'Please input Estimated LDD.' }]}
                    { ...showErrorMessage('estimated_ldd') }
                >
                    <Input placeholder="Estimated LDD" />
                </Form.Item>

                <Form.Item
                    name="abstract_of_qoutations"
                    label="Abstract of Quotations"
                    // rules={[{ required: true, message: 'Please input Abstract of Quotations.' }]}
                    { ...showErrorMessage('abstract_of_qoutations') }
                >
                    <Input placeholder="Abstract of Quotations" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Save
                    </Button>
                </Form.Item>

            </Form>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Bacform);