import { Button, Card, Col, Row, Tooltip } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";
import api from '../../api';
import AttachmentUpload from '../../Components/AttachmentUpload';
import InfoProcurementPlan from '../ProcurementPlan/Components/InfoProcurementPlan';
import InfoPurchaseRequest from '../PurchaseRequest/Components/InfoPurchaseRequest';
import InfoRequisitionIssue from '../RequisitionIssue/Components/InfoRequisitionIssue';
import Icon, { CloseOutlined, FileZipFilled, BankOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';


function mapStateToProps(state) {
    return {
        user: state.user.data,
        isInitialized: state.user.isInitialized,
        form: state.forms.preview.form,
        route: state.forms.preview.route,
        attachments: state.forms.preview.attachments,
    };
}

function PreviewForm(props) {
    let { uuid } = useParams();
    const unmounted = React.useRef(false);
    useEffect(() => {
        getRoute();
        return () => {
            unmounted.current = true;
        }
    }, [uuid]);

    // const [props.route, setRoute] = useState({});
    // const [form, setForm] = useState({});
    // const [props.attachments, setAttachments] = useState([]);

    const setRoute = (data) => {
        props.dispatch({
            type: "SET_FORM_PREVIEW_ROUTE",
            data
        });
    }
    const setForm = (data) => {
        props.dispatch({
            type: "SET_FORM_PREVIEW_FORM",
            data
        });
    }
    const setAttachments = (data) => {
        props.dispatch({
            type: "SET_FORM_PREVIEW_ATTACHMENTS",
            data
        });
    }

    const getRoute = debounce(() => {
        setRoute({});
        setForm({});
        setAttachments([]);
        api.Forms.get(uuid)
        .then(res => {
            // if (unmounted.current) { return false; }
            setRoute(res.data);
            loadForm(res.data.route_type, res.data.form_routable_id);
        })
        .catch(res => {})
        .then(res => {})
        ;
    }, 250)

    const loadProcurementPlanData = async (id) => {
        await api.ProcurementPlan.get(id)
        .then(res => {
            // if (unmounted.current) { return false; }
            setForm(res.data);
            setAttachments(res.data.form_uploads.data);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const loadPurchaseRequestData = async (id) => {
        await api.PurchaseRequest.get(id)
        .then(res => {
            // if (unmounted.current) { return false; }
            setForm(res.data);
            setAttachments(res.data.form_uploads.data);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const loadRequisitionIssueData = async (id) => {
        await api.RequisitionIssue.get(id)
        .then(res => {
            // if (unmounted.current) { return false; }
            setForm(res.data);
            setAttachments(res.data.form_uploads.data);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const loadForm = (type, id) => {
        switch (type) {
            case 'purchase_request':
                return loadPurchaseRequestData(id);
                break;
            case 'procurement_plan':
                return loadProcurementPlanData(id)
                break;
            case 'requisition_issue':
                return loadRequisitionIssueData(id);
                break;
        
            default:
                break;
        }
    }

    const formInformation = (type) => {
        switch (type) {
            case 'purchase_request':
                return <InfoPurchaseRequest form={props.form} />;
                break;
            case 'procurement_plan':
                return <InfoProcurementPlan form={props.form} />;
                break;
            case 'requisition_issue':
                return <InfoRequisitionIssue form={props.form} />;
                break;
        
            default:
                break;
        }
    }
    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Card size="small" title="Routed Form" bordered={false}>
                        <div className='forms-card-form-content'>
                            { !isEmpty(props.form) && (
                                <iframe src={`${props.form?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>
                            ) }
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <Card size="small" title="Routed Form Information" bordered={false}>
                        <div className='forms-card-form-content'>
                            <p>
                                <span><b>Form type:</b> <span>{props.route?.route_type_str}</span></span><br />
                                <span><b>End User:</b> <span>{props.route?.end_user?.name}</span></span><br />
                                <span><b>Forwarded by:</b> <span>{props.route?.from_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.route?.from_office?.name}` : props.route?.from_office?.name }</span></span><br />
                                <span><b>Forwarded to:</b> <span>{props.route?.to_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.route?.to_office?.name}` : props.route?.to_office?.name }</span></span><br />
                                <span><b>Remarks:</b> <span>{props.route?.remarks}</span></span><br />
                                { props.route?.forwarded_remarks ? <span><b>Remarks:</b> <span>{props.route?.forwarded_remarks}</span><br /></span> : ""}
                                <span><b>Status:</b> <span>{ props.route?.status != "pending" ? "Disapproved" : "Pending"}</span></span><br />
                                { props.route?.status != "pending" ? <span><b>Disapproved by:</b> <span>{props.route?.user?.user_information?.fullname}</span><br /></span> : ""}
                                <span><b>Created:</b> <span>{ props.route?.created_at }</span></span><br />
                            </p>
                            <p className='text-center'><b>{props.route?.route_type_str} Information</b></p>
                            { formInformation(props.route?.route_type) }
                            <br />
                            <br />

                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <Card size="small" title="Attachments" bordered={false}>
                        <div className='forms-card-form-content'>
                            <AttachmentUpload formId={props.route?.form_routable_id} formType={props.route?.route_type} fileList={props.attachments}></AttachmentUpload>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(PreviewForm);