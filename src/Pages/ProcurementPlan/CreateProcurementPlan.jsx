import React, { useState, useEffect } from 'react';
import style from './style.less'
import { debounce, isEmpty, cloneDeep } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, Typography, Form, notification, Modal, Row, Col, Tooltip  } from 'antd';
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
        user_sections: state.libraries.user_sections,
        user_divisions: state.libraries.user_divisions,
        user_signatory_designations: state.libraries.user_signatory_designations,
        user_signatory_names: state.libraries.user_signatory_names,
        formData: state.procurementPlan.create.formData,
        formType: state.procurementPlan.create.formType,
        formErrors: state.procurementPlan.create.formErrors,
        formProccess: state.purchaseRequests.create.formProccess,
        requestedBySignatory: state.purchaseRequests.create.requestedBySignatory,
        approvedBySignatory: state.purchaseRequests.create.approvedBySignatory,
        user: state.user.data,
        isInitialized: state.user.isInitialized,
    };
}

const CreateProcurementPlan = (props) => {
    useEffect(() => {
        if(props.isInitialized){
            if(props.formData.end_user_id){
            }else{
                if(!isEmpty(props.user)){
                    props.dispatch({
                        type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                        data: {
                            ...props.formData,
                            end_user_id: props.user.user_offices?.data[0]?.office_id,
                            procurement_plan_type: "Project Procurement Management Plan (PPMP)"
                        }
                    });
                }
            }
            if(isEmpty(props.items)){
                getItems();
            }
        }
    }, [props.isInitialized]);
    useEffect(() => {
        document.title = "Create Purchase Request";
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


    const saveProcurementPlan = debounce(() => {
        setSubmit(true);
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_ERRORS",
            data: {}
        });
        let formData = cloneDeep(props.formData);
        api.ProcurementPlan.save(formData,props.formType)
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
                    type: "SET_PROCUREMENT_PLAN_CREATE_FORM_ERRORS",
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
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                end_user_id: props.user.user_offices?.data[0]?.office_id,
                procurement_plan_type: "Project Procurement Management Plan (PPMP)",
                items: []
            }
        });
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_TYPE",
            data: "create"
        });
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_ERRORS",
            data: {}
        });
    }

    const changeFieldValue = (e, field, target = true) => {
        let value = e;
        if(target){
            value = e.target.value;
        }
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                [field]: value
            }
        });
    }


    const changeTableFieldValue = (e, item, field, index) => {
        let value = e;
        let newValue = cloneDeep(props.formData.items);
        newValue[index][field] = value;
        newValue[index]["total_quantity"] = addAllMon(newValue[index]);
        switch (field) {
            case 'price':
                newValue[index]["total_price"] = value * newValue[index]["total_quantity"];
                break;
            case 'mon1':
            case 'mon2':
            case 'mon3':
            case 'mon4':
            case 'mon5':
            case 'mon6':
            case 'mon7':
            case 'mon8':
            case 'mon9':
            case 'mon10':
            case 'mon11':
            case 'mon12':
                newValue[index]["total_price"] = newValue[index]["price"] * newValue[index]["total_quantity"];
                break;
        
            default:
                break;
        }
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
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

    const total_cost = () => {
        return props.formData.items.reduce((sum, item) => {
            let total_price = isNaN(parseFloat(item.total_price)) ? 0 : parseFloat(item.total_price); 
            return sum += (total_price);
        }, 0);
    }

    const selectItem = (value, index) => {
        let item = props.items.filter(item => item.id == value);
        item = item[0];
        let newValue = cloneDeep(props.formData.items);
        newValue[index]["unit_of_measure_id"] = item.unit_of_measure.id;
        newValue[index]["item_type_id"] = item.item_type.id;
        newValue[index]["item_type_name"] = item.item_type.name;
        newValue[index]["unit_of_measure"] = item.unit_of_measure.name;
        // newValue[index]["is_ppmp"] = item.is_ppmp;
        // newValue[index]["in_libraries"] = true;
        newValue[index]["item_code"] = item.item_code;
        newValue[index]["item_name"] = item.item_name;
        newValue[index]["item_id"] = item.id;
        if(item.item_type.name == "AVAILABLE AT PROCUREMENT SERVICE STORES"){
            newValue[index]["price"] = item.price;
            newValue[index]["is_price_fix"] = true;
        }else{
            newValue[index]["is_price_fix"] = false;
        }
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
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
            item_name: null,
            item_id: null,
            is_edit: true,
            price: 0,
            mon1: 0,
            mon2: 0,
            mon3: 0,
            mon4: 0,
            mon5: 0,
            mon6: 0,
            mon7: 0,
            mon8: 0,
            mon9: 0,
            mon10: 0,
            mon11: 0,
            mon12: 0,
        };
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: [...props.formData.items, newValue]
            }
        });
    }

    const deleteItem = (key) => {
        let newValue = props.formData.items.filter(item => item.key !== key)
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }   
        });
    }
    const toggleItem = (index, item) => {
        changeTableFieldValue(!item.is_edit, item, 'is_edit', index);
    }

    const handleChangeType = (e) => {
        changeFieldValue(e, 'procurement_plan_type', false);
        // props.dispatch({
        //     type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
        //     data: {
        //         ...props.formData,
        //         end_user_id: props.user.user_offices?.data[0]?.office_id,
        //         procurement_plan_type: e,
        //         items: []
        //     }
        // });
    }
  
    
    return (
        <div id="pp-container" className='container-fuild bg-white p-16'>
           <Title className='text-center' level={3}>Project Procurement Management Plan (PPMP)</Title>
           <Form layout='vertical'>
                <Row gutter={[8, 8]}>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <Form.Item label="Office/Section">
                            <Input placeholder="input placeholder" readOnly value={props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                        <Form.Item label="Item Type">
                            <Select style={{ width: "100%" }} onChange={handleChangeType} value={props.formData.procurement_plan_type} placeholder="Select Item Type">
                                <Option value="Project Procurement Management Plan (PPMP)">Project Procurement Management Plan (PPMP)</Option>
                                <Option value="Supplemental Project Procurement Management Plan (PPMP)">Supplemental Project Procurement Management Plan (PPMP)</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    
                </Row>
                <Row gutter={[8, 8]} className="pp-items-header">
                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                        <div className='text-center'>
                            <b>Code</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <div className='text-center'>
                            <b>General Description</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                        <div className='text-center'>
                            <b>Unit Of Measure</b>
                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                        <div className='text-center'>
                            <b>Total Quantity</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                        <div className='text-right'>
                            <b>Estimated Budget</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                        <div className='text-right'>
                            <b>Total Amount</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                        <div  className='text-right'>
                            <Tooltip placement="left" title={"Add Item"}>
                                <Button type="primary" onClick={ addItem }><PlusOutlined /></Button>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>

                { isEmpty(props.formData.items) && (
                    <Row gutter={[8, 8]} className="pp-items-row">
                        <Col span={24}>
                            <div className='text-center mb-3'>
                                Please add items before saving the form. Click <Button type="primary" onClick={() => { addItem() } }><PlusOutlined /></Button> button to add item.
                            </div>
                        </Col>
                    </Row>
                ) }
                {
                    props.formData.items.map((item, index) => (
                        <React.Fragment key={item.key}>
                            <b>{ item.item_type_name }</b>
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
                                    <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.item_id`) }>
                                        <Select
                                            showSearch
                                            placeholder="Item name"
                                            optionFilterProp="children"
                                            onSelect={(value) => { selectItem(value, index)}}
                                            filterOption={(input, option) =>
                                                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            value={item.item_id}
                                        >
                                            { props.item_categories.map(item_category =>  {
                                                return (
                                                    <OptGroup label={item_category.name}  key={item_category.id}>
                                                        { props.items?.filter(item => item.item_category.id == item_category.id).map(item => {
                                                            return <Option value={item.id} key={item.id}>{item.item_name}</Option>
                                                        }) }
                                                    </OptGroup>
                                                );
                                            }) }
                                        </Select>
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                <div className='text-center'>
                                    <Form.Item>
                                        { item.unit_of_measure }
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                <div className='text-center'>
                                    <Form.Item>
                                        { item.total_quantity }
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                <div className='text-right'>
                                    <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.price`) }>
                                        {
                                            item.is_price_fix ? (
                                                <span>{ helpers.currencyFormat(item.price) }</span>
                                            ) : (
                                                <Input type="number"  className='text-right' autoComplete='off'  onChange={(e) => changeTableFieldValue(e.target.value, item, 'price', index) } value={item.price} style={{ width: "100%" }} step="0.01" placeholder="Estimated Budget" />
                                            )
                                        }
                                        
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                <div className='text-right'>
                                    <Form.Item>
                                        { helpers.currencyFormat(item.total_price) }
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                <div className='text-right space-x-1'>
                                    <Tooltip placement="bottom" title={"Show or hide months"}>
                                        <Button type="default" onClick={() => toggleItem(index, item)}>
                                            { item.is_edit ? (
                                                <DoubleLeftOutlined rotate={90} />
                                            ) : (
                                                <DoubleLeftOutlined rotate={-90} />
                                            ) }
                                        </Button>
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={"Delete Item"}>
                                        <Button type="danger" onClick={() => deleteItem(item.key)}><DeleteOutlined /></Button>
                                    </Tooltip>
                                </div>
                            </Col>
                            { item.is_edit && (
                                <React.Fragment>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon1`) }>
                                            <b>Jan</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon1', index) } value={item.mon1} style={{ width: "100%" }} min="0" placeholder="Jan" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon2`) }>
                                            <b>Feb</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon2', index) } value={item.mon2} style={{ width: "100%" }} min="0" placeholder="Feb" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon3`) }>
                                            <b>Mar</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon3', index) } value={item.mon3} style={{ width: "100%" }} min="0" placeholder="Mar" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon4`) }>
                                            <b>Apr</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon4', index) } value={item.mon4} style={{ width: "100%" }} min="0" placeholder="Apr" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon5`) }>
                                            <b>May</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon5', index) } value={item.mon5} style={{ width: "100%" }} min="0" placeholder="May" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon6`) }>
                                            <b>Jun</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon6', index) } value={item.mon6} style={{ width: "100%" }} min="0" placeholder="Jun" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon7`) }>
                                            <b>July</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon7', index) } value={item.mon7} style={{ width: "100%" }} min="0" placeholder="July" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon8`) }>
                                            <b>Aug</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon8', index) } value={item.mon8} style={{ width: "100%" }} min="0" placeholder="Aug" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon9`) }>
                                            <b>Sept</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon9', index) } value={item.mon9} style={{ width: "100%" }} min="0" placeholder="Sept" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon10`) }>
                                            <b>Oct</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon10', index) } value={item.mon10} style={{ width: "100%" }} min="0" placeholder="Oct" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon11`) }>
                                            <b>Nov</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon11', index) } value={item.mon11} style={{ width: "100%" }} min="0" placeholder="Nov" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.mon12`) }>
                                            <b>Dec</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon12', index) } value={item.mon12} style={{ width: "100%" }} min="0" placeholder="Dec" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                </React.Fragment>
                            ) }
                        </Row>
                        </React.Fragment>
                ))
            }
            <Row gutter={[8, 8]} className="pp-items-footer">
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
                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                    <div className='text-right'>
                        <b>{ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(  total_cost() )}</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                    <div  className='text-right'>
                        
                    </div>
                </Col>
            </Row>
           </Form>

           <div className='text-center space-x-2'>
                
                <br />
                <Button type="primary" onClick={() => saveProcurementPlan()} disabled={submit} loading={submit}><SaveOutlined />
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
  )(CreateProcurementPlan);