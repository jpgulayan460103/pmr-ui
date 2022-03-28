import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
    notification,
    Tabs,
    Skeleton,
    Collapse,
    message,
    Upload,
    Button,
    List,
    Progress,
    Select,
    Input,
    Tooltip,
} from 'antd';
import api from '../../api';

import {
    UploadOutlined,
    DeleteOutlined,
    InboxOutlined,
    PaperClipOutlined,
} from '@ant-design/icons';


import { cloneDeep, isEmpty,  } from 'lodash';
import AuditTrail from '../../Components/AuditTrail';
import Bacform from './BacForm';
import AttachmentUpload from '../../Components/AttachmentUpload';
import Attachments from '../../Components/Attachments';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Dragger } = Upload;
const { Option } = Select;


function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurements.purchaseRequest.selectedPurchaseRequest,
        procurementTypes: state.libraries.procurement_types,
        modeOfProcurements: state.libraries.mode_of_procurements,
        tab: state.procurements.purchaseRequest.tab,
        purchaseRequests: state.procurements.purchaseRequest.purchaseRequests,
        uploadingFiles: state.user.uploadingFiles,
    };
}

const Pruchaserequestworkspace = (props) => {
    const formRef = React.useRef();
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

    const changeTab = (key) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PURCHASE_REQUEST_SET_TAB",
            data: key
        });
    }


    const saveBacForm = (value) => {
        api.PurchaseRequest.saveBacData(value)
        .then(res => {
            props.getPurchaseRequests();
        })
        ;
    }
    return (
        <div>

        <Tabs activeKey={props.tab} type="card" size="small" onChange={(key) => changeTab(key)}>
            <TabPane tab="Information" key="information">
                <p>
                    <b>PR No.:</b> {props.selectedPurchaseRequest?.purchase_request_number || ""} <br />
                    <b>PR Date:</b> {props.selectedPurchaseRequest?.pr_date || ""} <br />
                    <b>Procurement Category:</b> {props.selectedPurchaseRequest.procurement_type?.parent?.name || ""} <br />
                    <b>Procurement Type:</b> {props.selectedPurchaseRequest.procurement_type?.name || ""} <br />
                    <b>Mode of Procurement:</b> {props.selectedPurchaseRequest.mode_of_procurement?.name || ""} <br />
                    <b>End User:</b> {props.selectedPurchaseRequest?.end_user?.name || ""} <br />
                    <b>Fund Cluster:</b> {props.selectedPurchaseRequest?.fund_cluster || ""} <br />
                    <b>Responsibility Center Code:</b> {props.selectedPurchaseRequest?.center_code || ""} <br />
                    <b>Total Unit Cost:</b> {props.selectedPurchaseRequest?.total_cost_formatted || ""} <br />
                    <b>Purpose:</b> {props.selectedPurchaseRequest?.purpose || ""} <br />
                    <b>Charge To:</b> {props.selectedPurchaseRequest?.charge_to || ""} <br />
                    <b>Alloted Amount:</b> {props.selectedPurchaseRequest?.alloted_amount || ""} <br />
                    <b>UACS Code:</b> {props.selectedPurchaseRequest?.uacs_code?.name || ""} <br />
                    <b>SA/OR:</b> {props.selectedPurchaseRequest?.sa_or || ""} <br />
                </p>
            </TabPane>
            <TabPane tab="Form" key="pdf">
                    {props.selectedPurchaseRequest && props.selectedPurchaseRequest.file ? <iframe src={`${props.selectedPurchaseRequest?.file}?view=1`} style={{height: "65vh", width: "100%"}}></iframe> : ""}
            </TabPane>
            <TabPane tab="Attachments" key="uploads">
                {/* <Attachments fileList={props.selectedPurchaseRequest.form_uploads?.data} /> */}
                <AttachmentUpload formId={props.selectedPurchaseRequest.id} formType="purchase_request" fileList={props.selectedPurchaseRequest.form_uploads?.data} />
            </TabPane>

            {/* <TabPane tab="BAC Data" key="bac-task">
                <Bacform saveBacForm={saveBacForm}/>
            </TabPane> */}
            <TabPane tab="Audit Trail" key="audit-trail">
                { !isEmpty(props.selectedPurchaseRequest.audit_trail?.data) ? (
                    <AuditTrail logger={props.selectedPurchaseRequest.audit_trail?.data} tableScroll="45vh" hasChild childProp="purchase_request"  displayProp="display_log" />
                ) : <Skeleton active />  }
            </TabPane>
        </Tabs>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Pruchaserequestworkspace);

