import React, { useState, useEffect } from 'react';
import style from './style.less'
import { debounce, isEmpty, cloneDeep } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, DatePicker, Form  } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
        items: state.library.items,
        sections: state.library.sections,
        formData: state.purchaseRequest.formData,
        formErrors: state.purchaseRequest.formErrors,
    };
}

const { TextArea } = Input;
const { Option } = Select;

const Purchaserequest = (props) => {
    const [tableKey, setTableKey] = useState(0);
    const savePurchaseRequest = debounce(() => {
        api.PurchaseRequest.save(props.formData,"create")
        .then(res => {})
        .catch(err => {
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
                data: err.response.data.errors
            });
        })
        .then(res => {})
        ;
        console.log(props.formData);
    }, 200);

    const addItem = () => {
        setTableKey(tableKey + 1);
        let newValue = {
            key: tableKey + 1,
            item_code: null,
            unit_of_measure_id: null,
            item_name: null,
            quantity: 1,
            unit_cost: 0,
            total_cost: 0,
            is_ppmp: false,
            item_id: null,
        };
        // setFormData(oldArray => ({
        //     ...oldArray,
        //     items: [...oldArray.items, newValue]
        // }));

        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_DATA",
            data: {
                ...props.formData,
                items: [...props.formData.items, newValue]
            }
        });
    }

    const deleteItem = (key) => {
        let newValue = props.formData.items.filter(item => item.key !== key)
        // setFormData(oldArray => ({
        //     ...oldArray,
        //     items: newValue
        // }));
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }
        });
    }

    const changeFieldValue = (e, field, target = true) => {
        let value = e;
        if(target){
            value = e.target.value;
        }
        // setFormData(oldArray => ({
        //     ...oldArray,
        //     [field]: value
        // }));
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_DATA",
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
                value = isNaN(value) ? 1 : parseFloat(value);
                break;
            case 'quantity':
                value =  isNaN(value) ? 1 : parseInt(value);
                break;
        
            default:
                break;
        }
        newValue[index][field] = value;
        // setFormData(oldArray => ({
        //     ...oldArray,
        //     items: newValue
        // }));
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_DATA",
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
        newValue[index]["is_ppmp"] = true;
        newValue[index]["item_name"] = value;
        newValue[index]["item_id"] = item.id;
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_DATA",
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

    const displayError = (field) => {
        if(props.formErrors && props.formErrors[field]){
            return {
                validateStatus: 'error',
                help: props.formErrors[field][0]
            }
        }
    }
    
    return (
        <div id="pr-container" className='container'>
            <p className="text-right ...">Appendix 60</p>
            <p className="text-center ..."><b>PURCHASE REQUEST</b></p>
            <Form>
            <table id="pr-table" style={style}>
                <thead>
                    <tr>
                        <td colSpan={3}>Entity Name: <Input placeholder="Type here..." value="DSWD FO XI" /></td>
                        <td colSpan={3}>Fund Cluster: <Input placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'fund_cluster')} value={props.formData.fund_cluster} /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            Office/Section:
                            <Form.Item { ...displayError(`end_user`) }>
                                <Select
                                    showSearch
                                    value={props.formData.end_user}
                                    placeholder="Select a Unit"
                                    optionFilterProp="children"
                                    onChange={(e) => changeFieldValue(e, 'end_user', false)}
                                    style={{ width: "100%" }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    { props.sections.map((option, index) => (
                                        <Option value={option.id} key={option.id}>{option.name}</Option>
                                    )) }
                                </Select>
                            </Form.Item>
                        </td>
                        <td colSpan={2}>PR No.:
                            <Form.Item { ...displayError(`purchase_request_number`) }>
                                <Input placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'purchase_request_number')} value={props.formData.purchase_request_number} />
                            </Form.Item>
                        </td>
                        <td colSpan={2}></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={2}></td>
                        <td colSpan={2}>Responsibility Center Code:
                            <Form.Item { ...displayError(`purpose`) }>
                                <Input placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'center_code')} value={props.formData.center_code} />
                            </Form.Item>
                        </td>
                        <td colSpan={2}>Date:
                        <Form.Item { ...displayError(`pr_date`) }>
                            <DatePicker style={{width: "100%"}} onChange={(e, dateString) => changeFieldValue(dateString, 'pr_date', false)} />
                        </Form.Item>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='text-center'>Stock/ Property No.</td>
                        <td className='text-center' style={{ width: 120}}>Unit</td>
                        <td className='text-center' style={{ width: "40%"}}>Item Description</td>
                        <td className='text-center'>Quantity</td>
                        <td className='text-center'>Unit Cost</td>
                        <td className='text-center'>Total Cost</td>
                        <td><Button type="primary" onClick={() => { addItem() } }><PlusOutlined /></Button></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.formData.items.map((item, index) => (
                            <tr key={item.key}>
                                <td className='text-center'>
                                    <Form.Item { ...displayError(`items.${index}.item_code`) }>
                                        <Input placeholder="Type here..." onChange={(e) => changeTableFieldValue(e.target.value, item, 'item_code', index) } value={item.item_code} disabled={ item.is_ppmp } />
                                    </Form.Item>
                                </td>
                                <td className='text-center'>
                                    <Form.Item { ...displayError(`items.${index}.unit_of_measure_id`) }>
                                        <Select
                                            showSearch
                                            value={item.unit_of_measure_id}
                                            placeholder="Select a Unit"
                                            optionFilterProp="children"
                                            onChange={(e) => selectUnit(e, index)}
                                            style={{ width: "100%" }}
                                            disabled={ item.is_ppmp }
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            { props.unit_of_measures.map((option, index) => (
                                                <Option value={option.id} key={option.id}>{option.name}</Option>
                                            )) }
                                        </Select>
                                    </Form.Item>
                                </td>
                                <td>
                                    <Form.Item { ...displayError(`items.${index}.item_name`) }>
                                        <AutoComplete
                                            style={{ width: "100%" }}
                                            allowClear
                                            options={props.items}
                                            onSelect={(val, item) => selectItem(val, item, index)}
                                            placeholder="Type here..."
                                            filterOption={(input, option) =>
                                                option.item_name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(e) => {
                                                changeTableFieldValue(e, {}, 'item_name', index);
                                            }}
                                            disabled={ item.is_ppmp }
                                        />
                                    </Form.Item>
                                    {/* <Input placeholder="Type here..."  onChange={(e) => changeTableFieldValue(e.target.value, item, 'description', index) } value={item.description} /> */}
                                </td>
                                <td className='text-center'>
                                    <Form.Item { ...displayError(`items.${index}.quantity`) }>
                                        <Input type="number" min={1} autoComplete='off' placeholder="Type here..." onChange={(e) => changeTableFieldValue(e.target.value, item, 'quantity', index) } value={item.quantity} />
                                    </Form.Item>
                                    </td>
                                <td className='text-right'>
                                    <Form.Item { ...displayError(`items.${index}.unit_cost`) }>
                                        <Input type="number" autoComplete='off' step="0.01" placeholder="Type here..."  onChange={(e) => changeTableFieldValue(e.target.value, item, 'unit_cost', index) } value={item.unit_cost} />
                                    </Form.Item>
                                </td>
                                <td className='text-right'>{ new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format( (item.unit_cost * item.quantity) ) }</td>
                                <td className='text-right'><Button type="danger" onClick={() => deleteItem(item.key)}><DeleteOutlined /></Button></td>
                            </tr>
                        ))
                    }
                </tbody>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td className='text-center'>Total</td>
                        <td></td>
                        <td></td>
                        <td className='text-right'> { new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(  total_cost() )}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={7}>Purpose:
                            <Form.Item { ...displayError(`purpose`) }>
                                <Input placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'purpose')} value={props.formData.purpose} />
                            </Form.Item>
                        </td>
                    </tr>
                    {/* <tr>
                        <td colSpan={2} style={{borderBottom: 0}}><br /><br />Signature:</td>
                        <td style={{borderBottom: 0}}>Requested By<br /><br />&nbsp;</td>
                        <td colSpan={3} style={{borderBottom: 0}}><br /><br />&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{borderTop: 0, borderBottom: 0}}>Printed Name:</td>
                        <td style={{fontWeight: "bold",textAlign: "center",borderTop: 0, borderBottom: 0}}>MERLINDA A. PARAGAMAC</td>
                        <td colSpan={3} style={{fontWeight: "bold",textAlign: "center",borderTop: 0, borderBottom: 0}}>RONALD RYAN R. CUI</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{borderTop: 0}}>Designation:</td>
                        <td style={{ textAlign: "center", borderTop: 0}}>OIC-ARD for Administration</td>
                        <td colSpan={3} style={{ textAlign: "center", borderTop: 0}}>OIC - Regional Director</td>
                    </tr> */}
                </tbody>
            </table>
            </Form>
            <div className='text-center'>
                <br />
                <Button type="primary" onClick={() => savePurchaseRequest()}><SaveOutlined /> Save</Button>
                <Button type="danger" onClick={() => deleteItem()}><DeleteOutlined />Cancel</Button>
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Purchaserequest);