import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography, Tooltip, notification, Modal, Form, Input, Select, Card, Col, Row, Dropdown, Menu, Pagination } from 'antd';
import api from '../../api';
import Icon, { CloseOutlined, FormOutlined, EllipsisOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import dayjs from 'dayjs';
import filter from '../../Utilities/filter';
import helpers from '../../Utilities/helpers';
import AttachmentUpload from '../../Components/AttachmentUpload';
import { Link, useLocation  } from 'react-router-dom'
import TableFooterPagination from '../../Components/TableFooterPagination';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;


function mapStateToProps(state) {
    return {
        user: state.user.data,
        procurementTypes: state.libraries.procurement_types,
        uacsCodes: state.libraries.uacs_codes,
        procurementTypeCategories: state.libraries.procurement_type_categories,
        modeOfProcurements: state.libraries.mode_of_procurements,
        technicalWorkingGroups: state.libraries.technical_working_groups,
        user_sections: state.libraries.user_sections,
        isInitialized: state.user.isInitialized,
        forms: state.forms.forwardedForm.forms,
        pagination: state.forms.forwardedForm.pagination,
        selectedFormRoute: state.forms.forwardedForm.selectedFormRoute,
        routeOptions: state.forms.forwardedForm.routeOptions,
        procurementFormType: state.forms.forwardedForm.procurementFormType,
        currentRoute: state.forms.forwardedForm.currentRoute,
        addOn: state.forms.forwardedForm.addOn,
        errorMessage: state.forms.forwardedForm.errorMessage,
        tableLoading: state.forms.forwardedForm.tableLoading,
        selectedProcurementCategory: state.forms.forwardedForm.selectedProcurementCategory,
        submit: state.forms.forwardedForm.submit,
        attachments: state.forms.forwardedForm.attachments,
        formLoading: state.forms.forwardedForm.formLoading,
    };
}

const MaximizeSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M794.432 983.552H51.2a25.6 25.6 0 0 1-25.6-25.6V214.784a25.6 25.6 0 0 1 25.6-25.6h152.768V66.112a25.6 25.6 0 0 1 25.6-25.6H972.8a25.6 25.6 0 0 1 25.6 25.6v743.232a25.6 25.6 0 0 1-25.6 25.6h-152.768v123.008a25.6 25.6 0 0 1-25.6 25.6z m-717.632-51.2h692.032V240.384H76.8v691.968z m743.232-148.672H947.2V91.648H255.168v97.472h539.264a25.6 25.6 0 0 1 25.6 25.6v568.96z" p-id="2528"></path>
    </svg>
);  

