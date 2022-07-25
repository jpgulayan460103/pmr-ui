import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory  } from 'react-router-dom'
import { Table, Button, Tooltip, notification, Card, Col, Row } from 'antd';
import Icon, { CloseOutlined, FileZipFilled, BankOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import _, { cloneDeep, debounce, isEmpty } from 'lodash';
import api from '../../api';
import filter from '../../Utilities/filter';
import AttachmentUpload from '../../Components/AttachmentUpload';
import TableFooterPagination from '../../Components/TableFooterPagination';
import TableRefresh from '../../Components/TableRefresh';
import TableResetFilter from '../../Components/TableResetFilter';
import MaximizeSvg from '../../Icons/MaximizeSvg';
import InfoPurchaseRequest from '../PurchaseRequest/Components/InfoPurchaseRequest';
import InfoProcurementPlan from '../ProcurementPlan/Components/InfoProcurementPlan';
import InfoRequisitionIssue from '../RequisitionIssue/Components/InfoRequisitionIssue';
import ArchiveForm from '../../Components/ArchiveForm';
import { onMessageListener } from '../../firebase';
import ModalDisapproveForm from './Components/ModalDisapproveForm';
import ModalResolveForm from './Components/ModalResolveForm';
import ModalBudgetForm from './Components/ModalBudgetForm';
import ModalProcurementForm from './Components/ModalProcurementForm';


function mapStateToProps(state) {
    return {
        user: state.user.data,
        accounts: state.libraries.accounts,
        uacsCodes: state.libraries.uacs_codes,
        accountClassifications: state.libraries.account_classifications,
        modeOfProcurements: state.libraries.mode_of_procurements,
        technicalWorkingGroups: state.libraries.technical_working_groups,
        userSections: state.libraries.user_sections,
        isInitialized: state.user.isInitialized,
        forms: state.forms.pendingForm.forms,
        pagination: state.forms.pendingForm.pagination,
        selectedFormRoute: state.forms.pendingForm.selectedFormRoute,
        selectedForm: state.forms.pendingForm.selectedForm,
        routeOptions: state.forms.pendingForm.routeOptions,
        procurementFormType: state.forms.pendingForm.procurementFormType,
        addOn: state.forms.pendingForm.addOn,
        errorMessage: state.forms.pendingForm.errorMessage,
        tableLoading: state.forms.pendingForm.tableLoading,
        selectedAccountClassification: state.forms.pendingForm.selectedAccountClassification,
        submit: state.forms.pendingForm.submit,
        attachments: state.forms.pendingForm.attachments,
        formLoading: state.forms.pendingForm.formLoading,
        tableFilter: state.forms.pendingForm.tableFilter,
        defaultTableFilter: state.forms.pendingForm.defaultTableFilter,
    };
}



let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}

