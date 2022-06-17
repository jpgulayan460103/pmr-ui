import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation  } from 'react-router-dom'
import dayjs from 'dayjs';
import { Table, Button, Typography, Tooltip, notification, Modal, Form, Input, Select, Card, Col, Row, Dropdown, Menu } from 'antd';
import Icon, { CloseOutlined, FormOutlined, EllipsisOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import api from '../../api';
import filter from '../../Utilities/filter';
import helpers from '../../Utilities/helpers';
import AttachmentUpload from '../../Components/AttachmentUpload';
import TableFooterPagination from '../../Components/TableFooterPagination';
import TableRefresh from '../../Components/TableRefresh';
import TableResetFilter from '../../Components/TableResetFilter';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
        forms: state.forms.forwardedForm.forms,
        pagination: state.forms.forwardedForm.pagination,
        selectedFormRoute: state.forms.forwardedForm.selectedFormRoute,
        routeOptions: state.forms.forwardedForm.routeOptions,
        procurementFormType: state.forms.forwardedForm.procurementFormType,
        currentRoute: state.forms.forwardedForm.currentRoute,
        addOn: state.forms.forwardedForm.addOn,
        errorMessage: state.forms.forwardedForm.errorMessage,
        tableLoading: state.forms.forwardedForm.tableLoading,
        selectedAccountClassification: state.forms.forwardedForm.selectedAccountClassification,
        submit: state.forms.forwardedForm.submit,
        attachments: state.forms.forwardedForm.attachments,
        formLoading: state.forms.forwardedForm.formLoading,
        tableFilter: state.forms.forwardedForm.tableFilter,
        defaultTableFilter: state.forms.forwardedForm.defaultTableFilter,
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
            // setForms([]);
            // setPaginationMeta({});
            // setSelectedFormRoute({});
            // setRouteOptions([]);
            // setProcurementFormType("");
            // setCurrentRoute({});
            // setAddOn(`BUDRP-PR-${dayjs().format("YYYY-MM-")}`);
            // setErrorMessage({});
            // setTableLoading(false);
            // setSelectedAccountClassification(null);
            // setSubmit(false);
            // setAttachments([]);
            // setFormLoading(false);
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
            if(isEmpty(props.forms)){
            }
            getForm();
        }
        // console.log("rerender");
    }, [props.isInitialized]);
    const defaultTableFilter = {
        page: 1,
        created_at: helpers.defaultDateRange
    };
    // const [tableFilter, setTableFilter] = useState(defaultTableFilter);
    const [modalRejectForm, setModalRejectForm] = useState(false);
    const [modalResolveForm, setModalResolveForm] = useState(false);
    const [modalBudgetForm, setModalBudgetForm] = useState(false);
    const [modalProcurementForm, setModalProcurementForm] = useState(false);

    const setTableFilter = (data) => {
        if(typeof data == "function"){
            props.dispatch({
                type: "SET_FORM_FORWARDED_TABLE_FILTER",
                data: { ...props.tableFilter, ...data() },
            });
        }else{
            props.dispatch({
                type: "SET_FORM_FORWARDED_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
        }
    }

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
    const setSelectedAccountClassification = (value) => {
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

    const closeRejectForm = () => {
        rejectFormRef.current.resetFields();
        setModalRejectForm(false);
    };

    const submitRejectForm = debounce((e) => {
        setErrorMessage({});
        setSubmit(true);
        let formData = {
            ...e,
        };
        api.Forms.reject(props.selectedFormRoute.id, formData)
        .then(res => {
            if (unmounted.current) { return false; }
            setSubmit(false);
            closeRejectForm();
            setErrorMessage({});
            getForm();
            setSelectedFormRoute({});
            setCurrentRoute({});
        })
        .catch(err => {
            setSubmit(false);
        })
        .then(res => {
            setSubmit(false);
        })
        ;
    }, 150);



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

    const closeResolveForm = () => {
        resolveFormRef.current.resetFields();
        setModalResolveForm(false);
    };


    const submitResolveForm = debounce((e) => {
        setSubmit(true);
        setErrorMessage({});
        let formData = {
            ...e,
        };
        api.Forms.approve(props.selectedFormRoute.id, formData)
        .then(res => {
            if (unmounted.current) { return false; }
            setSubmit(false);
            closeResolveForm();
            setErrorMessage({});
            getForm();
            setSelectedFormRoute({});
            setCurrentRoute({});
        })
        .catch(err => {
            setSubmit(false);
        })
        .then(res => {
            setSubmit(false);
        })
        ;
    }, 150);


    const closeBudgetForm = () => {
        budgetFormRef.current.resetFields();
        setModalBudgetForm(false);
    }

    const submitBudgetForm = debounce(async (e) => {
        setErrorMessage({});
        setSubmit(true);
        let formData = {
            ...e,
            purchase_request_number: `${props.addOn}${e.purchase_request_number_last}`,
            updater: "budget",
        };
        if(props.selectedFormRoute.route_type == "purchase_request"){
            try {
                await approve(props.selectedFormRoute, formData);
                closeBudgetForm();
                setErrorMessage({});
                setSubmit(false);
            } catch (error) {
                setErrorMessage(error.response.data.errors);
                setSubmit(false);
            }
        }
    }, 150);
    
    const closeProcurementForm = () => {
        procurementFormRef.current.resetFields();
        setProcurementFormType("");
        setModalProcurementForm(false);
    }

    const submitProcurementForm = debounce(async (e) => {
        setErrorMessage({});
        setSubmit(true);
        if(props.selectedFormRoute.route_type == "purchase_request"){
            let formData = {
                ...e,
                type: props.procurementFormType,
                updater: "procurement",
            }
            try {
                await approve(props.selectedFormRoute, formData);
                setSubmit(false);
                setErrorMessage({});
                closeProcurementForm();
            } catch (error) {
                setErrorMessage(error.response.data.errors);
                setSubmit(false);
            }
        }
    }, 150);
    

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
    },150);
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
    },150);
    var debouncedGetForm = React.useCallback(debounce(getFormNoLoading, 400), []);
    useEffect(() => {
        window.Echo.channel('home').listen('NewMessage', (e) => {
            if(sessionStorage.getItem("user_office") == e.message.notify_offices){
                debouncedGetForm();
            }
        });
        return () => {
            debouncedGetForm = () => {

            }
        };
    }, []);
    
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
        
            default:
                break;
        }
    }
    const resolveForm = (item, index) => {
        setSelectedFormRoute(item);
        showResolveForm(item);
    }
    const closeForm = () => {
        setSelectedFormRoute({});
    }
    

    const endUserFilter = cloneDeep(props.userSections).map(i => {
        i.value = i.id;
        return i;
    });



    const confirm = debounce(async (item) => {
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
            setSubmit(true);
            await approve(item);
            setSubmit(false);
        }
    }, 150);

    const approve = async (item, formData = {}) => {
        return api.Forms.approve(item.id, formData)
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
            return Promise.resolve(res)
        })
        .catch(err => {
            setSubmit(false);
            return Promise.reject(err)
        })
        .then(res => {})
        ;
    };

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
    const viewProcurementPlan = (id) => {
        setFormLoading(true);
        api.ProcurementPlan.get(id)
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
            title: 'Description',
            key: 'route_description',
            width: 150,
            ...onCell,
            ellipsis: true,
            render: (text, item, index) => (
                <span>
                    { item.form_process.process_description }
                </span>
            ),
        },
        {
            title: 'Form Type',
            dataIndex: 'route_type_str',
            key: 'route_type_str',
            width: 150,
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
            title: 'Title',
            key: 'title',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.title }
                </span>
            ),
            ...filter.search('title','text', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            width: 150,
            sorter: (a, b) => {},
        },
        {
            title: 'Purpose',
            key: 'purpose',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.purpose }
                </span>
            ),
            ...filter.search('purpose','text', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            width: 150,
            sorter: (a, b) => {},
        },
        {
            title: 'Amount',
            key: 'common_amount',
            ...filter.search('common_amount','number_range', setTableFilter, props.tableFilter, getForm),
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.common_amount_formatted }
                </span>
            ),
            ...onCell,
            ellipsis: true,
            width: 150,
            sorter: (a, b) => {},
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
            ...filter.list('status','text', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
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
                <span>
                    { item.status == "with_issues" ? (
                            <Tooltip placement="bottom" title={"Resolve"}>
                                <Button size='small' type='default' icon={<SendOutlined twoToneColor="#0000FF" />} onClick={() => { resolveForm(item, index) }}>
                    
                                </Button>
                            </Tooltip>
                    ) : (
                        <>
                            <Tooltip placement="bottom" title={"Approve"}>
                                <Button size='small' type='default' icon={<LikeTwoTone twoToneColor="#0000FF" />} onClick={() => { confirm(item, index) }} disabled={props.submit}>
                    
                                </Button>
                            </Tooltip>
                            {/* 
                                { item.from_office_id == item.to_office_id ? "" : (
                            */}
                            { ('ris_aprroval_from_enduser', 'aprroval_from_enduser', 'ppmp_aprroval_from_enduser').includes(props.currentRoute.description_code) ? "" : (
                                <Tooltip placement="bottom" title={"Disapprove"}>
                                    <Button size='small' type='default' icon={<DislikeTwoTone twoToneColor="#FF0000" />} onClick={() => { showRejectForm(item, index) }}>
                    
                                    </Button>
                                </Tooltip>
                            ) }
                        </>
                    ) }
                </span>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            setTableFilter(prev => ({...prev, sortColumn: filters.sortColumn, sortOrder: filters.sortOrder}));
        }
        getForm({...props.tableFilter, ...filters})
    };

    const paginationChange = async (e) => {
        // console.log(e);
        setTableFilter(prev => ({...prev, page: e}));
        getForm({...props.tableFilter, page: e})
    }

    const formatPrNumber = (e) => {
        let pr_last = e.target.value;
        let padded_pr_last = pr_last.padStart(5, '0');
        budgetFormRef.current.setFieldsValue({
            // purchase_request_number: "BUDRP-PR-"+dayjs().format("YYYY-MM-"),
            purchase_request_number_last: padded_pr_last,
        });
    }


    // const menu = (item, index) => (
    //     <Menu onClick={() => setSelectedFormRoute(item) }>
    //         <Menu.Item key="menu-view" icon={<FormOutlined />}  onClick={() => { viewForm(item, index) }}>
    //             View
    //         </Menu.Item>
    //         { item.status == "with_issues" ? (
    //                 <Menu.Item key="menu-resolve" icon={<SendOutlined twoToneColor="#0000FF" />} onClick={() => { resolveForm(item, index) }}>
    //                     Resolve
    //                 </Menu.Item>
    //         ) : (
    //             <>
    //                 <Menu.Item key="menu-approve" icon={<LikeTwoTone twoToneColor="#0000FF" />} onClick={() => { confirm(item, index) }} disabled={props.submit}>
    //                     Approve
    //                 </Menu.Item>
    //                 { item.from_office_id == item.to_office_id ? "" : (
    //                     <Menu.Item key="menu-reject" icon={<DislikeTwoTone twoToneColor="#FF0000" />} onClick={() => { showRejectForm(item, index) }}>
    //                         Disapprove
    //                     </Menu.Item>
    //                 ) }
    //             </>
    //         ) }
    //     </Menu>
    //   );
    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <Modal title="Disapproval Form" visible={modalRejectForm} 
                footer={[
                    <Button type='primary' form="rejectForm" key="submit" htmlType="submit" disabled={props.submit} loading={props.submit}>
                        Submit
                    </Button>,
                    <Button form="rejectForm" key="cancel" onClick={() => closeRejectForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={closeRejectForm}>
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
                        // rules={[{ required: true, message: 'Please add remarks' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="to_office_id"
                        label="Return to"
                        // rules={[{ required: true, message: 'Please select office.' }]}
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
                    <Button form="resolveForm" key="cancel" onClick={() => closeResolveForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={closeResolveForm}>
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
                        // rules={[{ required: true, message: 'Please add remarks' }]}
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
                    <Button form="budgetForm" key="cancel" onClick={() => closeBudgetForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={closeBudgetForm}>
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
                        // rules={[{ required: true, message: 'Please input Purchase Request Number.' }]}
                        { ...helpers.displayError(props.errorMessage, 'purchase_request_number') }
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
                        // rules={[{ required: true, message: 'Please input Fund Cluster.' }]}
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
                        // rules={[{ required: true, message: 'Please where to charge' }]}
                        { ...helpers.displayError(props.errorMessage, 'charge_to') }
                    >
                        <Input placeholder='Charge to' />
                    </Form.Item>
                    <Form.Item
                        name="alloted_amount"
                        label="Amount"
                        // rules={[{ required: true, message: 'Please enter amount' }]}
                        { ...helpers.displayError(props.errorMessage, 'alloted_amount') }
                    >
                        <Input placeholder='Amount' type="number" min={0.01} step={0.01} />
                    </Form.Item>
                    <Form.Item
                        name="uacs_code_id"
                        label="UACS Code"
                        // rules={[{ required: true, message: 'Please enter UACS Code' }]}
                        { ...helpers.displayError(props.errorMessage, 'uacs_code_id') }
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
                        // rules={[{ required: true, message: 'Please enter SA/OR' }]}
                        { ...helpers.displayError(props.errorMessage, 'sa_or') }
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
                    <Button form="procurementForm" key="cancel" onClick={() => closeProcurementForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={closeProcurementForm}
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
                            name="type"
                            label="Action"
                            // rules={[{ required: true, message: 'Please select Procurement Description.' }]}
                            { ...helpers.displayError(props.errorMessage, 'type') }
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
                            // rules={[{ required: true, message: 'Please select Technical Working Group.' }]}
                            { ...helpers.displayError(props.errorMessage, 'technical_working_group_id') }
                        >
                            <Select placeholder='Select Technical Working Groups'>
                                { props.technicalWorkingGroups.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                            </Select>
                        </Form.Item>
                    ) : "" }
                    { props.procurementFormType == "approve" ? (
                        <>
                            <Form.Item
                                name="account_classification"
                                label="Procurement Description Classification"
                                { ...helpers.displayError(props.errorMessage, 'account_classification') }
                                // rules={[{ required: true, message: 'Please select Procurement Description Classification.' }]}
                            >
                                <Select placeholder='Select Procurement Description Classification' onSelect={(e) => {
                                    procurementFormRef.current.setFieldsValue({
                                        account_id: null,
                                    });
                                    setSelectedAccountClassification(e);
                                }}>
                                    { props.accountClassifications.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                </Select>
                            </Form.Item>

                            {
                                props.selectedAccountClassification != null ? (
                                    <Form.Item
                                        name="account_id"
                                        label="Procurement Description"
                                        { ...helpers.displayError(props.errorMessage, 'account_id') }
                                        // rules={[{ required: true, message: 'Please select Procurement Description.' }]}
                                    >
                                        <Select placeholder='Select Procurement Description Classification' allowClear > 
                                            { props.accounts.filter(i => i.parent.id == props.selectedAccountClassification).map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                        </Select>
                                    </Form.Item>
                                ) : ""
                            }

                            <Form.Item
                                name="mode_of_procurement_id"
                                label="Mode of Procurement"
                                { ...helpers.displayError(props.errorMessage, 'mode_of_procurement_id') }
                                // rules={[{ required: true, message: 'Please select Mode of Procurement.' }]}
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
                                    <span><b>Amount:</b> <span>{props.selectedFormRoute.form_routable?.common_amount_formatted}</span></span><br />
                                    <span><b>Forwarded by:</b> <span>{props.selectedFormRoute.from_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.selectedFormRoute.from_office?.name}` : props.selectedFormRoute.from_office?.name }</span></span><br />
                                    <span><b>Forwarded to:</b> <span>{props.selectedFormRoute.to_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.selectedFormRoute.to_office?.name}` : props.selectedFormRoute.to_office?.name }</span></span><br />
                                    <span><b>Remarks:</b> <span>{props.selectedFormRoute.remarks}</span></span><br />
                                    { props.selectedFormRoute.forwarded_remarks ? <span><b>Remarks:</b> <span>{props.selectedFormRoute.forwarded_remarks}</span><br /></span> : ""}
                                    <span><b>Status:</b> <span>{ props.selectedFormRoute.status != "pending" ? "Disapproved" : "Pending"}</span></span><br />
                                    { props.selectedFormRoute.status != "pending" ? <span><b>Disapproved by:</b> <span>{props.selectedFormRoute.user?.user_information?.fullname}</span><br /></span> : ""}
                                    <span><b>Created:</b> <span>{ props.selectedFormRoute.created_at }</span></span><br />
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
