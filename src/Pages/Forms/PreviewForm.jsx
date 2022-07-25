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

    const [route, setRoute] = useState({});
    const [form, setForm] = useState({});
    const [attachments, setAttachments] = useState([]);

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
                return <InfoPurchaseRequest form={form} />;
                break;
            case 'procurement_plan':
                return <InfoProcurementPlan form={form} />;
                break;
            case 'requisition_issue':
                return <InfoRequisitionIssue form={form} />;
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
                            { !isEmpty(form) && (
                                <iframe src={`${form?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>
                            ) }
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <Card size="small" title="Routed Form Information" bordered={false}>
                        <div className='forms-card-form-content'>
                            <p>
                                <span><b>Form type:</b> <span>{route.route_type_str}</span></span><br />
                                <span><b>End User:</b> <span>{route.end_user?.name}</span></span><br />
                                <span><b>Forwarded by:</b> <span>{route.from_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${route.from_office?.name}` : route.from_office?.name }</span></span><br />
                                <span><b>Forwarded to:</b> <span>{route.to_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${route.to_office?.name}` : route.to_office?.name }</span></span><br />
                                <span><b>Remarks:</b> <span>{route.remarks}</span></span><br />
                                { route.forwarded_remarks ? <span><b>Remarks:</b> <span>{route.forwarded_remarks}</span><br /></span> : ""}
                                <span><b>Status:</b> <span>{ route.status != "pending" ? "Disapproved" : "Pending"}</span></span><br />
                                { route.status != "pending" ? <span><b>Disapproved by:</b> <span>{route.user?.user_information?.fullname}</span><br /></span> : ""}
                                <span><b>Created:</b> <span>{ route.created_at }</span></span><br />
                            </p>
                            <p className='text-center'><b>{route.route_type_str} Information</b></p>
                            { formInformation(route.route_type) }
                            <br />
                            <br />

                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <Card size="small" title="Attachments" bordered={false}>
                        <div className='forms-card-form-content'>
                            <AttachmentUpload formId={route.form_routable_id} formType={route.route_type} fileList={attachments}></AttachmentUpload>
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