import React, { useState, useEffect } from 'react';
import style from './style.less'
import { debounce, isEmpty, cloneDeep } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, AutoComplete, DatePicker, Form, notification, Modal  } from 'antd';
import Icon, { PlusOutlined, DeleteOutlined, SaveOutlined, FolderViewOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import moment from 'moment';
import helpers from '../../Utilities/helpers';

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
        items: state.library.items,
        user_sections: state.library.user_sections,
        user_divisions: state.library.user_divisions,
        user_signatory_designations: state.library.user_signatory_designations,
        user_signatory_names: state.library.user_signatory_names,
        formData: state.purchaseRequest.formData,
        formType: state.purchaseRequest.formType,
        formErrors: state.purchaseRequest.formErrors,
        formProccess: state.purchaseRequest.formProccess,
        requestedBySignatory: state.purchaseRequest.requestedBySignatory,
        approvedBySignatory: state.purchaseRequest.approvedBySignatory,
        user: state.user.data,
        isInitialized: state.user.isInitialized,
    };
}

const { TextArea } = Input;
const { Option, OptGroup } = Select;

const CreatePurchaseRequest = (props) => {
    useEffect(() => {
        if(props.isInitialized){
            if(props.formData.end_user_id){
            }else{
                if(!isEmpty(props.user)){
                    let reqBy = "OARDA";
                    if(props.user.user_offices.data[0].office.parent.title === "OARDA" || props.user.user_offices.data[0].office.parent.title === "OARDO"){
                        reqBy = props.user.user_offices.data[0].office.parent.title;
                    }
                    props.dispatch({
                        type: "SET_PURCHASE_REQUEST_FORM_DATA",
                        data: {
                            ...props.formData,
                            end_user_id: props.user.user_offices.data[0].office_id,
                            requestedBy: reqBy
                        }
                    });
                }
            }
            if(isEmpty(props.requestedBySignatory)){
                let reqBy = "OARDA";
                if(props.user.user_offices.data[0].office.parent.title === "OARDA" || props.user.user_offices.data[0].office.parent.title === "OARDO"){
                    reqBy = props.user.user_offices.data[0].office.parent.title;
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
            props.dispatch({
                type: "SET_LIBRARY_ITEMS",
                data: res.data.data
            });
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const savePurchaseRequest = debounce(() => {
        setSubmit(true);
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
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
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
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
        })
        .then(res => {})
        ;
    }, 200);

    const clearForm = async () => {
        props.dispatch({
            type: "RESET_PURCHASE_REQUEST_FORM_DATA",
            data: {
                end_user_id: props.user.user_offices.data[0].office_id,
            }
        });
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_TYPE",
            data: "create"
        });
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
            data: {}
        });

        setSignatory("OARDA",'requestedBy');
        setSignatory("ORD", 'approvedBy');
    }

    const previewPurchaseRequest = debounce(() => {
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_ERRORS",
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
            type: "SET_PURCHASE_REQUEST_FORM_DATA",
            data: {
                ...props.formData,
                items: [...props.formData.items, newValue]
            }
        });
    }

    const deleteItem = (key) => {
        let newValue = props.formData.items.filter(item => item.key !== key)
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_FORM_DATA",
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

    const setSignatory = (e, type) => {
        if(type == "requestedBy"){
            let user_office = props.user_signatory_names.filter(i => i.title == e);
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_REQUESTED_BY_SIGNATORY",
                data: user_office[0]
            });
        }else{
            let user_office = props.user_signatory_names.filter(i => i.title == e);
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_APPROVED_BY_SIGNATORY",
                data: user_office[0]
            });
        }
    }
    
    return (
        <div id="pr-container" className='container-fuild bg-white p-16'>
            {/* <p className="text-right ...">Appendix 60</p> */}
            <p className="text-center ..."><b>PURCHASE REQUEST</b></p>
            <Form>
            <table id="pr-table" style={style}>
                <thead>
                    {/* <tr>
                        <td colSpan={3}><b>Entity Name:</b><br />
                        Department of Social Welfare and Development Field Office XI
                        <Input placeholder="Type here..." value="Department of Social Welfare and Development Field Office XI" disabled />
                        </td>
                        <td colSpan={3}><b>Fund Cluster:</b>
                        <Input placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'fund_cluster')} value={props.formData.fund_cluster} disabled />
                        </td>
                        <td></td>
                    </tr> */}
                    <tr>
                        <td colSpan={2}>
                            <b>Office/Section:</b><br />
                            { props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name }
                            {/* <Form.Item { ...helpers.displayError(props.formErrors, `end_user_id`) }>

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
                                    disabled
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
                            </Form.Item> */}
                        </td>
                        <td colSpan={2}>
                            <b>Title:</b>
                            <Form.Item { ...helpers.displayError(props.formErrors, `title`) }>
                                <Input placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'title')} value={props.formData.title} />
                            </Form.Item>
                            {/* <b>PR No.:</b> */}
                            {/* <Form.Item { ...helpers.displayError(props.formErrors, `purchase_request_number`) }> */}
                                {/* <Input disabled placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'purchase_request_number')} value={props.formData.purchase_request_number} /> */}
                            {/* </Form.Item> */}
                        </td>
                        <td colSpan={2}>
                        <b>Date:</b><br />
                            { moment().format('MM/DD/YYYY') }
                        {/* <Form.Item { ...helpers.displayError(props.formErrors, `pr_date`) }> */}
                            {/* <DatePicker disabled defaultValue={dayjs(props.formData.pr_date, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} style={{width: "100%"}} onChange={(e, dateString) => changeFieldValue(dateString, 'pr_date', false)} /> */}
                        {/* </Form.Item> */}
                        </td>
                        <td></td>
                    </tr>
                    {/* <tr> */}
                        {/* <td colSpan={2}></td> */}
                        {/* <td colSpan={2}><b>Responsibility Center Code:</b> */}
                            {/* <Form.Item { ...helpers.displayError(props.formErrors, `center_code`) }> */}
                                {/* <Input disabled placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'center_code')} value={props.formData.center_code} /> */}
                            {/* </Form.Item> */}
                        {/* </td> */}
                        {/* <td colSpan={2}> */}
                            {/* <b>Date:</b><br /> */}
                            {/* { moment().format('MM/DD/YYYY') } */}
                        {/* <Form.Item { ...helpers.displayError(props.formErrors, `pr_date`) }> */}
                            {/* <DatePicker disabled defaultValue={dayjs(props.formData.pr_date, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} style={{width: "100%"}} onChange={(e, dateString) => changeFieldValue(dateString, 'pr_date', false)} /> */}
                        {/* </Form.Item> */}
                        {/* </td> */}
                        {/* <td></td> */}
                    {/* </tr> */}
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
                                    <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.item_code`) }>
                                        { item.item_code }
                                        {/* <Input placeholder="Type here..." onChange={(e) => changeTableFieldValue(e.target.value, item, 'item_code', index) } value={item.item_code} disabled /> */}
                                    </Form.Item>
                                </td>
                                <td className='text-center'>
                                    <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.unit_of_measure_id`) }>
                                        { item.is_ppmp ? props.unit_of_measures.filter(i => i.id == item.unit_of_measure_id)[0].name : (<Select
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
                                </td>
                                <td>
                                    <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.item_name`) }>
                                        { item.is_ppmp ? item.item_name : (
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
                                            >
                                                <TextArea autoSize />
                                            </AutoComplete>
                                        ) }
                                    </Form.Item>
                                    {/* <Input placeholder="Type here..."  onChange={(e) => changeTableFieldValue(e.target.value, item, 'description', index) } value={item.description} /> */}
                                </td>
                                <td className='text-center'>
                                    <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.quantity`) }>
                                        <Input type="number" min={1} autoComplete='off' style={{ width: 100 }} placeholder="Type here..." onChange={(e) => changeTableFieldValue(e.target.value, item, 'quantity', index) } value={item.quantity} />
                                    </Form.Item>
                                    </td>
                                <td className='text-right'>
                                    <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.unit_cost`) }>
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
                            <Form.Item { ...helpers.displayError(props.formErrors, `purpose`) }>
                                <Input addonBefore={props.formType == 'update' ? "" : "For the implementation of "} onChange={(e) => changeFieldValue(e, 'purpose')} value={props.formData.purpose} />
                                {/* <TextArea addonBefore="+" autoSize placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'purpose')} value={props.formData.purpose} /> */}
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{borderBottom: 0}}><br /><br /></td>
                        <td style={{borderBottom: 0}}>Requested By:
                        <Form.Item { ...helpers.displayError(props.formErrors, `requested_by_id`) }>
                            <Select style={{ width: "100%" }} onSelect={(e) => { changeFieldValue(e, 'requestedBy', false); setSignatory(e,'requestedBy') }} value={props.formData.requestedBy} placeholder="Select Signatory">
                                { props.user_signatory_designations.filter(i => i.title == "OARDA" || i.title == "OARDO").map(i => <Option value={i.title} key={i.key}>{ i.name }</Option>) }
                            </Select>
                        </Form.Item>
                        <br /><br />&nbsp;</td>
                        <td colSpan={4} style={{borderBottom: 0}}>Approved by:
                        <Form.Item { ...helpers.displayError(props.formErrors, `approved_by_id`) }>
                            <Select style={{ width: "100%" }} onSelect={(e) => { changeFieldValue(e, 'approvedBy', false); setSignatory(e, 'approvedBy') }} value={props.formData.approvedBy} placeholder="Select Signatory">
                                { props.user_signatory_designations.filter(i => i.title == "ORD").map(i => <Option value={i.title} key={i.name}>{ i.name }</Option>) }
                            </Select>
                        </Form.Item>
                        <br /><br />&nbsp;</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{borderTop: 0, borderBottom: 0}}>Printed Name:</td>
                        <td style={{fontWeight: "bold",textAlign: "center",borderTop: 0, borderBottom: 0}}>
                            { props.requestedBySignatory?.name }
                        </td>
                        <td colSpan={4} style={{fontWeight: "bold",textAlign: "center",borderTop: 0, borderBottom: 0}}>
                            { props.approvedBySignatory?.name }
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{borderTop: 0}}>Designation:</td>
                        <td style={{ textAlign: "center", borderTop: 0}}>
                            {/* { props.formData.requestedBy_designation } */}
                            { props.requestedBySignatory?.parent?.name }
                        </td>
                        <td colSpan={4} style={{ textAlign: "center", borderTop: 0}}>
                            {/* { props.formData.approvedBy_designation } */}
                            { props.approvedBySignatory?.parent?.name }
                        </td>
                    </tr>
                </tbody>
            </table>
            </Form>
            <div className='text-center'>
                
                <br />
                {/* <p style={{color: "red"}}>
                    { helpers.displayError(props.formErrors,'items')?.help }
                </p> */}
                <Button type="default" onClick={() => previewPurchaseRequest()}><FolderViewOutlined />Preview</Button>
                <Button type="primary" onClick={() => savePurchaseRequest()} disabled={submit} loading={submit}><SaveOutlined /> Save</Button>
                <Button type="danger" onClick={() => clearForm()}><DeleteOutlined />Cancel</Button>

            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(CreatePurchaseRequest);