const ForwardedForm = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => {
            unmounted.current = true;
            setForms([]);
            setPaginationMeta({});
            setSelectedFormRoute({});
            setRouteOptions([]);
            setProcurementFormType("");
            setCurrentRoute({});
            setAddOn(`BUDRP-PR-${dayjs().format("YYYY-MM-")}`);
            setErrorMessage({});
            setTableLoading(false);
            setSelectedProcurementCategory(null);
            setSubmit(false);
            setAttachments([]);
            setFormLoading(false);
        }
    }, []);

    const location = useLocation();
    const rejectFormRef = React.useRef();
    const resolveFormRef = React.useRef();
    const budgetFormRef = React.useRef();
    const procurementFormRef = React.useRef();
    useEffect(() => {
        document.title = "Forwarded Forms";
        if(props.isInitialized){
            getForm();
        }
    }, [props.isInitialized]);
    useEffect(() => {
        window.Echo.channel('home').listen('NewMessage', (e) => {
            console.log(location.pathname);
            getForm();
        });
    }, []);
    const [filterData, setFilterData] = useState({});
    const [modalRejectForm, setModalRejectForm] = useState(false);
    const [modalResolveForm, setModalResolveForm] = useState(false);
    const [modalBudgetForm, setModalBudgetForm] = useState(false);
    const [modalProcurementForm, setModalProcurementForm] = useState(false);

    const setForms = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_FORMS",
            data: value,
        });
    }
    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_PAGINATION_META",
            data: value,
        });
    }
    const setSelectedFormRoute = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_SELECTED_FORM_ROUTE",
            data: value,
        });
    }
    const setRouteOptions = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_ROUTE_OPTIONS",
            data: value,
        });
    }
    const setProcurementFormType = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_PROCUREMENT_FORM_TYPE",
            data: value,
        });
    }
    const setCurrentRoute = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_CURRENT_ROUTE",
            data: value,
        });
    }
    const setAddOn = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_ADD_ON",
            data: value,
        });
    }
    const setErrorMessage = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_ERROR_MESSAGE",
            data: value,
        });
    }
    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_TABLE_LOADING",
            data: value,
        });
    }
    const setSelectedProcurementCategory = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_SELECTED_PROCUREMENT_CATEGORY",
            data: value,
        });
    }
    const setSubmit = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_SUBMIT",
            data: value,
        });
    }
    const setAttachments = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_ATTACHMENTS",
            data: value,
        });
    }
    const setFormLoading = (value) => {
        props.dispatch({
            type: "SET_FORM_FORWARDED_FORM_LOADING",
            data: value,
        });
    }
    

    const showRejectForm = (formRouteItem) => {
        setSelectedFormRoute(formRouteItem)
        setModalRejectForm(true);
        let options = formRouteItem.form_process.form_routes.filter(i => i.status == "approve" || i.status == "approved");
        setRouteOptions(options);
        setTimeout(() => {
            rejectFormRef.current.setFieldsValue({
                to_office_id: formRouteItem.origin_office_id,
            });
        }, 150);
        return false;
       
    }

    const proceedReject = (e) => {
        setErrorMessage({});
        let formData = {
            ...e,
        };
        api.Forms.reject(props.selectedFormRoute.id, formData)
        .then(res => {
            if (unmounted.current) { return false; }
            setSubmit(false);
            setErrorMessage({});
            setModalRejectForm(false);
            getForm();
            setSelectedFormRoute({});
            setCurrentRoute({});
            rejectFormRef.current.resetFields()
        })
        .catch(err => {
            setSubmit(false);
        })
        .then(res => {
            setSubmit(false);
        })
        ;
    }

    const submitRejectForm = (e) => {
        setSubmit(true);
        api.Forms.getRoute(props.selectedFormRoute.id)
        .then(res => {
            if (unmounted.current) { return false; }
            if(res.data.status != "pending" && res.data.status != "with_issues"){
                setSubmit(false);
                setModalRejectForm(false);
                notification.error({
                    message: 'Error',
                    description:
                        'The form has already amended.',
                    }
                );
                getForm();
                setSelectedFormRoute({});
                setCurrentRoute({});
                return false;
            }else{
                proceedReject(e);
            }
        })
        .catch(err => {
            setSubmit(false);
        })
    };
    const cancelRejectForm = () => {
        rejectFormRef.current.setFieldsValue({
            remarks: null,
            to_office_id: null,
        });
        setModalRejectForm(false);
    };


    const showResolveForm = (formRouteItem) => {
        setSelectedFormRoute(formRouteItem)
        setModalResolveForm(true);
        let options = formRouteItem.form_process.form_routes.filter(i => i.status == "approve" || i.status == "approved");
        setRouteOptions(options);
        setTimeout(() => {
            resolveFormRef.current.setFieldsValue({
                to_office_id: formRouteItem.origin_office_id,
            });
        }, 150);
        return false;
       
    }

    const proceedResolve = (e) => {
        setErrorMessage({});
        let formData = {
            ...e,

        };
        api.Forms.resolve(props.selectedFormRoute.id, formData)
        .then(res => {
            if (unmounted.current) { return false; }
            setSubmit(false);
            setErrorMessage({});
            setModalResolveForm(false);
            getForm();
            setSelectedFormRoute({});
            setCurrentRoute({});
            resolveFormRef.current.resetFields()
        })
        .catch(err => {
            setSubmit(false);
        })
        .then(res => {
            setSubmit(false);
        })
        ;
    }

    const submitResolveForm = (e) => {
        setSubmit(true);
        api.Forms.getRoute(props.selectedFormRoute.id)
        .then(res => {
            if (unmounted.current) { return false; }
            if(res.data.status != "pending" && res.data.status != "with_issues"){
                setSubmit(false);
                setModalResolveForm(false);
                notification.error({
                    message: 'Error',
                    description:
                        'The form has already amended.',
                    }
                );
                getForm();
                setSelectedFormRoute({});
                setCurrentRoute({});
                return false;
            }else{
                proceedResolve(e);
            }
        })
        .catch(err => {
            setSubmit(false);
        })
    };
    const cancelResolveForm = () => {
        resolveFormRef.current.setFieldsValue({
            remarks: null
        });
        setModalResolveForm(false);
    };
    

    const getForm = debounce((filters) => {
        if(filters == null){
            filters = filterData
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
        .then(res => {})
        ;
    },150);
    
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
        
            default:
                break;
        }
    }
    const respondForm = (item, index) => {
        setSelectedFormRoute(item)
    }
    const resolveForm = (item, index) => {
        setSelectedFormRoute(item);
        showResolveForm(item);
    }
    const closeForm = () => {
        setSelectedFormRoute({});
    }
    

    const cancelBudgetForm = () => {
        budgetFormRef.current.setFieldsValue({
            purchase_request_number_last: null,
            fund_cluster: null,
            center_code: null,
            charge_to: null,
            alloted_amount: null,
            uacs_code: null,
            sa_or: null,
        });
        setModalBudgetForm(false);
    }

    const endUserFilter = cloneDeep(props.user_sections).map(i => {
        i.value = i.id;
        return i;
    });

    const proceedBudget = (e) => {
        setErrorMessage({});
        let formData = {
            ...e,
            id: props.selectedFormRoute.form_routable.id,
            purchase_request_number: `${props.addOn}${e.purchase_request_number_last}`,
            updater: "budget",
        };
        if(props.selectedFormRoute.route_type == "purchase_request"){
            api.PurchaseRequest.save(formData, 'update')
            .then(res => {
                if (unmounted.current) { return false; }
                setSubmit(false);
                setErrorMessage({});
                approve(props.selectedFormRoute);
                setModalBudgetForm(false);
                cancelBudgetForm();
                budgetFormRef.current.resetFields()
            })
            .catch(err => {
                setSubmit(false);
                setErrorMessage(err.response.data.errors)
                
            })
            .then(res => {});
        }
    }
    const submitBudgetForm = async (e) => {
        setSubmit(true);
        api.Forms.getRoute(props.selectedFormRoute.id)
        .then(res => {
            if (unmounted.current) { return false; }
            if(res.data.status != "pending" && res.data.status != "with_issues"){
                setSubmit(false);
                setModalBudgetForm(false);
                notification.error({
                    message: 'Error',
                    description:
                        'The form has already amended.',
                    }
                );
                getForm();
                setSelectedFormRoute({});
                setCurrentRoute({});
                return false;
            }else{
                proceedBudget(e);
            }
        })
        .catch(err => {
            setSubmit(false);
        })
    }
    
    const cancelProcurementForm = () => {
        procurementFormRef.current.setFieldsValue({
            action_type: null,
            technical_working_group_id: null,
            procurement_type_category: null,
            procurement_type_id: null,
            mode_of_procurement_id: null,
        });
        setProcurementFormType("");
        setModalProcurementForm(false);
    }

    const proceedProcurement = (e) => {
        setErrorMessage({});
        if(props.selectedFormRoute.route_type == "purchase_request"){
            if(props.procurementFormType == "approve"){
                let formData = {
                    ...e,
                    id: props.selectedFormRoute.form_routable.id,
                    updater: "procurement",
                };

                api.PurchaseRequest.save(formData, 'update')
                .then(res => {
                    if (unmounted.current) { return false; }
                    setSubmit(false);
                    setErrorMessage({});
                    approve(props.selectedFormRoute);
                    setModalProcurementForm(false);
                    cancelProcurementForm();
                    procurementFormRef.current.resetFields()
                })
                .catch(err => {
                    setSubmit(false);
                    setErrorMessage(err.response.data.errors)
                    
                })
            }else if(props.procurementFormType == "twg"){
                let formData = {
                    ...e,
                    id: props.selectedFormRoute.form_process.id,
                    type: props.procurementFormType,
                    updater: "procurement",
                }                
                api.Forms.updateProcess(formData)
                .then(res => {
                    if (unmounted.current) { return false; }
                    setSubmit(false);
                    approve(props.selectedFormRoute);
                    setModalProcurementForm(false);
                    cancelProcurementForm();
                    procurementFormRef.current.resetFields()
                })
                .catch(err => {
                    setSubmit(false);
                    setErrorMessage(err.response.data.errors)
                    
                })
            }
        }
    }
    const submitProcurementForm = debounce(async (e) => {
        setSubmit(true);
        api.Forms.getRoute(props.selectedFormRoute.id)
        .then(res => {
            if (unmounted.current) { return false; }
            if(res.data.status != "pending" && res.data.status != "with_issues"){
                setSubmit(false);
                setModalProcurementForm(false);
                notification.error({
                    message: 'Error',
                    description:
                        'The form has already amended.',
                    }
                );
                getForm();
                setSelectedFormRoute({});
                setCurrentRoute({});
                return false;
            }else{
                proceedProcurement(e);
            }
        })
        .catch(err => {
            setSubmit(false);
        })
    }, 150);


    const confirm = debounce((item) => {
        setSelectedFormRoute(item);
        let current_route = item.form_process.form_routes.filter(i => i.status == "pending");

        let procurement_user_office = props.user.user_offices.data.filter(i => i.office.title == "PS");
        let budget_user_office = props.user.user_offices.data.filter(i => i.office.title == "BS");
        setCurrentRoute(current_route[0]);
        if(procurement_user_office.length != 0){
            if(current_route[0].description_code == "select_action" || current_route[0].description_code == "aprroval_from_proc"){
                setModalProcurementForm(true);
                if(current_route[0].description_code == "aprroval_from_proc"){
                    setProcurementFormType("approve");
                }
            }
        }else if(budget_user_office.length != 0  && current_route[0].description_code == "aprroval_from_budget"){
            api.PurchaseRequest.getNextNumber()
            .then(res => {
                if (unmounted.current) { return false; }
                setModalBudgetForm(true);
                setTimeout(() => {
                    budgetFormRef.current.setFieldsValue({
                        purchase_request_number_last: res.data.next_number,
                        alloted_amount: item.form_routable.common_amount,
                    });
                }, 150);
            })
            .catch(res => {})
            .then(res => {})
        }else{
            approve(item);
        }
    }, 150)

    const approve = debounce(async (item) => {
        api.Forms.getRoute(item.id)
        .then(res => {
            if (unmounted.current) { return false; }
            if(res.data.status != "pending" && res.data.status != "with_issues"){
                notification.error({
                    message: 'Error',
                    description:
                        'The form has already amended.',
                    }
                );
                getForm();
                setSelectedFormRoute({});
                setCurrentRoute({});
                return false;
            }else{
                api.Forms.approve(item.id)
                .then(res => {
                    if (unmounted.current) { return false; }
                    let nextRoute = res.data.next_route;
                    notification.success({
                        message: 'Purchase Request is approved.',
                        description:
                            `The form has been forwarded to ${nextRoute.office_name} for ${nextRoute.description}`,
                        }
                    );
                    getForm();
                    setSelectedFormRoute({});
                    setCurrentRoute({});
                })
                .catch(err => {})
                .then(res => {})
                ;
            }
        })
        .catch(err => {})
    }, 150);

    const actionTypeProcurement = (e) => {
        setProcurementFormType(e);
    }

    const viewPurchaseRequest = (id) => {
        setFormLoading(true);
        api.PurchaseRequest.get(id)
        .then(res => {
            if (unmounted.current) { return false; }
            setAttachments(res.data.form_uploads.data)
            setFormLoading(false);
            // setSelectedForm();
        })
        .catch(err => {
            setFormLoading(false);
        })
        .then(res => {
            setFormLoading(false);
        })
        ;
    }

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
            width: 150,
            ...onCell,
        },
        {
            title: 'Title',
            key: 'title',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.title }
                </span>
            ),
            ...filter.search('title','text', setFilterData, filterData, getForm),
            ...onCell,
            width: 150,
        },
        {
            title: 'Purpose',
            key: 'purpose',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.purpose }
                </span>
            ),
            ...filter.search('purpose','text', setFilterData, filterData, getForm),
            ...onCell,
            width: 150,
        },
        {
            title: 'Amount',
            key: 'amount',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.total_cost_formatted }
                </span>
            ),
            ...onCell,
            width: 150,
        },
        {
            title: 'End User',
            key: 'end_user',
            ellipsis: true,
            width: 250,
            filters: endUserFilter,
            ...filter.list('end_user_id','text', setFilterData, filterData, getForm),
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            ),
            ...onCell,
        },
        {
            title: 'Status',
            key: 'status',
            width: 250,
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
            ...filter.list('status','text', setFilterData, filterData, getForm),
            ...onCell,
        },
        {
            title: 'Description',
            key: 'description',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <span>{item.remarks }</span>
                </span>
            ),
            ...filter.search('remarks','text', setFilterData, filterData, getForm),
            ...onCell,
        },
        {
            title: 'Remarks',
            key: 'remarks',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <span>{ item.forwarded_remarks }</span>
                </span>
            ),
            ...filter.search('forwarded_remarks','text', setFilterData, filterData, getForm),
            ...onCell,
        },

        {
            title: "Action",
            key: "action",
            fixed: 'right',
            width: 60,
            align: "center",
            render: (text, item, index) => (
                <Dropdown overlay={menu(item, index)} trigger={['click']}>
                    <Button size='small'>
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(sorter);
        console.log(filters);
        getForm({...filterData, ...filters})
    };

    const paginationChange = async (e) => {
        console.log(e);
        setFilterData(prev => ({...prev, page: e}));
        getForm({...filterData, page: e})
    }

    const formatPrNumber = (e) => {
        let pr_last = e.target.value;
        let padded_pr_last = pr_last.padStart(5, '0');
        budgetFormRef.current.setFieldsValue({
            // purchase_request_number: "BUDRP-PR-"+dayjs().format("YYYY-MM-"),
            purchase_request_number_last: padded_pr_last,
        });
    }


    const menu = (item, index) => (
        <Menu onClick={() => setSelectedFormRoute(item) }>
            <Menu.Item key="menu-view" icon={<FormOutlined />}  onClick={() => { viewForm(item, index) }}>
                View
            </Menu.Item>
            { item.status == "with_issues" ? (
                    <Menu.Item key="menu-resolve" icon={<SendOutlined twoToneColor="#0000FF" />} onClick={() => { resolveForm(item, index) }}>
                        Resolve
                    </Menu.Item>
            ) : (
                <>
                    <Menu.Item key="menu-approve" icon={<LikeTwoTone twoToneColor="#0000FF" />} onClick={() => { confirm(item, index) }}>
                        Approve
                    </Menu.Item>
                    { item.from_office_id == item.to_office_id ? "" : (
                        <Menu.Item key="menu-reject" icon={<DislikeTwoTone twoToneColor="#FF0000" />} onClick={() => { showRejectForm(item, index) }}>
                            Disapprove
                        </Menu.Item>
                    ) }
                </>
            ) }
        </Menu>
      );
    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <Modal title="Disapproval Form" visible={modalRejectForm} 
                footer={[
                    <Button type='primary' form="rejectForm" key="submit" htmlType="submit" disabled={props.submit} loading={props.submit}>
                        Submit
                    </Button>,
                    <Button form="rejectForm" key="cancel" onClick={() => cancelRejectForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={cancelRejectForm}>
                <Form
                    ref={rejectFormRef}
                    name="normal_login"
                    className="login-form"
                    onFinish={(e) => submitRejectForm(e)}
                    layout='vertical'
                    id="rejectForm"
                >
                    <Form.Item
                        name="remarks"
                        label="Remarks"
                        rules={[{ required: true, message: 'Please add remarks' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="to_office_id"
                        label="Return to"
                        rules={[{ required: true, message: 'Please select office.' }]}
                    >
                        <Select>
                            { props.routeOptions.map((item, index) => <Option value={item.office_id} key={index}>{item.office_name}</Option> ) }
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>

            <Modal title="Resolve Form" visible={modalResolveForm} 
                footer={[
                    <Button type='primary' form="resolveForm" key="submit" htmlType="submit" disabled={props.submit} loading={props.submit}>
                        Submit
                    </Button>,
                    <Button form="resolveForm" key="cancel" onClick={() => cancelResolveForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={cancelResolveForm}>
                <Form
                    ref={resolveFormRef}
                    name="normal_login"
                    className="login-form"
                    onFinish={(e) => submitResolveForm(e)}
                    layout='vertical'
                    id="resolveForm"
                >
                    <Form.Item
                        name="remarks"
                        label="Remarks"
                        rules={[{ required: true, message: 'Please add remarks' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Budget Approval Form" visible={modalBudgetForm} 
                footer={[
                    <Button type='primary' form="budgetForm" key="submit" htmlType="submit" disabled={props.submit} loading={props.submit}>
                        Submit
                    </Button>,
                    <Button form="budgetForm" key="cancel" onClick={() => cancelBudgetForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={cancelBudgetForm}>
                <Form
                    ref={budgetFormRef}
                    name="normal_login"
                    className="login-form"
                    onFinish={(e) => submitBudgetForm(e)}
                    layout='vertical'
                    id="budgetForm"
                >

                    <Form.Item
                        name="purchase_request_number_last"
                        label="Purchase Request Number"
                        rules={[{ required: true, message: 'Please input Purchase Request Number.' }]}
                        { ...helpers.displayError(props.errorMessage, 'purchase_request_number_last') }
                    >
                        <Input onBlur={(e) => formatPrNumber(e)} addonBefore={(
                            <Select onChange={setAddOn} defaultValue={ `BUDRP-PR-${dayjs().format("YYYY-MM-")}` } className="select-after">
                                <Option value={ `BUDRP-PR-${dayjs().format("YYYY-MM-")}` }>{ `BUDRP-PR-${dayjs().format("YYYY-MM-")}` }</Option>
                                <Option value={ `BUDSP-PR-${dayjs().format("YYYY-MM-")}` }>{ `BUDSP-PR-${dayjs().format("YYYY-MM-")}` }</Option>
                            </Select>
                        )} placeholder="Purchase Request Number" />
                    </Form.Item>

                    <Form.Item
                        name="fund_cluster"
                        label="Fund Cluster"
                        rules={[{ required: true, message: 'Please input Fund Cluster.' }]}
                        { ...helpers.displayError(props.errorMessage, 'fund_cluster') }
                    >
                        <Input placeholder="Fund Cluster" />
                    </Form.Item>

                    {/* <Form.Item
                        name="center_code"
                        label="Responsibility Center Code"
                        // rules={[{ required: true, message: 'Please input Responsibility Center Code.' }]}
                        { ...helpers.displayError(props.errorMessage, 'center_code') }
                    >
                        <Input placeholder="Responsibility Center Code" />
                    </Form.Item> */}
                    <Form.Item
                        name="charge_to"
                        label="Charge To"
                        rules={[{ required: true, message: 'Please where to charge' }]}
                    >
                        <Input placeholder='Charge to' />
                    </Form.Item>
                    <Form.Item
                        name="alloted_amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter amount' }]}
                    >
                        <Input placeholder='Amount' type="number" min={0.01} step={0.01} />
                    </Form.Item>
                    <Form.Item
                        name="uacs_code_id"
                        label="UACS Code"
                        rules={[{ required: true, message: 'Please enter UACS Code' }]}
                    >
                        {/* <Input placeholder='UACS CODE' /> */}
                        <Select
                            placeholder='Select Category'
                            showSearch
                            filterOption={(input, option) =>
                                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            { props.uacsCodes.map(i => <Option value={i.id} key={i.key}>{`${i.name} - ${i.title}`}</Option> ) }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="sa_or"
                        label="SA/OR"
                        rules={[{ required: true, message: 'Please enter SA/OR' }]}
                    >
                        <Input placeholder='SA/OR' />
                    </Form.Item>

                </Form>
            </Modal>


            <Modal title="Procurement Approval Form" visible={modalProcurementForm} 
                footer={[
                    props.procurementFormType !="" ? (<Button type='primary' form="procurementForm" key="submit" htmlType="submit" disabled={props.submit} loading={props.submit}>
                        Submit
                    </Button>) : ""
                    ,
                    <Button form="procurementForm" key="cancel" onClick={() => cancelProcurementForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={cancelProcurementForm}
                >
                <Form
                    ref={procurementFormRef}
                    name="normal_login"
                    className="login-form"
                    onFinish={(e) => submitProcurementForm(e)}
                    layout='vertical'
                    id="procurementForm"
                >

                    { props.currentRoute.description_code != "aprroval_from_proc" ? (
                        <Form.Item
                            name="action_type"
                            label="Action"
                            rules={[{ required: true, message: 'Please select Procurement Type.' }]}
                        >
                            <Select placeholder='Select Action' onChange={(e) => actionTypeProcurement(e)}>
                                <Option value="twg">Forward to Technical Working Group</Option>
                                <Option value="approve">Proceed to Approval</Option>
                            </Select>
                        </Form.Item>
                    ) : "" }

                    { props.procurementFormType == "twg" ? (
                        <Form.Item
                            name="technical_working_group_id"
                            label="Technical Working Groups"
                            rules={[{ required: true, message: 'Please select Technical Working Group.' }]}
                        >
                            <Select placeholder='Select Technical Working Groups'>
                                { props.technicalWorkingGroups.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                            </Select>
                        </Form.Item>
                    ) : "" }
                    { props.procurementFormType == "approve" ? (
                        <>
                            <Form.Item
                                name="procurement_type_category"
                                label="Procurement Category"
                                { ...helpers.displayError(props.errorMessage, 'procurement_type_category') }
                                rules={[{ required: true, message: 'Please select Procurement Category.' }]}
                            >
                                <Select placeholder='Select Procurement Category' onSelect={(e) => {
                                    procurementFormRef.current.setFieldsValue({
                                        procurement_type_id: null,
                                    });
                                    setSelectedProcurementCategory(e);
                                }}>
                                    { props.procurementTypeCategories.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                </Select>
                            </Form.Item>

                            {
                                props.selectedProcurementCategory != null ? (
                                    <Form.Item
                                        name="procurement_type_id"
                                        label="Procurement Type"
                                        { ...helpers.displayError(props.errorMessage, 'procurement_type_id') }
                                        rules={[{ required: true, message: 'Please select Procurement Type.' }]}
                                    >
                                        <Select placeholder='Select Procurement Category' allowClear > 
                                            { props.procurementTypes.filter(i => i.parent.id == props.selectedProcurementCategory).map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                        </Select>
                                    </Form.Item>
                                ) : ""
                            }

                            <Form.Item
                                name="mode_of_procurement_id"
                                label="Mode of Procurement"
                                { ...helpers.displayError(props.errorMessage, 'mode_of_procurement_id') }
                                rules={[{ required: true, message: 'Please select Mode of Procurement.' }]}
                            >
                                <Select placeholder='Select Mode of Procurement'>
                                    { props.modeOfProcurements.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                </Select>
                            </Form.Item>
                        </>
                    ) : "" }
                                        
                </Form>
            </Modal>


            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={16} xl={18}>
                    <Card size="small" title="Forwarded Forms" bordered={false}>
                        <div className='forms-card-content'>
                            <Table
                                dataSource={dataSource}
                                columns={columns}
                                size={"small"}
                                loading={{spinning: props.tableLoading, tip: "Loading..."}}
                                pagination={false}
                                onChange={handleTableChange}
                                scroll={{ y: "60vh" }}
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
                                            <Button size='small' type='default' onClick={() => { confirm(props.selectedFormRoute, 0) }}><LikeTwoTone twoToneColor="#0000FF" /></Button>
                                        </Tooltip>
                                            
                                            { props.selectedFormRoute.from_office_id == props.selectedFormRoute.to_office_id ? "" : (
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
                                    <span><b>Title:</b> <span>{props.selectedFormRoute.form_routable?.title}</span></span><br />
                                    <span><b>End User:</b> <span>{props.selectedFormRoute.end_user.name}</span></span><br />
                                    <span><b>Purpose:</b> <span>{props.selectedFormRoute.form_routable?.purpose}</span></span><br />
                                    <span><b>Amount:</b> <span>{props.selectedFormRoute.form_routable?.total_cost_formatted}</span></span><br />
                                    <span><b>Forwarded by:</b> <span>{props.selectedFormRoute.from_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.selectedFormRoute.from_office?.name}` : props.selectedFormRoute.from_office?.name }</span></span><br />
                                    <span><b>Forwarded to:</b> <span>{props.selectedFormRoute.to_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.selectedFormRoute.to_office?.name}` : props.selectedFormRoute.to_office?.name }</span></span><br />
                                    <span><b>Remarks:</b> <span>{props.selectedFormRoute.remarks}</span></span><br />
                                    { props.selectedFormRoute.forwarded_remarks ? <span><b>Remarks:</b> <span>{props.selectedFormRoute.forwarded_remarks}</span><br /></span> : ""}
                                    <span><b>Status:</b> <span>{ props.selectedFormRoute.status != "pending" ? "Disapproved" : "Pending"}</span></span><br />
                                    { props.selectedFormRoute.status != "pending" ? <span><b>Disapproved by:</b> <span>{props.selectedFormRoute.user?.user_information?.fullname}</span><br /></span> : ""}
                                </p>
                                
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
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ForwardedForm);
