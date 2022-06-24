import React, { useState, useEffect } from 'react';
import { useHistory  } from 'react-router-dom'
import style from './style.less'
import { debounce, isEmpty, cloneDeep, map } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, Typography, Form, notification, Modal, Row, Col, Tooltip, Badge, DatePicker, Switch  } from 'antd';
import Icon, { PlusOutlined, DeleteOutlined, DoubleLeftOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import moment from 'moment';
import helpers from '../../Utilities/helpers';

const { TextArea } = Input;
const { Option, OptGroup } = Select;
const { Title } = Typography;

function mapStateToProps(state) {
    return {
        unit_of_measures: state.libraries.unit_of_measures,
        items: state.libraries.items,
        item_categories: state.libraries.item_categories,
        item_types: state.libraries.item_types,
        user_section_signatories: state.libraries.user_section_signatories,
        procurement_plan_types: state.libraries.procurement_plan_types,
        user_sections: state.libraries.user_sections,
        user_divisions: state.libraries.user_divisions,
        user_positions: state.libraries.user_positions,
        user_signatory_designations: state.libraries.user_signatory_designations,
        user_signatory_names: state.libraries.user_signatory_names,
        formData: state.requisitionIssues.create.formData,
        formType: state.requisitionIssues.create.formType,
        formErrors: state.requisitionIssues.create.formErrors,
        user: state.user.data,
        isInitialized: state.user.isInitialized,
    };
}

const CreateRequisitionIssue = (props) => {
    let history = useHistory();
    useEffect(() => {
        if(props.isInitialized){
            setItemTypeA(props.item_types[0].id);
            setItemTypeB(props.item_types[1].id);
            if(props.formData.end_user_id){
                if(props.formData.from_ppmp == 1){
                    getPpmpItems();
                }
                setTableKey(props.formData.items.length);
            }else{
                if(!isEmpty(props.user)){
                    let position = props.user_positions.filter(position => position.key == props.user.user_information?.position_id);
                    props.dispatch({
                        type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
                        data: {
                            ...props.formData,
                            end_user_id: props.user.user_offices?.data[0]?.office_id,
                            procurement_plan_type_id: props.procurement_plan_types[0].id,
                            // item_type_id: props.item_types[0].id,
                            prepared_by_name: props.user.user_information?.fullname?.toUpperCase(),
                            requested_by_position: "Division Chief",
                            // from_ppmp: 0,
                            ris_date: dayjs().format('YYYY-MM-DD'),
                        }
                    });
                }
            }
            if(isEmpty(props.items)){
                getItems();
                // getPpmpItems();
            }
        }
    }, [props.isInitialized]);
    useEffect(() => {
        document.title = "Create Requisition and Issue Slip";
    }, []);

    const [tableKey, setTableKey] = useState(0);
    const [submit, setSubmit] = useState(false);
    const [itemTypeA, setItemTypeA] = useState(null);
    const [itemTypeB, setItemTypeB] = useState(null);
    const [items, setItems] = useState([]);


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
    const getPpmpItems = async () => {
        return api.ProcurementPlan.management()
        .then(res => {
            let responseItems = res.data.items.data;
            setItems(responseItems);
        })
        .catch(res => {})
        .then(res => {})
    }
    

    const approveForm = async (id, formData) => {
        return api.Forms.approve(id, formData)
        .then(res => {
            let alertMessage = res.data.alert_message;
            notification.success({
                message: `${alertMessage.message} ${alertMessage.status}`,
                description: alertMessage.action_taken,
            });
            return Promise.resolve(res)
        })
        .catch(err => {
            setSubmit(false);
            return Promise.reject(err)
        })
        .then(res => {})
        ;
    }
    

    const saveRequisitionIssue = () => {
        setSubmit(true);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
            data: {}
        });
        let formData = cloneDeep(props.formData);
        api.RequisitionIssue.save(formData,props.formType)
        .then(res => {
            setSubmit(false);
            notification.success({
                message: 'Requisition and Issue Slip is successfully saved.',
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
                    type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
                    data: err.response.data.errors
                });
    
                if(err.response.data.errors.items){
                    Modal.error({
                        title: 'Requisition and Issue creation failed',
                        content: (
                          <div>
                            <p>Please add items on the Requisition and Issue.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }else if(err.response.data.errors.update_error){
                    Modal.error({
                        title: 'Requisition and Issue Slip update failed',
                        content: (
                          <div>
                            <p>Unable to update. Requisition and Issue Slip is already approved by the budget section.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }else{
                    Modal.error({
                        title: 'Requisition and Issue Slip creation failed',
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
    }

    const handleSave = debounce(async () => {
        if(props.formType == "issue"){
            try {
                let formData = cloneDeep(props.formData);
                await approveForm(props.formData.form_route_id, formData);
                history.push("/forms/forwarded");
                clearForm();
                setSubmit(false);
            } catch (err) {
                setSubmit(false);
                console.log(err);
                if(err.response.status == "422"){
                    props.dispatch({
                        type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
                        data: err.response.data.errors
                    });
        
                    if(err.response.data.errors.items){
                        Modal.error({
                            title: 'Requisition and Issue creation failed',
                            content: (
                              <div>
                                <p>Please add items on the Requisition and Issue.</p>
                              </div>
                            ),
                            onOk() {},
                          });
                    }else if(err.response.data.errors.update_error){
                        Modal.error({
                            title: 'Requisition and Issue Slip update failed',
                            content: (
                              <div>
                                <p>Unable to update. Requisition and Issue Slip is already approved by the budget section.</p>
                              </div>
                            ),
                            onOk() {},
                          });
                    }else{
                        Modal.error({
                            title: 'Requisition and Issue Slip creation failed',
                            content: (
                              <div>
                                <p>Please review the form before saving.</p>
                              </div>
                            ),
                            onOk() {},
                          });
                    }
                }
            }
        }else{
            saveRequisitionIssue();
        }
    }, 200);


    const clearForm = async () => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                end_user_id: props.user.user_offices?.data[0]?.office_id,
                procurement_plan_type_id: props.procurement_plan_types[0].id,
                items: []
            }
        });
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_TYPE",
            data: "create"
        });
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
            data: {}
        });
    }

    const changeFieldValue = (e, field, target = true) => {
        let value = e;
        if(target){
            value = e.target.value;
        }
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                [field]: value
            }
        });
    }


    const changeTableFieldValue = (e, item, field, index) => {
        let value = e;
        let newValue = cloneDeep(props.formData[`items`]);
        newValue[index][field] = value;
        switch (field) {
            case 'request_quantity':
                // newValue[index].max_quantity
                let request_quantity = parseInt(value);
                if(request_quantity > newValue[index].max_quantity && props.formData.from_ppmp == 1){
                    request_quantity = newValue[index].max_quantity;
                }
                newValue[index]['request_quantity'] = request_quantity;
                break;
            case 'has_stock':
                newValue[index]['issue_quantity'] = (newValue[index].has_stock ? newValue[index]['issue_quantity'] : 0 );
                break;
            case 'issue_quantity':
                // newValue[index].max_quantity
                let issue_quantity = parseInt(value);
                if(issue_quantity >= newValue[index]['request_quantity']){
                    issue_quantity = newValue[index]['request_quantity'] ;
                }
                newValue[index]['issue_quantity'] = issue_quantity;
                break;
        
            default:
                break;
        }
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }
        });
    }

    const changeRequestedBy = (e) => {
        let requestedSignatory = props.user_section_signatories.filter(item => item.id == e);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
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
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                approved_by_id: e,
                approved_by_name: approvedSignatory[0].name,
                approved_by_designation: approvedSignatory[0].title,
                approved_by_office: approvedSignatory[0].parent.title,
            }
        });
    }

    const addAllMon = (item) => {
        let mon1 = isNaN(parseInt(item['mon1'])) ? 0 : parseInt(item['mon1']); 
        let mon2 = isNaN(parseInt(item['mon2'])) ? 0 : parseInt(item['mon2']); 
        let mon3 = isNaN(parseInt(item['mon3'])) ? 0 : parseInt(item['mon3']); 
        let mon4 = isNaN(parseInt(item['mon4'])) ? 0 : parseInt(item['mon4']); 
        let mon5 = isNaN(parseInt(item['mon5'])) ? 0 : parseInt(item['mon5']); 
        let mon6 = isNaN(parseInt(item['mon6'])) ? 0 : parseInt(item['mon6']); 
        let mon7 = isNaN(parseInt(item['mon7'])) ? 0 : parseInt(item['mon7']); 
        let mon8 = isNaN(parseInt(item['mon8'])) ? 0 : parseInt(item['mon8']); 
        let mon9 = isNaN(parseInt(item['mon9'])) ? 0 : parseInt(item['mon9']); 
        let mon10 = isNaN(parseInt(item['mon10'])) ? 0 : parseInt(item['mon10']); 
        let mon11 = isNaN(parseInt(item['mon11'])) ? 0 : parseInt(item['mon11']); 
        let mon12 = isNaN(parseInt(item['mon12'])) ? 0 : parseInt(item['mon12']);
        let total = 0;
        
        total += mon1;
        total += mon2;
        total += mon3;
        total += mon4;
        total += mon5;
        total += mon6;
        total += mon7;
        total += mon8;
        total += mon9;
        total += mon10;
        total += mon11;
        total += mon12;

        return total;
    }

    const total_price = () => {
        return  props.formData.items.reduce((sum, item) => {
            let total_price = isNaN(parseFloat(item.total_price)) ? 0 : parseFloat(item.total_price); 
            return sum += (total_price);
        }, 0);
    }

    const setSignatory = (e, type) => {
        let user_office = props.user_signatory_names.filter(i => i.title == e);
        console.log(user_office);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                approved_by_name: user_office[0].name,
                approved_by_designation: user_office[0].parent.name,
                approved_by_id: user_office[0].parent.parent.id,
                approvedBy: e
            }
        });
    }

    const changeRequisitionIssue = (e) => {
        let procurement_plan = props.procurement_plan_types.filter(item => item.id == e);
        let item_type;
        if(procurement_plan[0].title == "SPPMP"){
            item_type = props.item_types.filter(item => item.title == "NON-CSE");
        }else{
            item_type = props.item_types.filter(item => item.title == "CSE");
        }
        let item_type_id = item_type[0].id;
        let items = [];
        if(item_type_id == props.formData.item_type_id){
            items = props.formData.items;
        }
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                procurement_plan_type_id: e,
                title: `${procurement_plan[0].name} for CY ${props.formData.calendar_year}`,
                item_type_id: item_type_id,
                // items: items,
            }
        });
    }

    const changeCalendarYear = (e) => {
        let year = dayjs(e).format("YYYY");
        let procurement_plan = props.procurement_plan_types.filter(item => item.id == props.formData.procurement_plan_type_id);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                calendar_year: year,
                title: `${procurement_plan[0].name} for CY ${year}`
            }
        });
    }

    const changeFooter = (e, field) => {
        let value = e.target.value;
        changeFieldValue(value.toUpperCase(), field, false)
    }

    const changeIfPpmp = (e) => {
        if(e == "1"){
            getPpmpItems();
        }
        // changeFieldValue(e, 'from_ppmp', false);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                from_ppmp: e,
                items: []
            }
        });
    }


    const selectItem = (value, index) => {
        let item = items.filter(item => item.procurement_plan_item_id == value);
        item = item[0];
        let existed_item = props.formData[`items`].filter(item => item.procurement_plan_item_id == value);
        if(!isEmpty(existed_item)){
            notification.error({
                message: 'Item existed!',
                description:
                    `The item ${existed_item[0].description} is already in the list`,
                }
            );
            return false;
        }
        let newValue = cloneDeep(props.formData[`items`]);
        newValue[index]["unit_of_measure_id"] = item.procurement_plan_item.unit_of_measure.id;
        newValue[index]["unit_of_measure"] = item.procurement_plan_item.unit_of_measure.name;
        newValue[index]["item_code"] = "";
        newValue[index]["item_id"] = item.procurement_plan_item.item_id;
        newValue[index]["description"] = item.procurement_plan_item.description;
        newValue[index]["request_quantity"] = 0;
        newValue[index]["max_quantity"] = item.total_quantity;
        newValue[index]["procurement_plan_item_id"] = item.procurement_plan_item_id;
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }
        });
    }
    

    const addItem = () => {
        setTableKey(tableKey + 1);
        let newValue = {
            key: tableKey + 1,
            unit_of_measure_id: null,
            unit_of_measure: null,
            total_quantity: 0,
            total_price: 0,
            item_code: null,
            item_id: null,
            description: null,
            procurement_plan_item_id: null,
            is_edit: true,
            request_quantity: 0,
        };
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: [...props.formData.items, newValue]
            }
        });
    }

    const deleteItem = (key) => {
        let newValue = props.formData[`items`].filter(item => item.key !== key);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }   
        });
    }

    return (
        <div id="pp-container" className='container-fuild bg-white p-16'>
           <Title className='text-center' level={3}>REQUISITION AND ISSUE SLIP</Title>
           {/* <Title className='text-center' level={3}>{ props.procurement_plan_types.filter(item => item.id == props.formData.procurement_plan_type_id)[0]?.name }</Title> */}
           <Form layout='vertical'>
                
                <Row gutter={[8, 8]}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Form.Item label="Office/Section">
                            { props.formType == "issue" ? (
                                <b>{ props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name }</b>
                            ) : (
                                <Input placeholder="input placeholder" value={props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name} />
                            )}
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Form.Item label="Items From PPMP?"  {...helpers.displayError(props.formErrors, `from_ppmp`)}>
                            { props.formType == "issue" ? (
                                <b>{ props.formData.from_ppmp == "1" ? "Yes" : "No" }</b>
                            ) : (
                                <Select style={{ width: "100%" }} onChange={changeIfPpmp} value={props.formData.from_ppmp} placeholder="Select Item Type">
                                    <Option value={1}>Yes</Option>
                                    <Option value={0}>No</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    {/* <Col xs={24} sm={24} md={7} lg={7} xl={7}>
                        <Form.Item label="Item Type">
                            <Select style={{ width: "100%" }} onChange={changeItemType} value={props.formData.item_type_id} placeholder="Select Item Type">
                                {
                                    props.item_types.map(type => <Option value={type.id} key={type.id}>{ type.name }</Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Col> */}

                    {/* <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                        <Form.Item label="CY"  {...helpers.displayError(props.formErrors, `calendar_year`)}>
                            <DatePicker style={{width: "100%"}} allowClear={false} format={"YYYY"} onChange={changeCalendarYear} picker="year" value={dayjs(props.formData.calendar_year)}/>
                        </Form.Item>
                    </Col> */}
                    
                </Row>
{/* 
                <Row gutter={[8, 8]}>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label="Title"  {...helpers.displayError(props.formErrors, `title`)}>
                            <Input placeholder="Title" value={props.formData.title} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label="Purpose">
                            <Input placeholder="Purpose" onChange={(e) => changeFieldValue(e, 'purpose')} value={props.formData.purpose} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                        <Form.Item label="Date"  {...helpers.displayError(props.formErrors, `ppmp_date`)}>
                            <Input placeholder="input placeholder" value={moment(props.formData.ppmp_date).format('MM/DD/YYYY')} />
                        </Form.Item>
                    </Col>
                    
                </Row> */}
                { props.formType == "issue" ? (
                    <Row gutter={[8, 8]} className="pp-items-header">
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Code</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={11} xl={11}>
                            <div className='text-center'>
                                <b>Item</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Unit Of Measure</b>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Requested Quantity</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Stock Available?</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Issue Quantity</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Remarks</b>
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Row gutter={[8, 8]} className="pp-items-header">
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Code</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <div className='text-center'>
                                <b>Item</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Unit Of Measure</b>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Quantity</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Max Quantity</b>
                            </div>
                        </Col>
                        {/* <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-right'>
                                <b>Estimated Budget</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-right'>
                                <b>Total Amount</b>
                            </div>
                        </Col> */}
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div  className='text-right'>
                                <Tooltip placement="left" title={"Add Item"}>
                                    <Button type="primary" onClick={() => addItem() }  disabled={props.formData.from_ppmp == null}><PlusOutlined /></Button>
                                </Tooltip>
                            </div>
                        </Col>
                    </Row>
                )}

                { isEmpty(props.formData.items) && (
                    <Row gutter={[8, 8]} className="pp-items-row">
                        <Col span={24}>
                            <div className='text-center mb-3'>
                                { props.formData.from_ppmp == null ? "Please select if items is from PPMP above. " : (
                                    <React.Fragment>
                                        <span> Please add items before saving the form. </span>
                                        Click <Button type="primary" onClick={() => { addItem() } } disabled={props.formData.from_ppmp == null}><PlusOutlined /></Button> button to add item.
                                    </React.Fragment>
                                )  }
                            </div>
                        </Col>
                    </Row>
                ) }
                {
                    props.formData.items.map((item, index) => (
                        <React.Fragment key={item.key}>
                            {/* <b>{ item.item_type_name }</b> */}
                            { props.formType == "issue" ? (
                                <Row gutter={[8, 8]} className="pp-items-row">
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item>
                                                { item.item_code}
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={11} xl={11}>
                                    
                                        <div className='text-center'>
                                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.item_id`) }>
                                                { item.description }
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item>
                                                { item.unit_of_measure.name }
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            { item.request_quantity }
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={1} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.has_stock`) }>
                                                <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(e) => changeTableFieldValue(e, item, 'has_stock', index, ) } checked={item.has_stock == 1} />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.issue_quantity`) }>
                                            { item.has_stock ? (
                                                <Input type="number" autoComplete='off' min={0}  onChange={(e) => changeTableFieldValue(e.target.value, item, 'issue_quantity', index, ) } value={item.issue_quantity} style={{ width: "100%" }} placeholder="Quantity" />
                                            ) : item.issue_quantity }
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.remarks`) }>
                                            <Input  autoComplete='off' onBlur={(e) => changeTableFieldValue(e.target.value, item, 'remarks', index, ) } defaultValue={item.remarks} style={{ width: "100%" }} placeholder="Remarks" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : (
                                <Row gutter={[8, 8]} className="pp-items-row">
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item>
                                                { item.item_code}
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>

                                        <div className='text-center'>
                                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.description`) }>
                                                { props.formData.from_ppmp == 1 ? (

                                                    <Select
                                                        showSearch
                                                        placeholder="Item name"
                                                        optionFilterProp="children"
                                                        onSelect={(value) => { selectItem(value, index, )}}
                                                        filterOption={(input, option) =>
                                                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        value={item.procurement_plan_item_id}
                                                        >
                                                        { items.map(item =>  (
                                                            <Option value={item.procurement_plan_item_id} key={item.key}>{item.procurement_plan_item.description}</Option>
                                                        )) }
                                                    </Select>
                                                ) : (
                                                    <TextArea placeholder='Description' autoSize={{ minRows: 1, maxRows: 6 }} onBlur={(e) => changeTableFieldValue(e.target.value, item, 'description', index) } defaultValue={item.description} />
                                                ) }
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.unit_of_measure_id`) }>
                                                { props.formData.from_ppmp == 1 ? (
                                                    <span>{ item.procurement_plan_item_id && item.unit_of_measure }</span>
                                                ) : (
                                                    <Select
                                                        style={{ width: "100%" }}
                                                        placeholder={`Select Unit of Measure`}
                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        showSearch
                                                        onChange={(e) => changeTableFieldValue(e, item, 'unit_of_measure_id', index)}
                                                    >
                                                        { props.unit_of_measures.map(i => <Option value={i.id} key={i.key}>{ i.name }</Option>  ) }
                                                    </Select>
                                                ) }
                                                
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.request_quantity`) }>
                                            <Input type="number"  className='text-right' autoComplete='off' min={0}  onChange={(e) => changeTableFieldValue(e.target.value, item, 'request_quantity', index, ) } value={item.request_quantity} style={{ width: "100%" }} placeholder="Quantity" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.max_quantity`) }>
                                                { item.max_quantity }
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-right space-x-1'>
                                            <Tooltip placement="bottom" title={"Delete Item"}>
                                                <Button type="danger" onClick={() => deleteItem(item.key, )}><DeleteOutlined /></Button>
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                            ) }

                       
                            
                        </React.Fragment>
                ))
            }
                { !isEmpty(props.formData.items) && (
                <Row gutter={[8, 8]} className="pp-items-row">
                    <Col span={24}>
                        <div className='text-center mb-3'>
                            <Button type="primary" onClick={() => { addItem() } } disabled={props.formData.from_ppmp == null}><PlusOutlined /> Add item</Button>
                        </div>
                    </Col>
                </Row>
                )}
                <br />
            <Row gutter={[8, 8]} className="pp-items-footer">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item label="Purpose" { ...helpers.displayError(props.formErrors, `purpose`) }>
                        { props.formType == "issue" ? (
                            <b>{ props.formData.purpose }</b>
                        ) : (
                            <Input onBlur={(e) => changeFieldValue(e, 'purpose')} defaultValue={props.formData.purpose} placeholder="Purpose" />
                        ) }
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <Form.Item label="Requested by" { ...helpers.displayError(props.formErrors, `requested_by_name`) }>
                        { props.formType == "issue" ? (
                            <p>
                                <b>{ props.formData.requested_by_name }</b><br />
                                <span>{ props.formData.requested_by_designation }</span><br />
                                <span>{ props.formData.requested_by_date }</span><br />
                            </p>
                        )  : (
                            <Select style={{ width: "100%" }} onSelect={changeRequestedBy} value={props.formData.requested_by_id} placeholder="Select Signatory" optionLabelProp="label">
                                { props.user_section_signatories.filter(item => item.parent.title == props.user.user_offices?.data[0]?.office.parent.title || item.parent.title == props.user.user_offices?.data[0]?.office.title).map(i => (
                                    <Option value={i.id} key={i.key} label={ i.name }>
                                        <div className="demo-option-label-item">
                                            { i.parent.name }
                                        </div>
                                    </Option>
                                )) }
                            </Select>
                        )}
                    </Form.Item>
                    { props.formType != "issue" && (
                        <Form.Item label="Designation" { ...helpers.displayError(props.formErrors, `requested_by_designation`) }>
                            <Input value={props.formData.requested_by_designation} placeholder="Designation" />
                        </Form.Item>
                    )}
                </Col>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <Form.Item label="Approved by" { ...helpers.displayError(props.formErrors, `approved_by_name`) }>
                        { props.formType == "issue" ? (
                            <p>
                                <b>{ props.formData.approved_by_name }</b><br />
                                <span>{ props.formData.approved_by_designation }</span><br />
                                <span>{ props.formData.approved_by_date }</span><br />
                            </p>
                        )  : (
                            <Select style={{ width: "100%" }} onSelect={changeApprovedBy} value={props.formData.approved_by_id} placeholder="Select Signatory" optionLabelProp="label">
                                { props.user_section_signatories.filter(item => item.parent.title == "PSAMS").map(i => (
                                    <Option value={i.id} key={i.key} label={ i.name }>
                                        <div className="demo-option-label-item">
                                            { i.parent.name }
                                        </div>
                                    </Option>
                                )) }
                            </Select>
                        )}
                    </Form.Item>
                    { props.formType != "issue" && (
                        <Form.Item label="Designation" { ...helpers.displayError(props.formErrors, `approved_by_designation`) }>
                            <Input value={props.formData.approved_by_designation} placeholder="Designation" />
                        </Form.Item>
                    )}
                </Col>
            </Row>

           </Form>

           <div className='text-center space-x-2'>
                
                <br />
                <Button type="primary" onClick={() => handleSave()} disabled={submit} loading={submit}><SaveOutlined />
                    { props.formType == "create" ? "Create Requisition and Issue Slip" : "Update Requisition and Issue Slip"}
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
  )(CreateRequisitionIssue);