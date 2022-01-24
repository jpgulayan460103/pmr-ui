import React, { useState, useEffect } from 'react';
import style from './style.less'
import { debounce, isEmpty, cloneDeep } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, DatePicker, Form, notification  } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, FolderViewOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
        items: state.library.items,
        user_sections: state.library.user_sections,
        user_divisions: state.library.user_divisions,
        isLibrariesLoaded: state.library.isLibrariesLoaded,
        formData: state.purchaseRequest.formData,
        formType: state.purchaseRequest.formType,
        formErrors: state.purchaseRequest.formErrors,
        formProccess: state.purchaseRequest.formProccess,
        signatories: state.library.signatories,
        requestedBySignatory: state.purchaseRequest.requestedBySignatory,
        approvedBySignatory: state.purchaseRequest.approvedBySignatory,
        user: state.user.data,
    };
}

const { TextArea } = Input;
const { Option, OptGroup } = Select;

const CreatePurchaseRequest = (props) => {

    useEffect(() => {
        if(props.isLibrariesLoaded){
            if(props.formData.end_user_id){
            }else{
                changeFieldValue(props.user.signatories[0].office_id, 'end_user_id', false);
            }
        }
    }, [props.isLibrariesLoaded]);
    useEffect(() => {
        return function cleanup() {
            props.dispatch({
                type: "RESET_PURCHASE_REQUEST_FORM_DATA",
                data: {}
            });
          };
    }, []);
    
    const [tableKey, setTableKey] = useState(0);
    const savePurchaseRequest = debounce(() => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
            data: {}
        });
        let formData = cloneDeep(props.formData);
        formData.total_cost = total_cost();
        formData.requested_by_id = props.requestedBySignatory.id;
        formData.approved_by_id = props.approvedBySignatory.id;
        api.PurchaseRequest.save(formData,props.formType)
        .then(res => {
            notification.success({
                message: 'Purchase Request is successfully saved.',
                description:
                    'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
                }
            );

            clearForm();
        })
        .catch(err => {
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
                data: err.response.data.errors
            });
        })
        .then(res => {})
        ;
    }, 200);

    const clearForm = () => {
        props.dispatch({
            type: "RESET_PURCHASE_REQUEST_FORM_DATA",
            data: {}
        });
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_TYPE",
            data: "create"
        });
    }

    const previewPurchaseRequest = debounce(() => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
            data: {}
        });
        let formData = cloneDeep(props.formData);
        formData.total_cost = total_cost();
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
                type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
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
            unit_of_measure_id: null,
            item_name: null,
            quantity: 1,
            unit_cost: 0,
            total_unit_cost: 0,
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


    const setSignatory = (e, type) => {
        changeFieldValue(e, type, false)
        if(type == "requestedBy"){
            let signatory = props.signatories.filter(i => i.signatory_type == e);
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_REQUESTED_BY_SIGNATORY",
                data: signatory[0]
            });
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
                        <td colSpan={3}><b>Entity Name:</b> <Input placeholder="Type here..." value="DSWD FO XI" /></td>
                        <td colSpan={3}><b>Fund Cluster:</b> <Input placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'fund_cluster')} value={props.formData.fund_cluster} /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <b>Office/Section:</b>
                            <Form.Item { ...displayError(`end_user_id`) }>

                                <Select
                                    showSearch
                                    value={props.formData.end_user_id}
                                    placeholder="Section/Unit/Office"
                                    optionFilterProp="children"
                                    onChange={(e) => changeFieldValue(e, 'end_user_id', false)}
                                    style={{ width: "100%" }}
                                    filterOption={(input, option) =>
                                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    { props.user_divisions.map(division =>  {
                                        return (
                                            <OptGroup label={division.name}  key={division.id}>
                                                { props.user_sections?.filter(section => section.parent.name == division.name).map(section => {
                                                    return <Option value={section.id} key={section.id}>{`${section.name} - ${section.title}`}</Option>
                                                }) }
                                            </OptGroup>
                                        );
                                    }) }
                                </Select>
                            </Form.Item>
                        </td>
                        <td colSpan={2}><b>PR No.:</b>
                            <Form.Item { ...displayError(`purchase_request_number`) }>
                                <Input placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'purchase_request_number')} value={props.formData.purchase_request_number} />
                            </Form.Item>
                        </td>
                        <td colSpan={2}></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={2}></td>
                        <td colSpan={2}><b>Responsibility Center Code:</b>
                            <Form.Item { ...displayError(`center_code`) }>
                                <Input placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'center_code')} value={props.formData.center_code} />
                            </Form.Item>
                        </td>
                        <td colSpan={2}><b>Date:</b>
                        <Form.Item { ...displayError(`pr_date`) }>
                            <DatePicker defaultValue={dayjs(props.formData.pr_date, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} style={{width: "100%"}} onChange={(e, dateString) => changeFieldValue(dateString, 'pr_date', false)} />
                        </Form.Item>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='text-center'><b>Stock/ Property No.</b></td>
                        <td className='text-center' style={{ width: 120}}><b>Unit</b></td>
                        <td className='text-center' style={{ width: "40%"}}><b>Item Description</b></td>
                        <td className='text-center'><b>Quantity</b></td>
                        <td className='text-center'><b>Unit Cost</b></td>
                        <td className='text-center'><b>Total Cost</b></td>
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
                                            value={item.item_name}
                                            disabled={ item.is_ppmp }
                                        >
                                            <TextArea autoSize />
                                        </AutoComplete>
                                    </Form.Item>
                                    {/* <Input placeholder="Type here..."  onChange={(e) => changeTableFieldValue(e.target.value, item, 'description', index) } value={item.description} /> */}
                                </td>
                                <td className='text-center'>
                                    <Form.Item { ...displayError(`items.${index}.quantity`) }>
                                        <Input type="number" min={1} autoComplete='off' style={{ width: 100 }} placeholder="Type here..." onChange={(e) => changeTableFieldValue(e.target.value, item, 'quantity', index) } value={item.quantity} />
                                    </Form.Item>
                                    </td>
                                <td className='text-right'>
                                    <Form.Item { ...displayError(`items.${index}.unit_cost`) }>
                                        <Input type="number" autoComplete='off' style={{ width: 150 }} step="0.01" placeholder="Type here..."  onChange={(e) => changeTableFieldValue(e.target.value, item, 'unit_cost', index) } value={item.unit_cost} />
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
                        <td className='text-center'><b>Total</b></td>
                        <td></td>
                        <td></td>
                        <td className='text-right'> { new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(  total_cost() )}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={7}><b>Purpose:</b>
                            <Form.Item { ...displayError(`purpose`) }>
                                <TextArea autoSize placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'purpose')} value={props.formData.purpose} />
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{borderBottom: 0}}><br /><br /></td>
                        <td style={{borderBottom: 0}}>Requested By:
                            <Select style={{ width: "100%" }} onSelect={(e) => { setSignatory(e,'requestedBy') }} value={props.formData.requestedBy}>
                                { props.signatories.filter(i => i.signatory_type == "OARDA" || i.signatory_type == "OARDO").map(i => <Option value={i.signatory_type} key={i.key}>{ i.designation }</Option>) }
                            </Select>
                        <br /><br />&nbsp;</td>
                        <td colSpan={4} style={{borderBottom: 0}}>Approved by:
                        <Select style={{ width: "100%" }} onSelect={(e) => { setSignatory(e, 'approvedBy') }} value={props.formData.approvedBy}>
                            { props.signatories.filter(i => i.signatory_type == "ORD").map(i => <Option value={i.signatory_type} key={i.key}>{ i.designation }</Option>) }
                        </Select>
                        <br /><br />&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{borderTop: 0, borderBottom: 0}}>Printed Name:</td>
                        <td style={{fontWeight: "bold",textAlign: "center",borderTop: 0, borderBottom: 0}}>
                            { props.requestedBySignatory?.user?.user_information.fullname }
                        </td>
                        <td colSpan={4} style={{fontWeight: "bold",textAlign: "center",borderTop: 0, borderBottom: 0}}>
                            { props.approvedBySignatory?.user?.user_information.fullname }
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{borderTop: 0}}>Designation:</td>
                        <td style={{ textAlign: "center", borderTop: 0}}>
                            {/* { props.formData.requestedBy_designation } */}
                            { props.requestedBySignatory?.title } { props.requestedBySignatory?.designation }
                        </td>
                        <td colSpan={4} style={{ textAlign: "center", borderTop: 0}}>
                            {/* { props.formData.approvedBy_designation } */}
                            { props.approvedBySignatory?.title } { props.approvedBySignatory?.designation }
                        </td>
                    </tr>
                </tbody>
            </table>
            </Form>
            <div className='text-center'>
                <br />
                <Button type="default" onClick={() => previewPurchaseRequest()}><FolderViewOutlined />Preview</Button>
                <Button type="primary" onClick={() => savePurchaseRequest()}><SaveOutlined /> Save</Button>
                <Button type="danger" onClick={() => clearForm()}><DeleteOutlined />Cancel</Button>
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(CreatePurchaseRequest);