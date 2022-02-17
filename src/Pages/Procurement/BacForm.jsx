import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
    notification,
    Tabs,
    Skeleton,
    Form,
    Input,
    Button,
} from 'antd';
import api from '../../api';
import { cloneDeep, isEmpty,  } from 'lodash';
import dayjs from 'dayjs';
import AuditTrail from '../../Components/AuditTrail';

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
        console.log(value);
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
                    <Input placeholder="Notice of Award" />
                </Form.Item>


                <Form.Item
                    name="contract_signing"
                    label="Contract Signing"
                    // rules={[{ required: true, message: 'Please input Contract Signing.' }]}
                    { ...showErrorMessage('contract_signing') }
                >
                    <Input placeholder="Contract Signing" />
                </Form.Item>

                <Form.Item
                    name="notice_to_proceed"
                    label="Notice to Proceed"
                    // rules={[{ required: true, message: 'Please input Notice to Proceed.' }]}
                    { ...showErrorMessage('notice_to_proceed') }
                >
                    <Input placeholder="Notice to Proceed" />
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

export default Bacform;