const PendingForm = (props) => {
    const unmounted = React.useRef(false);
    let history = useHistory();
    useEffect(() => {
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
        return () => {
            unmounted.current = true;
            document.removeEventListener(visibilityChange, handleVisibilityChange);
            // setForms([]);
            // setPaginationMeta({});
            // setSelectedFormRoute({});
            // setRouteOptions([]);
            // setProcurementFormType("");
            // setAddOn(`BUDRP-PR-${dayjs().format("YYYY-MM-")}`);
            // setErrorMessage({});
            // setTableLoading(false);
            // setSelectedAccountClassification(null);
            // setSubmit(false);
            // setAttachments([]);
            // setFormLoading(false);
        }
    }, []);

    const handleVisibilityChange = () => {
        if (document[hidden]) {
        } else {
            debouncedGetForm();
        }
      }

    
    useEffect(() => {
        document.title = "Pending Forms";
        if(props.isInitialized){
            if(isEmpty(props.forms)){
            }
            getForm();
        }
        // console.log("rerender");
    }, [props.isInitialized]);
    // const [tableFilter, setTableFilter] = useState(defaultTableFilter);
    const [modalRejectForm, setModalRejectForm] = useState(false);
    const [modalResolveForm, setModalResolveForm] = useState(false);
    const [modalBudgetForm, setModalBudgetForm] = useState(false);
    const [modalProcurementForm, setModalProcurementForm] = useState(false);
    const [archiveModal, setArchiveModal] = useState(false);

    const setTableFilter = (data) => {
        console.log(data);
        if(data == "reset"){
            props.dispatch({
                type: "SET_FORM_PENDING_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
            getForm(props.defaultTableFilter);
        }else{
            props.dispatch({
                type: "SET_FORM_PENDING_TABLE_FILTER",
                data: data,
            });
        }
    }

    const setForms = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_FORMS",
            data: value,
        });
    }
    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_PAGINATION_META",
            data: value,
        });
    }
    const setSelectedFormRoute = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_SELECTED_FORM_ROUTE",
            data: value,
        });
    }
    const setSelectedForm = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_SELECTED_FORM",
            data: value,
        });
    }
    const setRouteOptions = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_ROUTE_OPTIONS",
            data: value,
        });
    }
    const setProcurementFormType = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_PROCUREMENT_FORM_TYPE",
            data: value,
        });
    }
    const setAddOn = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_ADD_ON",
            data: value,
        });
    }
    const setErrorMessage = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_ERROR_MESSAGE",
            data: value,
        });
    }
    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_TABLE_LOADING",
            data: value,
        });
    }
    const setSelectedAccountClassification = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_SELECTED_PROCUREMENT_CATEGORY",
            data: value,
        });
    }
    const setSubmit = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_SUBMIT",
            data: value,
        });
    }
    const setAttachments = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_ATTACHMENTS",
            data: value,
        });
    }
    const setFormLoading = (value) => {
        props.dispatch({
            type: "SET_FORM_PENDING_FORM_LOADING",
            data: value,
        });
    }

    const [rejectFormData, setRejectFormData] = useState({});

    const showRejectForm = (item) => {
        setSelectedFormRoute(item)
        setModalRejectForm(true);
        let options = item.form_process.form_routes.filter(i => i.status == "approve" || i.status == "approved");
        setRouteOptions(options);
        setRejectFormData({
            to_office_id: item.origin_office_id,
        });
        return false;
    }

    const showResolveForm = (formRouteItem) => {
        setSelectedFormRoute(formRouteItem)
        setModalResolveForm(true);
        return false;
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
    
    
    

    const getForm = debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        setTableLoading(true);
        api.Forms.getForApproval(filters)
        .then(res => {
            if (unmounted.current) { return false; }
            setTableLoading(false);
            let data = res.data.data;
            let meta = res.data.meta;
            setForms(data);
            setPaginationMeta(meta.pagination);
            
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {
            setTableLoading(false);
        })
        ;
    }, 250);
    const getFormNoLoading = debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        api.Forms.getForApproval(filters)
        .then(res => {
            if (unmounted.current) { return false; }
            let data = res.data.data;
            let meta = res.data.meta;
            setForms(data);
            setPaginationMeta(meta.pagination);
            
        })
        .catch(res => {
        })
        .then(res => {})
        ;
    }, 250);
    var debouncedGetForm = React.useCallback(debounce(getFormNoLoading, 400), []);

    onMessageListener().then(payload => {
        debouncedGetForm();
        console.log(payload);
    }).catch(err => console.log('failed: ', err));
    
    const openInFull = () => {
        window.open(`${props.selectedFormRoute.form_routable?.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }

    const viewForm = (item, index) => {
        setSelectedFormRoute(item);
        switch (item.route_type) {
            case "purchase_request":
                viewPurchaseRequest(item.form_routable_id);
                break;
            case "procurement_plan":
                viewProcurementPlan(item.form_routable_id);
                break;
            case "requisition_issue":
                viewRequisitionIssue(item.form_routable_id);
                break;
        
            default:
                break;
        }
    }
    const resolveForm = (item, index) => {
        setSelectedFormRoute(item);
        showResolveForm(item);
    }

    const showArchiveForm = (item, index) => {
        setSelectedFormRoute(item);
        viewForm(item, 0);
        setArchiveModal(true);
        // showResolveForm(item);
    }
    const closeForm = () => {
        setSelectedFormRoute({});
    }
    

    const confirm = debounce(async (item) => {
        setSelectedFormRoute(item);
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
            getForm();
            setSelectedFormRoute({});
            setSelectedForm({});
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

    const viewPurchaseRequest = (id) => {
        setFormLoading(true);
        api.PurchaseRequest.get(id)
        .then(res => {
            if (unmounted.current) { return false; }
            setAttachments(res.data.form_uploads.data)
            setFormLoading(false);
            setSelectedForm(res.data);
        })
        .catch(err => {
            setFormLoading(false);
        })
        .then(res => {
            setFormLoading(false);
        })
        ;
    }
    const viewProcurementPlan = (id) => {
        setFormLoading(true);
        api.ProcurementPlan.get(id)
        .then(res => {
            if (unmounted.current) { return false; }
            setAttachments(res.data.form_uploads.data)
            setFormLoading(false);
            setSelectedForm(res.data);
        })
        .catch(err => {
            setFormLoading(false);
        })
        .then(res => {
            setFormLoading(false);
        })
        ;
    }
    const viewRequisitionIssue = (id) => {
        setFormLoading(true);
        api.RequisitionIssue.get(id)
        .then(res => {
            if (unmounted.current) { return false; }
            setAttachments(res.data.form_uploads.data)
            setFormLoading(false);
            setSelectedForm(res.data);
        })
        .catch(err => {
            setFormLoading(false);
        })
        .then(res => {
            setFormLoading(false);
        })
        ;
    }

    const endUserFilter = cloneDeep(props.userSections).map(i => {
        i.value = i.id;
        return i;
    });

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    viewForm(record, colIndex);
                },
            };
          }
    }

    const dataSource = props.forms
      
    const columns = [
        {
            title: 'Form Type',
            dataIndex: 'route_type_str',
            key: 'route_type_str',
            width: 200,
            ...onCell,
            ellipsis: true,
        },
        {
            title: 'Forwarded on',
            key: 'created_at',
            width: 150,
            ...filter.search('created_at','date_range', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
            render: (text, item, index) => (
                <span>
                    { item.created_at_date }
                </span>
            ),
        },
        {
            title: 'End User',
            key: 'end_user',
            width: 250,
            filters: endUserFilter,
            ...filter.list('end_user_id','text', setTableFilter, props.tableFilter, getForm),
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            ),
            ...onCell,
            ellipsis: true,
        },
        {
            title: 'Description',
            key: 'remarks',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <span>{item.remarks }</span>
                </span>
            ),
            ...filter.search('remarks','text', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
        },
        {
            title: 'Status',
            key: 'status',
            width: 120,
            render: (text, item, index) => (
                <span>
                    { item.status != "pending" ? (
                        <span> Disapproved</span>
                    ) : (
                        <span>Pending</span>
                    ) }
                </span>
            ),
            filters: [{text: "Pending", value: "pending"},{text: "Disapproved", value: "disapproved"}],
            ...filter.list('status','text', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
        },
        {
            title: 'Remarks',
            key: 'forwarded_remarks',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <span>{ item.forwarded_remarks }</span>
                </span>
            ),
            ...filter.search('forwarded_remarks','text', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
        },

        {
            title: "Actions",
            key: "action",
            fixed: 'right',
            width: 100,
            align: "center",
            render: (text, item, index) => (
                <div className='space-x-0.5'>
                    { item.status == "with_issues" ? (
                        <React.Fragment>

                            <Tooltip placement="bottom" title={"Resolve"}>
                                <Button size='small' type='default' icon={<SendOutlined twoToneColor="#0000FF" />} onClick={() => { resolveForm(item, index) }}>
                    
                                </Button>
                            </Tooltip>
                        </React.Fragment>
                    ) : (
                        <>
                            {item.route_code == "last_route" && item.route_type == "requisition_issue" ? (
                                <Tooltip placement="bottom" title={"Issue supplies and properties"}>
                                    <Button size='small' type='default' icon={<BankOutlined twoToneColor="#0000FF" />} onClick={() => { issueRis(item) }} disabled={props.submit}>
                        
                                    </Button>
                                </Tooltip>
                            ) : (
                                <React.Fragment>

                                <Tooltip placement="bottom" title={"Approve"}>
                                    <Button size='small' type='default' icon={<LikeTwoTone twoToneColor="#0000FF" />} onClick={() => { confirm(item, index) }} disabled={props.submit}>
                                    
                                    </Button>
                                </Tooltip>

                                </React.Fragment>
                            )}
                            {/* 
                                { item.from_office_id == item.to_office_id ? "" : (
                            */}
                            { item.route_code == "route_origin" ? (
                                <Tooltip placement="bottom" title={"Archive"}>
                                    <Button size='small' type='danger' icon={<FileZipFilled />}  onClick={() => { showArchiveForm(item, index) }}>
        
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip placement="bottom" title={"Disapprove"}>
                                    <Button size='small' type='default' icon={<DislikeTwoTone twoToneColor="#FF0000" />} onClick={() => { showRejectForm(item, index) }}>
                    
                                    </Button>
                                </Tooltip>
                            ) }
                        </>
                    ) }
                </div>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        let clonedFilter = cloneDeep(props.tableFilter);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            setTableFilter({...clonedFilter, sortColumn: filters.sortColumn, sortOrder: filters.sortOrder});
        }
        getForm({...props.tableFilter, ...filters})
    };

    const paginationChange = async (e) => {
        // console.log(e);
        let clonedFilter = cloneDeep(props.tableFilter);
        setTableFilter({...clonedFilter, page: e});
        getForm({...props.tableFilter, page: e})
    }

    const formInformation = (type) => {
        switch (type) {
            case 'purchase_request':
                return <InfoPurchaseRequest form={props.selectedForm} />;
                break;
            case 'procurement_plan':
                return <InfoProcurementPlan form={props.selectedForm} />;
                break;
            case 'requisition_issue':
                return <InfoRequisitionIssue form={props.selectedForm} />;
                break;
        
            default:
                break;
        }
    }

    const disapprovedFormProps = {
        showModal: modalRejectForm,
        formData: rejectFormData,
        setShowModal: setModalRejectForm,
        setSubmit,
        setErrorMessage,
        setSelectedFormRoute,
        setSelectedForm,
        submit: props.submit,
        routeOptions: props.routeOptions,
        selectedFormRoute: props.selectedFormRoute,
        getForm,
    };

    const resolveFormProps = {
        showModal: modalResolveForm,
        setShowModal: setModalResolveForm,
        setSubmit,
        setErrorMessage,
        setSelectedFormRoute,
        setSelectedForm,
        submit: props.submit,
        selectedFormRoute: props.selectedFormRoute,
        getForm,
    };

    const budgetFormProps = {
        formData: budgetFormData,
        showModal: modalBudgetForm,
        setModalBudgetForm,
        setSelectedFormRoute,
        setSelectedForm,
        setErrorMessage,
        selectedFormRoute: props.selectedFormRoute,
        submit: props.submit,
        setSubmit,
        approve,
        setAddOn,
        errorMessage: props.errorMessage,
    };
    const procurementFormProps = {
        showModal: modalProcurementForm,
        setShowModal: setModalProcurementForm,
        setErrorMessage,
        setSubmit,
        selectedFormRoute: props.selectedFormRoute,
        setSelectedFormRoute,
        setSelectedForm,
        approve,
        setProcurementFormType,
        procurementFormType: props.procurementFormType,
        setSelectedAccountClassification,
        selectedAccountClassification: props.selectedAccountClassification
    };

    return (
        <div className='row' style={{minHeight: "50vh"}}>
            
            <ModalDisapproveForm {...disapprovedFormProps} />
            <ModalResolveForm {...resolveFormProps} />
            <ModalBudgetForm {...budgetFormProps} />
            <ModalProcurementForm {...procurementFormProps} />


            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={16} xl={18}>
                    <Card size="small" title="Pending Forms" bordered={false}>
                        <div className='forms-card-content'>
                            <div className="flex justify-end mb-2 space-x-2">
                                <TableResetFilter defaultTableFilter="reset" setTableFilter={setTableFilter} />
                                <TableRefresh getData={getForm} />
                            </div>
                            <Table
                                dataSource={dataSource}
                                columns={columns}
                                size={"small"}
                                loading={{spinning: props.tableLoading, tip: "Loading..."}}
                                pagination={false}
                                onChange={handleTableChange}
                                scroll={{ y: "58vh" }}
                                rowClassName={(record, index) => {
                                    if(props.selectedFormRoute.id == record.id){
                                        return "selected-row";
                                    }
                                }}
                            />
                            <TableFooterPagination pagination={props.pagination} paginationChange={paginationChange} />
                        </div>
                    </Card>
                </Col>
                { isEmpty(props.selectedFormRoute) || props.selectedFormRoute.form_routable.file == "" ? "" : (
                    <Col md={24} lg={8} xl={6}>
                        <Card size="small" title="Form Information" bordered={false} extra={(
                            <div className='text-right flex space-x-0.5'>
                                <div className='space-x-0.5 mr-2'>
                                    { props.selectedFormRoute.status == "with_issues" ? (
                                        <Tooltip placement="top" title={"Resolve"}>
                                            <Button size='small' type='default' onClick={() => { resolveForm(props.selectedFormRoute, 0) }}><SendOutlined /></Button>
                                        </Tooltip>
                                    ) : (
                                        <>
                                        <Tooltip placement="top" title={"Approve"}>
                                            <Button size='small' type='default' onClick={() => { confirm(props.selectedFormRoute, 0) }} disabled={props.submit}><LikeTwoTone twoToneColor="#0000FF" /></Button>
                                        </Tooltip>
                                            
                                            { props.selectedFormRoute.route_code == "route_origin" ? "" : (
                                                <Tooltip placement="top" title={"Disapprove"}>
                                                    <Button size='small' type='default' onClick={() => { showRejectForm(props.selectedFormRoute, 0) }}><DislikeTwoTone twoToneColor="#FF0000" /></Button>
                                                </Tooltip>
                                            ) }
                                        </>
                                    ) }
                                </div>
                                <Tooltip placement="top" title={"Open in new window"}>
                                    <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                </Tooltip>
                                <Tooltip placement="top" title={"Close window"}>
                                    <Button size='small' type='danger' onClick={() => closeForm() }><CloseOutlined /></Button>
                                </Tooltip>
                            </div>
                        )}>
                            <div className='forms-card-content'>
                                <p>
                                    <span><b>Form type:</b> <span>{props.selectedFormRoute.route_type_str}</span></span><br />
                                    <span><b>End User:</b> <span>{props.selectedFormRoute.end_user.name}</span></span><br />
                                    <span><b>Forwarded by:</b> <span>{props.selectedFormRoute.from_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.selectedFormRoute.from_office?.name}` : props.selectedFormRoute.from_office?.name }</span></span><br />
                                    <span><b>Forwarded to:</b> <span>{props.selectedFormRoute.to_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.selectedFormRoute.to_office?.name}` : props.selectedFormRoute.to_office?.name }</span></span><br />
                                    <span><b>Remarks:</b> <span>{props.selectedFormRoute.remarks}</span></span><br />
                                    { props.selectedFormRoute.forwarded_remarks ? <span><b>Remarks:</b> <span>{props.selectedFormRoute.forwarded_remarks}</span><br /></span> : ""}
                                    <span><b>Status:</b> <span>{ props.selectedFormRoute.status != "pending" ? "Disapproved" : "Pending"}</span></span><br />
                                    { props.selectedFormRoute.status != "pending" ? <span><b>Disapproved by:</b> <span>{props.selectedFormRoute.user?.user_information?.fullname}</span><br /></span> : ""}
                                    <span><b>Created:</b> <span>{ props.selectedFormRoute.created_at }</span></span><br />
                                </p>
                                <p className='text-center'><b>{props.selectedFormRoute.route_type_str} Information</b></p>
                                { formInformation(props.selectedFormRoute.route_type) }
                            </div>
                        </Card>
                    </Col>
                )  }
            </Row>
            { isEmpty(props.selectedFormRoute) || props.selectedFormRoute.form_routable.file == "" ? "" : (
            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={16} xl={18}>
                    <Card size="small" title="Forwarded Form" bordered={false} loading={props.formLoading}>
                        <div className='forms-card-form-content'>
                            <iframe src={`${props.selectedFormRoute.form_routable?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>
                        </div>
                    </Card>
                </Col>

                <Col md={24} lg={8} xl={6}>
                        <Card size="small" title="Attachments" bordered={false} loading={props.formLoading}>
                            <div className='forms-card-form-content'>
                                <AttachmentUpload formId={props.selectedFormRoute.form_routable_id} formType={props.selectedFormRoute.route_type} fileList={props.attachments}></AttachmentUpload>
                            </div>
                        </Card>
                    </Col>
            </Row>
            )  }
            <ArchiveForm reloadData={() => {
                getForm();
                setSelectedFormRoute({});
                setSelectedForm({});
            }} selectedForm={props.selectedForm} setArchiveModal={setArchiveModal} archiveModal={archiveModal} formType={props.selectedFormRoute?.route_type} />
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(PendingForm);
