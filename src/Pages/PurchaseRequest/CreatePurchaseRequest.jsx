import React, { useState, useEffect } from 'react';
import style from './style.less'
import { debounce, isEmpty, cloneDeep } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, Typography, Form, notification, Modal, Row, Col, Tooltip, InputNumber  } from 'antd';
import Icon, { PlusOutlined, DeleteOutlined, SaveOutlined, FolderViewOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import moment from 'moment';
import helpers from '../../Utilities/helpers';
import { RouterPrompt } from '../../Components/RouterPrompt';
import { useHistory } from 'react-router-dom'

function mapStateToProps(state) {
    return {
        unit_of_measures: state.libraries.unit_of_measures,
        items: state.libraries.items,
        user_sections: state.libraries.user_sections,
        user_section_signatories: state.libraries.user_section_signatories,
        user_divisions: state.libraries.user_divisions,
        user_signatory_designations: state.libraries.user_signatory_designations,
        user_signatory_names: state.libraries.user_signatory_names,
        formData: state.purchaseRequests.create.formData,
        formType: state.purchaseRequests.create.formType,
        formErrors: state.purchaseRequests.create.formErrors,
        formProccess: state.purchaseRequests.create.formProccess,
        requestedBySignatory: state.purchaseRequests.create.requestedBySignatory,
        approvedBySignatory: state.purchaseRequests.create.approvedBySignatory,
        user: state.user.data,
        isInitialized: state.user.isInitialized,
    };
}

const { TextArea } = Input;
const { Option, OptGroup } = Select;
const { Title } = Typography;

const CreatePurchaseRequest = (props) => {
    let history = useHistory();
    const formRef = React.useRef();
    useEffect(() => {
        if(props.isInitialized){
            if(props.formData.end_user_id){
                setTableKey(props.formData.items.length);
                setTimeout(() => {
                    formRef.current.setFieldsValue(props.formData);
                }, 150);
            }else{
                if(!isEmpty(props.user)){
                    initiailzeForm();
                }
            }
            if(isEmpty(props.items)){
                getItems();
            }
        }
    }, [props.isInitialized]);
    useEffect(() => {
        document.title = "Create Purchase Request";
        return function cleanup() {
            if(props.formType == "update"){
                clearForm();
            }
        };
    }, []);
    
    const [tableKey, setTableKey] = useState(0);
    const [submit, setSubmit] = useState(false);

    const initiailzeForm = () => {
        let formData = {
            end_user_id: props.user.user_offices?.data[0]?.office_id,
            purpose: "For the implementation of ",
        };
        props.dispatch({
            type: "RESET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: formData
        });
        if(formRef.current){
            formRef.current?.setFieldsValue(formData);
        }
    }

    const getItems = async () => {
        return api.Library.getLibraries('items')
        .then(res => {
            let items = res.data.data;
            items = items.filter(i => i.is_active);
            props.dispatch({
                type: "SET_LIBRARY_ITEMS",
                data: items
            });
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const savePurchaseRequest = debounce(() => {
        setSubmit(true);
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
            data: {}
        });
        let formData = cloneDeep(props.formData);
        api.PurchaseRequest.save(formData,props.formType)
        .then(res => {
            setSubmit(false);
            notification.success({
                message: 'Purchase Request is successfully saved.',
                description: props.formType == "create" ?
                    'Please wait for approval from your unit/section head.' :
                    '',
                }
            );

            clearForm();
        })
        .catch(err => {
            setSubmit(false);
            if(err.response.status == "422"){
                props.dispatch({
                    type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
                    data: err.response.data.errors
                });
    
                if(err.response.data.errors.items){
                    Modal.error({
                        title: 'Purchase Request creation failed',
                        content: (
                          <div>
                            <p>Please add items on the purchase request.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }else if(err.response.data.errors.requisition_issue_id){
                    Modal.error({
                        title: 'Purchase Request update failed',
                        content: (
                          <div>
                            <p>No Requisition and Issue Slip (RIS) selected.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }else if(err.response.data.errors.update_error){
                    Modal.error({
                        title: 'Purchase Request update failed',
                        content: (
                          <div>
                            <p>Unable to update. Purchase Request is already approved by the budget section.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }else{
                    Modal.error({
                        title: 'Purchase Request creation failed',
                        content: (
                          <div>
                            <p>Please review the form before saving.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }
            }
        })
        .then(res => {})
        ;
    }, 200);

    const clearForm = async () => {
        if(formRef.current){
            formRef.current?.resetFields();
        }
        initiailzeForm();
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_TYPE",
            data: "create"
        });
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
            data: {}
        });
    }

    const previewPurchaseRequest = debounce(() => {
        // props.dispatch({
        //     type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
        //     data: {}
        // });
        // let formData = cloneDeep(props.formData);
        // formData.requested_by_id = props.requestedBySignatory.id;
        // formData.approved_by_id = props.approvedBySignatory.id;
        // api.PurchaseRequest.preview(formData,"create")
        // .then(res => {
        //     let json = encodeURIComponent(JSON.stringify(formData));
        //     window.open(`${res.data.url}?json=${json}`,
        //         'newwindow',
        //         'width=960,height=1080');
        //     return false;
        // })
        // .catch(err => {
        //     props.dispatch({
        //         type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
        //         data: err.response.data.errors
        //     });
        // })
        // .then(res => {})
        // ;
    }, 200);


    const addItem = () => {
        setTableKey(tableKey + 1);
        let newValue = {
            key: tableKey + 1,
            item_code: null,
            // item_code: props.formData.items.length + 1,
            unit_of_measure_id: null,
            item_name: null,
            quantity: 1,
            unit_cost: 0,
            total_unit_cost: 0,
            is_ppmp: false,
            item_id: null,
        };
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: [...props.formData.items, newValue]
            }
        });
    }

    const deleteItem = (key) => {
        let newValue = props.formData.items.filter(item => item.key !== key)
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }
        });
    }

    const changeFieldValue = (e, field, target = true) => {
        // console.log(e, field);
        let value = e;
        if(target){
            value = e.target.value;
        }
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                [field]: value
            }
        });
    }

    const changeTableFieldValue = (e, item, field, index) => {
        let value = e;
        let newValue = cloneDeep(props.formData.items);
        switch (field) {
            case 'unit_cost':
                // value = isNaN(value) ? 1 : parseFloat(value);
                newValue[index]["total_unit_cost"] = value * newValue[index]["quantity"];
                break;
            case 'quantity':
                value =  isNaN(value) ? 1 : parseInt(value);
                newValue[index]["total_unit_cost"] = newValue[index]["unit_cost"] * value;
                break;
        
            default:
                break;
        }
        newValue[index][field] = value;
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }
        });
    }


    const selectUnit = (value, index) => {
        changeTableFieldValue(value, {}, 'unit_of_measure_id', index);
    }

    const selectItem = (value, item, index) => {
        let newValue = cloneDeep(props.formData.items);
        newValue[index]["item_code"] = item.item_code;
        newValue[index]["unit_of_measure_id"] = item.unit_of_measure.id;
        newValue[index]["is_ppmp"] = item.is_ppmp;
        newValue[index]["in_libraries"] = true;
        newValue[index]["item_name"] = value;
        newValue[index]["item_id"] = item.id;
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }
        });
    }

    const total_cost = () => {
        return props.formData.items.reduce((sum, item) => {
            return sum += (item.quantity * item.unit_cost);
        }, 0);
    }

    const changeRequestedBy = (e) => {
        let requestedSignatory = props.user_section_signatories.filter(item => item.id == e);
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                requested_by_id: e,
                requested_by_name: requestedSignatory[0].name,
                requested_by_designation: requestedSignatory[0].title,
                requested_by_office: requestedSignatory[0].parent.title,
            }
        });
    }
    const changeApprovedBy = (e) => {
        let approvedSignatory = props.user_section_signatories.filter(item => item.id == e);
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                approved_by_id: e,
                approved_by_name: approvedSignatory[0].name,
                approved_by_designation: approvedSignatory[0].title,
                approved_by_office: approvedSignatory[0].parent.title,
            }
        });
    }
    
    return (
        <div id="pr-container" className='container-fuild bg-white p-16'>
            <RouterPrompt
                when={props.formType == "update"}
                title="Leave this form?"
                content="There are unsaved changes, do you wish to discard them?"
                type="confirm"
                cancelText="Cancel"
                okText="Confirm"
                onOK={() => true}
                onCancel={() => false}
                hasConfirm={false}
            />
            <p className="text-right ...">Appendix 60</p>
            <Title className='text-center' level={3}>PURCHASE REQUEST</Title>
            <Form layout='vertical' ref={formRef}>
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Office/Section">
                        <Input placeholder="input placeholder" value={props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Title" { ...helpers.displayError(props.formErrors, `title`) } name="title">
                        <Input placeholder="Title"  onBlur={(e) => changeFieldValue(e, 'title')} />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Date">
                        <Input placeholder="input placeholder" value={props.formData.pr_date} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 8]} className="pr-items-header">
                <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    <div className='text-center'>
                        <b>Stock/ Property No.</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                    <div className='text-center'>
                        <b>Unit</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <div className='text-center'>
                        <b>Item Description</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                    <div className='text-center'>
                        <b>Quantity</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                    <div className='text-center'>
                        <b>Unit Cost</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                    <div className='text-center'>
                        <b>Total Cost</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={1} lg={1} xl={1}>
                    <div  className='text-right'>
                        <Tooltip placement="left" title={"Add Item"}>
                            <Button type="primary" onClick={() => { addItem() } }><PlusOutlined /></Button>
                        </Tooltip>
                    </div>
                </Col>
            </Row>
            { isEmpty(props.formData.items) && (
                <Row gutter={[8, 8]} className="pr-items-row">
                    <Col span={24}>
                        <div className='text-center mb-3'>
                            Please add items before saving the form. Click <Button type="primary" onClick={() => { addItem() } }><PlusOutlined /></Button> button to add item.
                        </div>
                    </Col>
                </Row>
            ) }
            {
                props.formData.items.map((item, index) => (
                    <Row gutter={[8, 8]}  key={item.key} className="pr-items-row">
                        <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                            <div className='text-center'>
                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.item_code`) }>
                                { item.item_code }
                            </Form.Item>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                            <div className='text-center'>
                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.unit_of_measure_id`) }>
                                { item.item_id ? props.unit_of_measures.filter(i => i.id == item.unit_of_measure_id)[0].name : (<Select
                                    showSearch
                                    value={item.unit_of_measure_id}
                                    placeholder="Select a Unit"
                                    optionFilterProp="children"
                                    onSelect={(e) => selectUnit(e, index)}
                                    style={{ width: "100%" }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    { props.unit_of_measures.map((option, index) => (
                                        <Option value={option.id} key={option.id}>{option.name}</Option>
                                    )) }
                                </Select>) }
                            </Form.Item>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.item_name`) }>
                                { item.item_id ? item.item_name : (
                                    <AutoComplete
                                        style={{ width: "100%" }}
                                        allowClear
                                        options={props.items}
                                        onSelect={(val, item) => selectItem(val, item, index)}
                                        placeholder="Item Description"
                                        filterOption={(input, option) =>
                                            option.item_name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onBlur={(e) => {
                                            // console.log(e);
                                            changeTableFieldValue(e.target.value, {}, 'item_name', index);
                                        }}
                                        defaultValue={item.item_name}
                                    >
                                        <TextArea autoSize />
                                    </AutoComplete>
                                ) }
                            </Form.Item>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.quantity`) }>
                                <InputNumber style={{width: "100%"}} min={0} onBlur={(e) => changeTableFieldValue(e.target.value, item, 'quantity', index)}  defaultValue={item.quantity}  placeholder="Quantity" />
                            </Form.Item>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                            <div>
                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.unit_cost`) }>
                                <InputNumber style={{width: "100%"}} step={0.01} min={0} onBlur={(e) => changeTableFieldValue(e.target.value, item, 'unit_cost', index) } defaultValue={item.unit_cost}  placeholder="Quantity" />
                            </Form.Item>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                            <div  className='text-right'>
                                { new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format( (item.unit_cost * item.quantity) ) }
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}>
                            <div  className='text-right'>
                                <Tooltip placement="left" title={"Remove Item"}>
                                    <Button type="danger" onClick={() => deleteItem(item.key)}><DeleteOutlined /></Button>
                                </Tooltip>
                            </div>
                        </Col>
                    </Row>
                ))
            }
            <Row gutter={[8, 8]} className="pr-items-footer">
                <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    <div className='text-center'>
                        <b></b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                    <div className='text-center'>
                        <b></b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <div className='text-center'>
                        <b></b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                    <div className='text-center'>
                        <b></b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                    <div className='text-center'>
                        <b>Total</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                    <div className='text-right'>
                        <b>{ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(  total_cost() )}</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={1} lg={1} xl={1}>
                    <div  className='text-right'>
                        
                    </div>
                </Col>
            </Row>
            <br />
            <br />
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item label="Purpose" { ...helpers.displayError(props.formErrors, `purpose`) } name="purpose">
                        <Input onBlur={(e) => changeFieldValue(e, 'purpose')} placeholder="Purpose" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>

                    <Form.Item label="Requested by" { ...helpers.displayError(props.formErrors, `requested_by_name`) }>
                        <Select style={{ width: "100%" }} onSelect={changeRequestedBy} value={props.formData.requested_by_id} placeholder="Select Signatory" optionLabelProp="label">
                            { props.user_section_signatories.filter(item => item.parent.title == "OARDA" || item.parent.title == "OARDO").map(i => (
                                <Option value={i.id} key={i.key} label={ i.name }>
                                    <div className="demo-option-label-item">
                                        { i.parent.name }
                                    </div>
                                </Option>
                            )) }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Designation" { ...helpers.displayError(props.formErrors, `requested_by_designation`) }>
                        <Input value={props.formData.requested_by_designation} placeholder="Designation" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>

                    <Form.Item label="Approved by" { ...helpers.displayError(props.formErrors, `approved_by_name`) }>
                        <Select style={{ width: "100%" }} onSelect={changeApprovedBy} value={props.formData.approved_by_id} placeholder="Select Signatory" optionLabelProp="label">
                            { props.user_section_signatories.filter(item => item.parent.title == "ORD").map(i => (
                                <Option value={i.id} key={i.key} label={ i.name }>
                                    <div className="demo-option-label-item">
                                        { i.parent.name }
                                    </div>
                                </Option>
                            )) }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Designation" { ...helpers.displayError(props.formErrors, `approved_by_designation`) }>
                        <Input value={props.formData.approved_by_designation} placeholder="Designation" />
                    </Form.Item>
                </Col>
            </Row>

            </Form>
            <div className='text-center space-x-2'>
                
                <br />

                {/* { props.formType == "create" ? (
                    <Button type="default" onClick={() => previewPurchaseRequest()}><FolderViewOutlined />Preview</Button>
                ) : ""} */}
                { !props.formData.requisition_issue_file ? (
                    <Button type="default" onClick={() => history.push("/requisition-and-issues")} disabled={submit} loading={submit}><SaveOutlined />
                        Select Requistion and Issue Slip
                    </Button>
                ) : (
                    <Button type="primary" onClick={() => savePurchaseRequest()} disabled={submit} loading={submit}><SaveOutlined />
                        { props.formType == "create" ? "Create Purchase Request" : "Update Purchase Request"}
                    </Button>
                ) }
                <Button type="danger" onClick={() => clearForm()}><DeleteOutlined />
                    { props.formType == "create" ? "Reset Form" : "Clear Form and Create New"}
                </Button>

            </div>
            { props.formData.requisition_issue_file && (
                <div className='forms-card-form-content mt-6'>
                    <iframe src={`${props.formData.requisition_issue_file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                </div>
            )  }
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(CreatePurchaseRequest);