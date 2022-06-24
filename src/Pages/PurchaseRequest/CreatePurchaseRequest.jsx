import React, { useState, useEffect } from 'react';
import style from './style.less'
import { debounce, isEmpty, cloneDeep } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, Typography, Form, notification, Modal, Row, Col, Tooltip  } from 'antd';
import Icon, { PlusOutlined, DeleteOutlined, SaveOutlined, FolderViewOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import moment from 'moment';
import helpers from '../../Utilities/helpers';

function mapStateToProps(state) {
    return {
        unit_of_measures: state.libraries.unit_of_measures,
        items: state.libraries.items,
        user_sections: state.libraries.user_sections,
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
    useEffect(() => {
        if(props.isInitialized){
            if(props.formData.end_user_id){
                setTableKey(props.formData.items.length);
            }else{
                if(!isEmpty(props.user)){
                    let reqBy = "OARDA";
                    if(props.user.user_offices?.data[0]?.office?.parent?.title === "OARDA" || props.user.user_offices?.data[0]?.office?.parent?.title === "OARDO"){
                        reqBy = props.user.user_offices.data[0].office.parent.title;
                    }
                    props.dispatch({
                        type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
                        data: {
                            ...props.formData,
                            end_user_id: props.user.user_offices?.data[0]?.office_id,
                            requestedBy: reqBy
                        }
                    });
                }
            }
            if(isEmpty(props.requestedBySignatory)){
                let reqBy = "OARDA";
                if(props.user.user_offices?.data[0]?.office?.parent?.title === "OARDA" || props.user.user_offices?.data[0]?.office?.parent?.title === "OARDO"){
                    reqBy = props.user.user_offices?.data[0]?.office?.parent?.title;
                }
                setSignatory(reqBy,'requestedBy');
            }
            if(isEmpty(props.approvedBySignatory)){
                setSignatory("ORD", 'approvedBy');
            }
            if(props.formType == "update"){
                setSignatory(props.formData.requestedBy, 'requestedBy');
                setSignatory(props.formData.approvedBy, 'approvedBy');
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
        formData.requested_by_id = props.requestedBySignatory.id;
        formData.approved_by_id = props.approvedBySignatory.id;
        if(props.formType == "update"){

        }else{
            formData.purpose = `For the implementation of ${props.formData.purpose}`;
        }
        api.PurchaseRequest.save(formData,props.formType)
        .then(res => {
            setSubmit(false);
            notification.success({
                message: 'Purchase Request is successfully saved.',
                description:
                    'Please wait for approval from your unit/section head.',
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
        props.dispatch({
            type: "RESET_PURCHASE_REQUEST_CREATE_FORM_DATA",
            data: {
                end_user_id: props.user.user_offices.data[0].office_id,
            }
        });
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_TYPE",
            data: "create"
        });
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
            data: {}
        });

        setSignatory("OARDA",'requestedBy');
        setSignatory("ORD", 'approvedBy');
    }

    const previewPurchaseRequest = debounce(() => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
            data: {}
        });
        let formData = cloneDeep(props.formData);
        formData.requested_by_id = props.requestedBySignatory.id;
        formData.approved_by_id = props.approvedBySignatory.id;
        api.PurchaseRequest.preview(formData,"create")
        .then(res => {
            let json = encodeURIComponent(JSON.stringify(formData));
            window.open(`${res.data.url}?json=${json}`,
                'newwindow',
                'width=960,height=1080');
            return false;
        })
        .catch(err => {
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
                data: err.response.data.errors
            });
        })
        .then(res => {})
        ;
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

    const setSignatory = (e, type) => {
        if(type == "requestedBy"){
            let user_office = props.user_signatory_names.filter(i => i.title == e);
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_REQUESTED_BY_SIGNATORY",
                data: user_office[0]
            });
        }else{
            let user_office = props.user_signatory_names.filter(i => i.title == e);
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_APPROVED_BY_SIGNATORY",
                data: user_office[0]
            });
        }
    }
    
    return (
        <div id="pr-container" className='container-fuild bg-white p-16'>
            {/* <p className="text-right ...">Appendix 60</p> */}
            {/* <p className="text-center ..."><b>PURCHASE REQUEST</b></p> */}
            <Title className='text-center' level={3}>PURCHASE REQUEST</Title>
            <Form layout='vertical'>
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Office/Section">
                        <Input placeholder="input placeholder" readOnly value={props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Form.Item label="Title" { ...helpers.displayError(props.formErrors, `title`) }>
                            <Input placeholder="Title"  onChange={(e) => changeFieldValue(e, 'title')} value={props.formData.title} />
                        </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Date">
                        <Input placeholder="input placeholder" value={moment().format('MM/DD/YYYY')} />
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
                                {/* <Input placeholder="Type here..." onChange={(e) => changeTableFieldValue(e.target.value, item, 'item_code', index) } value={item.item_code} disabled /> */}
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
                                    onChange={(e) => selectUnit(e, index)}
                                    style={{ width: "100%" }}
                                    // disabled={  }/*  */
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
                                        onChange={(e) => {
                                            changeTableFieldValue(e, {}, 'item_name', index);
                                        }}
                                        value={item.item_name}
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
                                <Input type="number" className='text-center' min={1} autoComplete='off' style={{ width: "100%" }} placeholder="Quantity" onChange={(e) => changeTableFieldValue(e.target.value, item, 'quantity', index) } value={item.quantity} />
                            </Form.Item>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                            <div>
                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.unit_cost`) }>
                                <Input type="number"  className='text-right' autoComplete='off' style={{ width: "100%" }} step="0.01" placeholder="Unit Cost"  onChange={(e) => changeTableFieldValue(e.target.value, item, 'unit_cost', index) } value={item.unit_cost} />
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
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Purpose" { ...helpers.displayError(props.formErrors, `purpose`) }>
                        <Input addonBefore={props.formType == 'update' ? "" : "For the implementation of "} onChange={(e) => changeFieldValue(e, 'purpose')} value={props.formData.purpose} />
                        {/* <TextArea addonBefore="+" autoSize placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'purpose')} value={props.formData.purpose} /> */}
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Requested by" { ...helpers.displayError(props.formErrors, `requested_by_id`) }>
                        <Select style={{ width: "100%" }} onSelect={(e) => { changeFieldValue(e, 'requestedBy', false); setSignatory(e,'requestedBy') }} value={props.formData.requestedBy} placeholder="Select Signatory">
                            { props.user_signatory_designations.filter(i => i.title == "OARDA" || i.title == "OARDO").map(i => <Option value={i.title} key={i.key}>{ i.name }</Option>) }
                        </Select>
                    </Form.Item>
                    <p className='text-center'><b>{ props.requestedBySignatory?.name }</b></p>
                    <p className='text-center'>{ props.requestedBySignatory?.parent?.name }</p>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item  label="Approved by" { ...helpers.displayError(props.formErrors, `approved_by_id`) }>
                        <Select style={{ width: "100%" }} onSelect={(e) => { changeFieldValue(e, 'approvedBy', false); setSignatory(e, 'approvedBy') }} value={props.formData.approvedBy} placeholder="Select Signatory">
                            { props.user_signatory_designations.filter(i => i.title == "ORD").map(i => <Option value={i.title} key={i.name}>{ i.name }</Option>) }
                        </Select>
                    </Form.Item>
                    <p className='text-center'><b>{ props.approvedBySignatory?.name }</b></p>
                    <p className='text-center'>{ props.approvedBySignatory?.parent?.name }</p>
                </Col>
            </Row>

            </Form>
            <div className='text-center space-x-2'>
                
                <br />

                { props.formType == "create" ? (
                    <Button type="default" onClick={() => previewPurchaseRequest()}><FolderViewOutlined />Preview</Button>
                ) : ""}
                <Button type="primary" onClick={() => savePurchaseRequest()} disabled={submit} loading={submit}><SaveOutlined />
                    { props.formType == "create" ? "Create Purchase Request" : "Update Purchase Request"}
                </Button>
                <Button type="danger" onClick={() => clearForm()}><DeleteOutlined />
                    { props.formType == "create" ? "Reset Form" : "Clear Form and Create New"}
                </Button>

            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(CreatePurchaseRequest);