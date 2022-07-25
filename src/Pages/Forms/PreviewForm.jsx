import { Button, Card, Col, notification, Row, Tooltip } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory  } from 'react-router-dom'
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
import ModalProcurementForm from './Components/ModalProcurementForm';
import ModalBudgetForm from './Components/ModalBudgetForm';
import ModalDisapproveForm from './Components/ModalDisapproveForm';
import ModalResolveForm from './Components/ModalResolveForm';


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
    let history = useHistory();
    const unmounted = React.useRef(false);

    const [modalRejectForm, setModalRejectForm] = useState(false);
    const [modalResolveForm, setModalResolveForm] = useState(false);
    const [modalBudgetForm, setModalBudgetForm] = useState(false);
    const [modalProcurementForm, setModalProcurementForm] = useState(false);
    const [archiveModal, setArchiveModal] = useState(false);
    const [formLoaded, setFormLoaded] = useState(false);


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
        setFormLoaded(false);
        api.Forms.get(uuid)
        .then(res => {
            // if (unmounted.current) { return false; }
            setRoute(res.data);
            setFormLoaded(true);
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

    const [budgetFormData, setBudgetFormData] = useState({});

    const showBudgetForm = (item) => {
        setModalBudgetForm(true);
        api.PurchaseRequest.getNextNumber()
        .then(res => {
            if (unmounted.current) { return false; }
            setBudgetFormData({
                pr_number_last: res.data.next_number,
                alloted_amount: item.form_routable.common_amount,
            });
        })
        .catch(res => {})
        .then(res => {})
    }
    


    const resolveForm = (item, index) => {
        showResolveForm(item);
    }

    const confirm = debounce(async (item) => {
        switch (item.route_code) {
            case 'pr_select_action':
                setModalProcurementForm(true);
                break;
            case 'pr_approval_from_proc':
                setModalProcurementForm(true);
                setProcurementFormType("approve");
                break;
            case 'pr_approval_from_budget':
                showBudgetForm(item);
                break;
        
            default:
                setSubmit(true);
                await approve(item);
                setSubmit(false);
                break;
        }
    }, 150);


    const approve = async (item, formData = {}) => {
        return api.Forms.approve(item.id, formData)
        .then(res => {
            if (unmounted.current) { return false; }
            let alertMessage = res.data.alert_message;
            notification.success({
                message: `${alertMessage.message} ${alertMessage.status}`,
                description: alertMessage.action_taken,
            });
            getRoute();
            // getForm();
            // setSelectedFormRoute({});
            // setSelectedForm({});
            return Promise.resolve(res)
        })
        .catch(err => {
            setSubmit(false);
            return Promise.reject(err)
        })
        .then(res => {})
        ;
    };

    const issueRis = (item) => {
        api.RequisitionIssue.get(item.form_routable.id)
        .then(res => {
            let ris = res.data;
            ris.items = ris.items.data;
            ris.issued_items = [];
            ris.form_route_id = item.id;
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_CREATE_FORM_TYPE",
                data: "issue"
            });

            props.dispatch({
                type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
                data: ris
            });

            history.push("/requisition-and-issues/form");
        })
        .catch(err => {})
        .then(res => {})
    }

    const [errorMessage, setErrorMessage] = useState({});
    const [submit, setSubmit] = useState(false);
    const [procurementFormType, setProcurementFormType] = useState("");
    const [selectedAccountClassification, setSelectedAccountClassification] = useState("");
    const [addOn, setAddOn] = useState("");
    const [rejectFormData, setRejectFormData] = useState({});
    const [routeOptions, setRouteOptions] = useState([]);



    const showRejectForm = (item) => {
        // setSelectedFormRoute(item)
        setModalRejectForm(true);
        let options = item.form_process.form_routes.filter(i => i.status == "approve" || i.status == "approved");
        setRouteOptions(options);
        setRejectFormData({
            to_office_id: item.origin_office_id,
        });
        return false;
    }

    const showResolveForm = (formRouteItem) => {
        // setSelectedFormRoute(formRouteItem)
        setModalResolveForm(true);
        return false;
    }


    const disapprovedFormProps = {
        showModal: modalRejectForm,
        formData: rejectFormData,
        setShowModal: setModalRejectForm,
        setSubmit,
        setErrorMessage,
        setSelectedFormRoute: () => {},
        setSelectedForm: () => {},
        submit,
        routeOptions,
        selectedFormRoute: props.route,
        getForm: () => {
            getRoute();
        },
    };

    const resolveFormProps = {
        showModal: modalResolveForm,
        setShowModal: setModalResolveForm,
        setSubmit,
        setErrorMessage,
        setSelectedFormRoute: () => {},
        setSelectedForm: () => {},
        submit: submit,
        selectedFormRoute: props.route,
        getForm: () => {
            getRoute();
        },
    };


    const budgetFormProps = {
        formData: budgetFormData,
        showModal: modalBudgetForm,
        setModalBudgetForm,
        setSelectedFormRoute: () => {},
        setSelectedForm: () => {},
        setErrorMessage,
        selectedFormRoute: props.route,
        submit,
        setSubmit,
        approve,
        setAddOn,
        addOn,
        errorMessage,
    };


    const procurementFormProps = {
        showModal: modalProcurementForm,
        setShowModal: setModalProcurementForm,
        setErrorMessage,
        setSubmit,
        selectedFormRoute: props.route,
        setSelectedFormRoute: () => {},
        setSelectedForm: () => {},
        approve,
        setProcurementFormType,
        procurementFormType,
        setSelectedAccountClassification,
        selectedAccountClassification,
    };


    return (
        <div>
            <ModalDisapproveForm {...disapprovedFormProps} />
            <ModalResolveForm {...resolveFormProps} />
            <ModalBudgetForm {...budgetFormProps} />
            <ModalProcurementForm {...procurementFormProps} />
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Card size="small" title="Routed Form" bordered={false}>
                        <div className='forms-card-form-content'>
                            { !isEmpty(props.form) && (
                                <React.Fragment>
                                    <iframe src={`${props.form?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>
                                </React.Fragment>
                            ) }
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <Card size="small" title="Routed Form Information" bordered={false}>
                        <div className='forms-card-form-content'>
                                {
                                    props.route?.action_taken && formLoaded ? "" : (
                                        <div className='text-right flex space-x-0.5'>
                                            <div className='space-x-0.5 mr-2'>
                                                { props.route?.status == "with_issues" ? (
                                                        <Button size='small' type='default' onClick={() => { resolveForm(props.route, 0) }}  disabled={submit}><SendOutlined /> Resolve</Button>
                                                ) : (
                                                    <>
                                                        {props.route?.route_code == "last_route" && props.route?.route_type == "requisition_issue" ? (
                                                                <Button size='small' type='default' icon={<BankOutlined twoToneColor="#0000FF" />} onClick={() => { issueRis(props.route) }} disabled={submit}>
                                                                    Issue supplies and properties
                                                                </Button>
                                                        ) : (
                                                            <React.Fragment>

                                                                <Button size='small' type='default' icon={<LikeTwoTone twoToneColor="#0000FF" />} onClick={() => { confirm(props.route, 0) }} disabled={submit}>
                                                                    Approve
                                                                </Button>

                                                            </React.Fragment>
                                                        )}
                                                        {/* 
                                                            { props.route?.from_office_id == props.route?.to_office_id ? "" : (
                                                        */}
                                                        { props.route?.route_code == "route_origin" ? "" : (
                                                                <Button size='small' type='default' icon={<DislikeTwoTone twoToneColor="#FF0000" />} onClick={() => { showRejectForm(props.route, 0) }}>
                                                                    Disapprove
                                                                </Button>
                                                        ) }
                                                    </>
                                                ) }
                                            </div>
                                        </div>
                                    )
                                }
                                <br />
                            <p>
                                <span><b>Form type:</b> <span>{props.route?.route_type_str}</span></span><br />
                                <span><b>End User:</b> <span>{props.route?.end_user?.name}</span></span><br />
                                <span><b>Forwarded by:</b> <span>{props.route?.from_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.route?.from_office?.name}` : props.route?.from_office?.name }</span></span><br />
                                <span><b>Forwarded to:</b> <span>{props.route?.to_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.route?.to_office?.name}` : props.route?.to_office?.name }</span></span><br />
                                <span><b>Remarks:</b> <span>{props.route?.remarks}</span></span><br />
                                { props.route?.forwarded_remarks ? <span><b>Remarks:</b> <span>{props.route?.forwarded_remarks}</span><br /></span> : ""}
                                <span><b>Status:</b> <span>{ props.route?.status?.toUpperCase() }</span></span><br />
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