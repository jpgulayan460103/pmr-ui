import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography, Popconfirm, notification, Modal, Form, Input, Select } from 'antd';
import api from '../../api';
import { CloseOutlined, SelectOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { cloneDeep, debounce } from 'lodash';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;


function mapStateToProps(state) {
    return {
        user: state.user.data,
        procurementTypes: state.library.procurement_types,
        modeOfProcurements: state.library.mode_of_procurements,
        technicalWorkingGroups: state.library.technical_working_groups,
    };
}

const ListForApproval = (props) => {
    const rejectFormRef = React.useRef();
    const resolveFormRef = React.useRef();
    const budgetFormRef = React.useRef();
    const procurementFormRef = React.useRef();
    useEffect(() => {
        getForm();

        window.Echo.channel('home').listen('NewMessage', (e) => {
            getForm();
          });
    }, []);
    const [forms, setForms] = useState([]);
    const [formOutput, setFormOutput] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedForm, setSelectedForm] = useState({});
    const [modalRejectForm, setModalRejectForm] = useState(false);
    const [modalResolveForm, setModalResolveForm] = useState(false);
    const [modalBudgetForm, setModalBudgetForm] = useState(false);
    const [modalProcurementForm, setModalProcurementForm] = useState(false);
    const [routeOptions, setRouteOptions] = useState([]);
    const [formRoute, setFormRoute] = useState({});
    const [procurementFormType, setProcurementFormType] = useState("");

    const showRejectForm = (formRouteItem) => {
        setFormRoute(formRouteItem)
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

    const submitRejectForm = (val) => {
        let formData = {
            ...val,
        };
        api.Forms.reject(formRoute.id, formData)
        .then(res => {
            setModalRejectForm(false);
            getForm();
        })
        .catch(err => {})
        .then(res => {})
        ;
        // setModalRejectForm(false);
    };
    const cancelRejectForm = () => {
        setModalRejectForm(false);
    };


    const showResolveForm = (formRouteItem) => {
        setFormRoute(formRouteItem)
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

    const submitResolveForm = (val) => {
        let formData = {
            ...val,

        };
        api.Forms.resolve(formRoute.id, formData)
        .then(res => {
            setModalResolveForm(false);
            getForm();
        })
        .catch(err => {})
        .then(res => {})
        ;
        // setModalResolveForm(false);
    };
    const cancelResolveForm = () => {
        setModalResolveForm(false);
    };
    

    const getForm = () => {
        api.Forms.getForApproval()
        .then(res => {
            let response = res.data.data;
            setForms(response);
        })
        .catch(res => {})
        .then(res => {})
        ;
    }
    
    const openInFull = () => {
        window.open(`${formOutput}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }

    const viewForm = (item, index) => {
        setFormOutput(item.form_routable.file);
        setSelectedIndex(index)
    }
    const respondForm = (item, index) => {
        // setFormOutput(item.form_routable.file);
        setSelectedIndex(index)
    }
    const resolveForm = (item, index) => {
        // setFormOutput(item.form_routable.file);
        setSelectedIndex(index);
        showResolveForm(item);
    }
    const closeForm = () => {
        setFormOutput("");
        setSelectedIndex(null);
    }

    const cancelBudgetForm = () => {
        setModalBudgetForm(false);
    }
    const submitBudgetForm = async (e) => {
        let formData = {
            ...e,
            id: selectedForm.form_routable.id
        };
        if(selectedForm.route_type == "purchase_request"){
            await api.PurchaseRequest.save(formData, 'update');
            await approve(selectedForm);
            setModalBudgetForm(false);
        }
        // console.log(selectedForm);
    }
    
    const cancelProcurementForm = () => {
        setModalProcurementForm(false);
    }
    const submitProcurementForm = debounce(async (e) => {
        if(selectedForm.route_type == "purchase_request"){
            if(procurementFormType == "approve"){
                let formData = {
                    ...e,
                    id: selectedForm.form_routable.id
                };
                await api.PurchaseRequest.save(formData, 'update');
                await approve(selectedForm);
            }else if(procurementFormType == "twg"){
                let formData = {
                    ...e,
                    id: selectedForm.form_process.id,
                    type: procurementFormType,
                }
                await api.Forms.updateProcess(formData);
                await approve(selectedForm);
            }
            setModalProcurementForm(false);
        }
        // console.log(selectedForm);
    }, 150);
    const confirm = debounce((item) => {
        setSelectedForm(item);
        let current_route = item.form_process.form_routes.filter(i => i.status == "pending");

        let procurement_signatory = props.user.signatories.filter(i => i.office.title == "PS");
        let budget_signatory = props.user.signatories.filter(i => i.office.title == "BS");

        if(procurement_signatory.length != 0 && current_route[0].description_code == "select_action"){
            setModalProcurementForm(true);
        }else if(budget_signatory.length != 0  && current_route[0].description_code == "aprroval_from_budget"){
            setModalBudgetForm(true);
            setTimeout(() => {
                budgetFormRef.current.setFieldsValue({
                    alloted_amount: item.form_routable.common_amount,
                });
            }, 150);
        }else{
            approve(item);
        }
    }, 150)

    const approve = debounce(async (item) => {
        api.Forms.approve(item.id)
        .then(res => {
            notification.success({
                message: 'Purchase Request is approved.',
                description:
                    'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
                }
            );
            getForm();
        })
        .catch(err => {})
        .then(res => {})
        ;
    }, 150);

    const actionTypeProcurement = (e) => {
        setProcurementFormType(e);
    }

    const dataSource = forms
      
    const columns = [
        {
            title: 'Form Type',
            dataIndex: 'route_type_str',
            key: 'route_type_str',
        },
        {
            title: 'Particulars',
            key: 'particulars',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.particulars }
                </span>
            )
        },
        {
            title: 'End User',
            key: 'end_user',
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            )
        },
        {
            title: 'Status',
            key: 'status',
            render: (text, item, index) => (
                <span>
                    { item.status != "pending" ? (
                        <span>
                            <span>Status: <b>Disapproved</b></span><br />
                            <span>Disapproved by: <b>{item.user?.user_information?.fullname}</b></span><br />
                            <span>From: <b>{item.from_office.name}</b></span><br />
                            <span>Remarks: <b>{item.remarks}</b></span><br />
                        </span>
                    ) : (
                        <span>
                            <span>Status: <b>Pending</b></span><br />
                            <span>Remarks: <b>{item.remarks}</b></span><br />
                        </span>
                    ) }
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, item, index) => (
                <Space size={2}>
                    <span className='custom-pointer' onClick={() => { viewForm(item, index) }}>View</span>
                    <Divider type="vertical" />
                    { item.status == "with_issues" ? (
                        <span className='custom-pointer' onClick={() => { resolveForm(item, index) }}>Resolve</span>
                    ) : (
                        <Popconfirm icon="" title="" okText="Approve" cancelText="Disapprove" onConfirm={() => confirm(item) } onCancel={() => { showRejectForm(item, index) }}>
                            <span className='custom-pointer' onClick={() => { respondForm(item, index) }}>Respond</span>
                        </Popconfirm>
                    ) }
                </Space>
            )
        },
    ];
    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <Modal title="Disapproval Form" visible={modalRejectForm} 
                footer={[
                    <Button type='primary' form="rejectForm" key="submit" htmlType="submit">
                        Submit
                    </Button>,
                    <Button form="rejectForm" key="cancel" onClick={() => cancelRejectForm()}>
                        Cancel
                    </Button>
                    ]}>
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
                            { routeOptions.map((item, index) => <Option value={item.office_id} key={index}>{item.office_name}</Option> ) }
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>

            <Modal title="Resolve Form" visible={modalResolveForm} 
                footer={[
                    <Button type='primary' form="resolveForm" key="submit" htmlType="submit">
                        Submit
                    </Button>,
                    <Button form="resolveForm" key="cancel" onClick={() => cancelResolveForm()}>
                        Cancel
                    </Button>
                    ]}>
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
                    <Button type='primary' form="budgetForm" key="submit" htmlType="submit">
                        Submit
                    </Button>,
                    <Button form="budgetForm" key="cancel" onClick={() => cancelBudgetForm()}>
                        Cancel
                    </Button>
                    ]}>
                <Form
                    ref={budgetFormRef}
                    name="normal_login"
                    className="login-form"
                    onFinish={(e) => submitBudgetForm(e)}
                    layout='vertical'
                    id="budgetForm"
                >

                    <Form.Item
                        name="fund_cluster"
                        label="Fund Cluster"
                        // rules={[{ required: true, message: 'Please input Fund Cluster.' }]}
                        // { ...showErrorMessage() }
                    >
                        <Input placeholder="Fund Cluster" />
                    </Form.Item>

                    <Form.Item
                        name="center_code"
                        label="Responsibility Center Code"
                        // rules={[{ required: true, message: 'Please input Responsibility Center Code.' }]}
                        // { ...showErrorMessage() }
                    >
                        <Input placeholder="Responsibility Center Code" />
                    </Form.Item>
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
                        <Input placeholder='Amount' type="number" min={1} />
                    </Form.Item>
                    <Form.Item
                        name="uacs_code"
                        label="UACS Code"
                        rules={[{ required: true, message: 'Please enter UACS Code' }]}
                    >
                        <Input placeholder='UACS CODE' />
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
                    procurementFormType !="" ? (<Button type='primary' form="procurementForm" key="submit" htmlType="submit">
                        Submit
                    </Button>) : ""
                    ,
                    <Button form="procurementForm" key="cancel" onClick={() => cancelProcurementForm()}>
                        Cancel
                    </Button>
                    ]}>
                <Form
                    ref={procurementFormRef}
                    name="normal_login"
                    className="login-form"
                    onFinish={(e) => submitProcurementForm(e)}
                    layout='vertical'
                    id="procurementForm"
                >

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

                    { procurementFormType == "twg" ? (
                        <Form.Item
                            name="technical_working_group_id"
                            label="Technical Working Groups"
                            // rules={[{ required: true, message: 'Please select Procurement Type.' }]}
                        >
                            <Select placeholder='Select Technical Working Groups'>
                                { props.technicalWorkingGroups.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                            </Select>
                        </Form.Item>
                    ) : "" }
                    { procurementFormType == "approve" ? (
                        <>
                            <Form.Item
                                name="purchase_request_type_id"
                                label="Procurement Type"
                                // rules={[{ required: true, message: 'Please select Procurement Type.' }]}
                            >
                                <Select placeholder='Select Procurement Type'>
                                    { props.procurementTypes.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="mode_of_procurement_id"
                                label="Procurement Type"
                                // rules={[{ required: true, message: 'Please select Procurement Type.' }]}
                            >
                                <Select placeholder='Select Mode of Procurement'>
                                    { props.modeOfProcurements.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                </Select>
                            </Form.Item>
                        </>
                    ) : "" }
                                        
                </Form>
            </Modal>


            <div className='col-md-8'>
                <Title level={2} className='text-center'>Forms</Title>
                <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                    if(selectedIndex == index){
                        return "selected-row";
                    }
                }}
                size={"small"}
                />
            </div>
            <div className='col-md-4'>
                { formOutput == "" ? "" : 
                    (
                        <div>
                            <div className='text-right'>
                                <Button size='large' type='primary' onClick={() => openInFull() }><SelectOutlined /></Button>
                                <Button size='large' type='danger' onClick={() => closeForm() }><CloseOutlined /></Button>
                            </div>
                        </div>
                    )
                }
                {
                    formOutput == "" ? "" : (<iframe src={`${formOutput}?view=1`} width="100%" height="100%"></iframe>) 
                }
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ListForApproval);
