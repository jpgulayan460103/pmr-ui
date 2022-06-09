import React, { useState, useEffect } from 'react';
import style from './style.less'
import { debounce, isEmpty, cloneDeep } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, Typography, Form, notification, Modal, Row, Col, Tooltip, Badge, DatePicker  } from 'antd';
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
        procurement_plan_types: state.libraries.procurement_plan_types,
        user_sections: state.libraries.user_sections,
        user_divisions: state.libraries.user_divisions,
        user_positions: state.libraries.user_positions,
        user_signatory_designations: state.libraries.user_signatory_designations,
        user_signatory_names: state.libraries.user_signatory_names,
        formData: state.procurementPlans.create.formData,
        formType: state.procurementPlans.create.formType,
        formErrors: state.procurementPlans.create.formErrors,
        formProccess: state.purchaseRequests.create.formProccess,
        user: state.user.data,
        isInitialized: state.user.isInitialized,
    };
}

const CreateProcurementPlan = (props) => {
    useEffect(() => {
        if(props.isInitialized){
            setItemTypeA(props.item_types[0].id);
            setItemTypeB(props.item_types[1].id);
            if(props.formData.end_user_id){
            }else{
                if(!isEmpty(props.user)){
                    let position = props.user_positions.filter(position => position.key == props.user.user_information?.position_id);
                    props.dispatch({
                        type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                        data: {
                            ...props.formData,
                            end_user_id: props.user.user_offices?.data[0]?.office_id,
                            procurement_plan_type_id: props.procurement_plan_types[0].id,
                            item_type_id: props.item_types[0].id,
                            prepared_by_name: props.user.user_information?.fullname?.toUpperCase(),
                            prepared_by_position: position[0].name,
                            calendar_year: dayjs().format("YYYY"),
                            ppmp_date: dayjs().format('YYYY-MM-DD'),
                            title: `${props.procurement_plan_types[0].name} for CY ${dayjs().format("YYYY")}`,
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
    const [itemTypeA, setItemTypeA] = useState(null);
    const [itemTypeB, setItemTypeB] = useState(null);


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
                        title: 'Project Procurement Plan creation failed',
                        content: (
                          <div>
                            <p>Please add items on the procurement plan.</p>
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
                procurement_plan_type_id: props.procurement_plan_types[0].id,
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


    const changeTableFieldValue = (e, item, field, index, itemType = "A") => {
        let value = e;
        let newValue = cloneDeep(props.formData[`items${itemType}`]);
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
                newValue[index][field] = parseInt(value);
                newValue[index]["total_price"] = newValue[index]["price"] * newValue[index]["total_quantity"];
                break;
        
            default:
                break;
        }
        if(itemType == "A"){
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: {
                    ...props.formData,
                    itemsA: newValue
                }
            });
        }else{
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: {
                    ...props.formData,
                    itemsB: newValue
                }
            });
        }
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

    const total_price = (itemType = "A") => {
        let itemA =  props.formData.itemsA.reduce((sum, item) => {
            let total_price = isNaN(parseFloat(item.total_price)) ? 0 : parseFloat(item.total_price); 
            return sum += (total_price);
        }, 0);
        let itemB =  props.formData.itemsB.reduce((sum, item) => {
            let total_price = isNaN(parseFloat(item.total_price)) ? 0 : parseFloat(item.total_price); 
            return sum += (total_price);
        }, 0);
        if(itemType == "A"){
            return itemA;
        }else if (itemType == "B") {
            return itemB;
        }
        return itemA + itemB;
    }

    const setSignatory = (e, type) => {
        let user_office = props.user_signatory_names.filter(i => i.title == e);
        console.log(user_office);
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                approved_by_name: user_office[0].name,
                approved_by_position: user_office[0].parent.name,
                approved_by_id: user_office[0].parent.parent.id,
                approvedBy: e
            }
        });
    }

    const changeProcurementPlan = (e) => {
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
            items = props.formData.itemsA;
        }
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
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
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
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

    const changeItemType = (e) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                item_type_id: e,
                itemsA: []
            }
        });
    }

    const selectItem = (value, index, itemType = "A") => {
        let item = props.items.filter(item => item.id == value);
        item = item[0];
        let existed_item = props.formData[`items${itemType}`].filter(item => item.item_id == value);
        if(!isEmpty(existed_item)){
            notification.error({
                message: 'Item existed!',
                description:
                    `The item ${existed_item[0].item_name} is already in the list`,
                }
            );
            return false;
        }
        let newValue = cloneDeep(props.formData[`items${itemType}`]);
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
        if(itemType == "A"){
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: {
                    ...props.formData,
                    itemsA: newValue
                }
            });
        }else{
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: {
                    ...props.formData,
                    itemsB: newValue
                }
            });
        }
    }
    

    const addItem = (itemType = "A") => {
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
        if(itemType == "A"){
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: {
                    ...props.formData,
                    itemsA: [...props.formData.itemsA, newValue]
                }
            });
        }else{
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: {
                    ...props.formData,
                    itemsB: [...props.formData.itemsB, newValue]
                }
            });
        }
    }

    const deleteItem = (key, itemType = "A") => {
        let newValue = props.formData[`items${itemType}`].filter(item => item.key !== key);
        if(itemType == "A"){
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: {
                    ...props.formData,
                    itemsA: newValue
                }   
            });
        }else{
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: {
                    ...props.formData,
                    itemsB: newValue
                }   
            });
        }
    }
    const toggleItem = (index, item, itemType = "A") => {
        changeTableFieldValue(!item.is_edit, item, 'is_edit', index, itemType);
    }

    const dropDownBadge = (index, itemType = "A") => {
        let mon1 = props.formErrors[`items${itemType}.${index}.mon1`];
        let mon2 = props.formErrors[`items${itemType}.${index}.mon2`];
        let mon3 = props.formErrors[`items${itemType}.${index}.mon3`];
        let mon4 = props.formErrors[`items${itemType}.${index}.mon4`];
        let mon5 = props.formErrors[`items${itemType}.${index}.mon5`];
        let mon6 = props.formErrors[`items${itemType}.${index}.mon6`];
        let mon7 = props.formErrors[`items${itemType}.${index}.mon7`];
        let mon8 = props.formErrors[`items${itemType}.${index}.mon8`];
        let mon9 = props.formErrors[`items${itemType}.${index}.mon9`];
        let mon10 = props.formErrors[`items${itemType}.${index}.mon10`];
        let mon11 = props.formErrors[`items${itemType}.${index}.mon11`];
        let mon12 = props.formErrors[`items${itemType}.${index}.mon12`];
        let months = [
            mon1,
            mon2,
            mon3,
            mon4,
            mon5,
            mon6,
            mon7,
            mon8,
            mon9,
            mon10,
            mon11,
            mon12,
        ];
        let filtered = months.filter(month => typeof month != "undefined");
        return filtered.length;
    }
  
    
    return (
        <div id="pp-container" className='container-fuild bg-white p-16'>
           {/* <Title className='text-center' level={3}>Project Procurement Management Plan (PPMP)</Title> */}
           <Title className='text-center' level={3}>{ props.procurement_plan_types.filter(item => item.id == props.formData.procurement_plan_type_id)[0]?.name }</Title>
           <Form layout='vertical'>
                
                <Row gutter={[8, 8]}>
                    <Col xs={24} sm={24} md={7} lg={7} xl={7}>
                        <Form.Item label="Office/Section">
                            <Input placeholder="input placeholder" value={props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={7} lg={7} xl={7}>
                        <Form.Item label="Procurement Plan Type"  {...helpers.displayError(props.formErrors, `procurement_plan_type_id`)}>
                            <Select style={{ width: "100%" }} onChange={changeProcurementPlan} value={props.formData.procurement_plan_type_id} placeholder="Select Item Type">
                                { props.procurement_plan_types.map(item => <Option value={item.id} key={item.key}>{item.name}</Option>) }
                            </Select>
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

                    <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                        <Form.Item label="CY"  {...helpers.displayError(props.formErrors, `calendar_year`)}>
                            {/* <Input placeholder="Date" /> */}
                            <DatePicker style={{width: "100%"}} allowClear={false} format={"YYYY"} onChange={changeCalendarYear} picker="year" value={dayjs(props.formData.calendar_year)}/>
                        </Form.Item>
                    </Col>
                    
                </Row>

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
                    
                </Row>
                <b>PART I. AVAILABLE AT PROCUREMENT SERVICE STORES</b>
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
                                <Button type="primary" onClick={() => addItem("A") }><PlusOutlined /></Button>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>

                { isEmpty(props.formData.itemsA) && (
                    <Row gutter={[8, 8]} className="pp-items-row">
                        <Col span={24}>
                            <div className='text-center mb-3'>
                                Please add items before saving the form. Click <Button type="primary" onClick={() => { addItem("A") } }><PlusOutlined /></Button> button to add item.
                            </div>
                        </Col>
                    </Row>
                ) }
                {
                    props.formData.itemsA.map((item, index) => (
                        <React.Fragment key={item.key}>
                            {/* <b>{ item.item_type_name }</b> */}
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
                                    <Form.Item { ...helpers.displayError(props.formErrors, `itemsA.${index}.item_id`) }>
                                        { item.is_edit ? (<Select
                                            showSearch
                                            placeholder="Item name"
                                            optionFilterProp="children"
                                            onSelect={(value) => { selectItem(value, index, "A")}}
                                            filterOption={(input, option) =>
                                                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            value={item.item_id}
                                        >
                                            { props.item_categories.map(item_category =>  {
                                                return (
                                                    <OptGroup label={item_category.name}  key={item_category.id}>
                                                        { props.items?.filter(item => item.item_category.id == item_category.id && item.item_type.id == itemTypeA).map(item => {
                                                            return <Option value={item.id} key={item.id}>{item.item_name}</Option>
                                                        }) }
                                                    </OptGroup>
                                                );
                                            }) }
                                        </Select>) : (
                                            <span>{item.item_name}</span>
                                        ) }
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
                                    <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.total_quantity`) }>
                                        { item.total_quantity }
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                <div className='text-right'>
                                    <Form.Item { ...helpers.displayError(props.formErrors, `itemsA.${index}.price`) }>
                                        {
                                            item.is_price_fix ? (
                                                <span>{ helpers.currencyFormat(item.price) }</span>
                                            ) : (
                                                <Input type="number"  className='text-right' autoComplete='off'  onChange={(e) => changeTableFieldValue(e.target.value, item, 'price', index, "A") } value={item.price} style={{ width: "100%" }} step="0.01" placeholder="Estimated Budget" />
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

                                        { item.is_edit ? (
                                                <Button type="default" onClick={() => toggleItem(index, item, "A")}>
                                                    <DoubleLeftOutlined rotate={90} />
                                                </Button>
                                        ) : (
                                            <Badge size="default" count={ dropDownBadge(index) }>
                                                <Button type="default" onClick={() => toggleItem(index, item, "A")}>
                                                    <DoubleLeftOutlined rotate={-90} />
                                                </Button>
                                            </Badge>
                                            )
                                        }
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={"Delete Item"}>
                                        <Button type="danger" onClick={() => deleteItem(item.key, "A")}><DeleteOutlined /></Button>
                                    </Tooltip>
                                </div>
                            </Col>
                            { item.is_edit && (
                                <React.Fragment>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon1`) }>
                                            <b>Jan</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon1', index, "A") } value={item.mon1} style={{ width: "100%" }} min="0" placeholder="Jan" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon2`) }>
                                            <b>Feb</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon2', index, "A") } value={item.mon2} style={{ width: "100%" }} min="0" placeholder="Feb" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon3`) }>
                                            <b>Mar</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon3', index, "A") } value={item.mon3} style={{ width: "100%" }} min="0" placeholder="Mar" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon4`) }>
                                            <b>Apr</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon4', index, "A") } value={item.mon4} style={{ width: "100%" }} min="0" placeholder="Apr" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon5`) }>
                                            <b>May</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon5', index, "A") } value={item.mon5} style={{ width: "100%" }} min="0" placeholder="May" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon6`) }>
                                            <b>Jun</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon6', index, "A") } value={item.mon6} style={{ width: "100%" }} min="0" placeholder="Jun" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon7`) }>
                                            <b>July</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon7', index, "A") } value={item.mon7} style={{ width: "100%" }} min="0" placeholder="July" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon8`) }>
                                            <b>Aug</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon8', index, "A") } value={item.mon8} style={{ width: "100%" }} min="0" placeholder="Aug" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon9`) }>
                                            <b>Sept</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon9', index, "A") } value={item.mon9} style={{ width: "100%" }} min="0" placeholder="Sept" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon10`) }>
                                            <b>Oct</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon10', index, "A") } value={item.mon10} style={{ width: "100%" }} min="0" placeholder="Oct" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon11`) }>
                                            <b>Nov</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon11', index, "A") } value={item.mon11} style={{ width: "100%" }} min="0" placeholder="Nov" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsA.${index}.mon12`) }>
                                            <b>Dec</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon12', index, "A") } value={item.mon12} style={{ width: "100%" }} min="0" placeholder="Dec" />
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
                <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                    <div className='text-center'>
                        <b>GRAND TOTAL FOR ANNEX A</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                    <div className='text-right'>
                        <b>{ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(  total_price("A") )}</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                    <div  className='text-right'>
                        
                    </div>
                </Col>
            </Row>
                <br />
            <Row gutter={[8, 8]} className="pp-items-footer">
            </Row>
            {/* END OF PART I */}
            <br />
            <br />
            <br />
            {/* PART II */}
            <b>PART II. AVAILABLE AT PROCUREMENT SERVICE STORES</b>
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
                                <Button type="primary" onClick={() => addItem("B") }><PlusOutlined /></Button>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>

                { isEmpty(props.formData.itemsB) && (
                    <Row gutter={[8, 8]} className="pp-items-row">
                        <Col span={24}>
                            <div className='text-center mb-3'>
                                Please add items before saving the form. Click <Button type="primary" onClick={() => { addItem("B") } }><PlusOutlined /></Button> button to add item.
                            </div>
                        </Col>
                    </Row>
                ) }
                {
                    props.formData.itemsB.map((item, index) => (
                        <React.Fragment key={item.key}>
                            {/* <b>{ item.item_type_name }</b> */}
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
                                    <Form.Item { ...helpers.displayError(props.formErrors, `itemsB.${index}.item_id`) }>
                                        { item.is_edit ? (<Select
                                            showSearch
                                            placeholder="Item name"
                                            optionFilterProp="children"
                                            onSelect={(value) => { selectItem(value, index, "B")}}
                                            filterOption={(input, option) =>
                                                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            value={item.item_id}
                                        >
                                            { props.item_categories.map(item_category =>  {
                                                return (
                                                    <OptGroup label={item_category.name}  key={item_category.id}>
                                                        { props.items?.filter(item => item.item_category.id == item_category.id && item.item_type.id == itemTypeB).map(item => {
                                                            return <Option value={item.id} key={item.id}>{item.item_name}</Option>
                                                        }) }
                                                    </OptGroup>
                                                );
                                            }) }
                                        </Select>) : (
                                            <span>{item.item_name}</span>
                                        ) }
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
                                    <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.total_quantity`) }>
                                        { item.total_quantity }
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                <div className='text-right'>
                                    <Form.Item { ...helpers.displayError(props.formErrors, `itemsB.${index}.price`) }>
                                        {
                                            item.is_price_fix ? (
                                                <span>{ helpers.currencyFormat(item.price) }</span>
                                            ) : (
                                                <Input type="number"  className='text-right' autoComplete='off'  onChange={(e) => changeTableFieldValue(e.target.value, item, 'price', index, "B") } value={item.price} style={{ width: "100%" }} step="0.01" placeholder="Estimated Budget" />
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

                                        { item.is_edit ? (
                                                <Button type="default" onClick={() => toggleItem(index, item, "B")}>
                                                    <DoubleLeftOutlined rotate={90} />
                                                </Button>
                                        ) : (
                                            <Badge size="default" count={ dropDownBadge(index) }>
                                                <Button type="default" onClick={() => toggleItem(index, item, "B")}>
                                                    <DoubleLeftOutlined rotate={-90} />
                                                </Button>
                                            </Badge>
                                            )
                                        }
                                    </Tooltip>
                                    <Tooltip placement="bottom" title={"Delete Item"}>
                                        <Button type="danger" onClick={() => deleteItem(item.key, "B")}><DeleteOutlined /></Button>
                                    </Tooltip>
                                </div>
                            </Col>
                            { item.is_edit && (
                                <React.Fragment>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon1`) }>
                                            <b>Jan</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon1', index, "B") } value={item.mon1} style={{ width: "100%" }} min="0" placeholder="Jan" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon2`) }>
                                            <b>Feb</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon2', index, "B") } value={item.mon2} style={{ width: "100%" }} min="0" placeholder="Feb" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon3`) }>
                                            <b>Mar</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon3', index, "B") } value={item.mon3} style={{ width: "100%" }} min="0" placeholder="Mar" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon4`) }>
                                            <b>Apr</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon4', index, "B") } value={item.mon4} style={{ width: "100%" }} min="0" placeholder="Apr" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon5`) }>
                                            <b>May</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon5', index, "B") } value={item.mon5} style={{ width: "100%" }} min="0" placeholder="May" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon6`) }>
                                            <b>Jun</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon6', index, "B") } value={item.mon6} style={{ width: "100%" }} min="0" placeholder="Jun" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon7`) }>
                                            <b>July</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon7', index, "B") } value={item.mon7} style={{ width: "100%" }} min="0" placeholder="July" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon8`) }>
                                            <b>Aug</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon8', index, "B") } value={item.mon8} style={{ width: "100%" }} min="0" placeholder="Aug" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon9`) }>
                                            <b>Sept</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon9', index, "B") } value={item.mon9} style={{ width: "100%" }} min="0" placeholder="Sept" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon10`) }>
                                            <b>Oct</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon10', index, "B") } value={item.mon10} style={{ width: "100%" }} min="0" placeholder="Oct" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon11`) }>
                                            <b>Nov</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon11', index, "B") } value={item.mon11} style={{ width: "100%" }} min="0" placeholder="Nov" />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                    <div className='text-center'>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `itemsB.${index}.mon12`) }>
                                            <b>Dec</b>
                                            <Input type="number" className='text-center' autoComplete='off' onChange={(e) => changeTableFieldValue(e.target.value, item, 'mon12', index, "B") } value={item.mon12} style={{ width: "100%" }} min="0" placeholder="Dec" />
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
                <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                    <div className='text-center'>
                        <b>GRAND TOTAL FOR ANNEX B</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                    <div className='text-right'>
                        <b>{ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(  total_price("B") )}</b>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                    <div  className='text-right'>
                        
                    </div>
                </Col>
            </Row>
                <br />
            <Row gutter={[8, 8]} className="pp-items-footer">
            </Row>

            {/* END OF PART II */}
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Prepared By" { ...helpers.displayError(props.formErrors, `prepared_by_name`) }>
                        <Input onChange={(e) => changeFooter(e,'prepared_by_name')} value={props.formData.prepared_by_name} placeholder="FULL NAME" />
                    </Form.Item>
                    <Form.Item label="Position/Designation" { ...helpers.displayError(props.formErrors, `prepared_by_position`) }>
                        {/* <Input onChange={(e) => changeFieldValue(e, 'prepared_by_position')} value={props.formData.prepared_by_position} /> */}
                        <AutoComplete
                            style={{ width: "100%" }}
                            allowClear
                            options={props.user_positions}
                            onSelect={(val, item) => {}}
                            placeholder="Position/Designation"
                            filterOption={(input, option) =>
                                option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(e) => {
                                changeFieldValue(e, 'prepared_by_position', false);
                            }}
                            value={props.formData.prepared_by_position}
                        >
                            <TextArea autoSize />
                        </AutoComplete>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Certified By" { ...helpers.displayError(props.formErrors, `certified_by_name`) }>
                        <Input onChange={(e) => changeFooter(e,'certified_by_name')} value={props.formData.certified_by_name} placeholder="FULL NAME" />
                    </Form.Item>
                    <Form.Item label="Position/Designation" { ...helpers.displayError(props.formErrors, `certified_by_position`) }>
                        <AutoComplete
                            style={{ width: "100%" }}
                            allowClear
                            options={props.user_positions}
                            onSelect={(val, item) => {}}
                            placeholder="Position/Designation"
                            filterOption={(input, option) =>
                                option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(e) => {
                                changeFieldValue(e, 'certified_by_position', false);
                            }}
                            value={props.formData.certified_by_position}
                        >
                            <TextArea autoSize />
                        </AutoComplete>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item label="Approved by" { ...helpers.displayError(props.formErrors, `approved_by_id`) }>
                        <Select style={{ width: "100%" }} onSelect={(e) => { setSignatory(e,'approvedBy') }} value={props.formData.approvedBy} placeholder="Select Signatory">
                            { props.user_signatory_designations.filter(i => i.title == "OARDA" || i.title == "OARDO" || i.title == "ORD").map(i => <Option value={i.title} key={i.key}>{ i.parent.name }</Option>) }
                        </Select>
                    </Form.Item>
                    {/* <p className='text-center'><b>{ props.approvedBySignatory?.name }</b></p> */}
                    {/* <p className='text-center'>{ props.approvedBySignatory?.parent?.name }</p> */}

                    <Form.Item label="Approved By" { ...helpers.displayError(props.formErrors, `approved_by_name`) }>
                        <Input onChange={(e) => changeFooter(e,'approved_by_name')} value={props.formData.approved_by_name} placeholder="FULL NAME" />
                    </Form.Item>
                    <Form.Item label="Position/Designation" { ...helpers.displayError(props.formErrors, `approved_by_position`) }>
                        <AutoComplete
                            style={{ width: "100%" }}
                            allowClear
                            options={props.user_positions}
                            onSelect={(val, item) => {}}
                            placeholder="Position/Designation"
                            filterOption={(input, option) =>
                                option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(e) => {
                                changeFieldValue(e, 'approved_by_position', false);
                            }}
                            value={props.formData.approved_by_position}
                        >
                            <TextArea autoSize />
                        </AutoComplete>
                    </Form.Item>
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