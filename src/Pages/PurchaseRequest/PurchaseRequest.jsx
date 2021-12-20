import React, { useState } from 'react';
import style from './style.less'

import { Button, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Purchaserequest = () => {

    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});
    const [tableKey, setTableKey] = useState(0);

    const addItem = () => {
        setTableKey(tableKey + 1);
        let newValue = {
            key: tableKey + 1,
            code: "",
            unit_of_measure: "",
            description: "",
            quantity: 0,
            unit_cost: 0,
            total_cost: 0,
        };
        setData(oldArray => [...oldArray,newValue]);
    }

    const deleteItem = (key) => {
        let newValue = data.filter(item => item.key !== key)
        setData(newValue);
    }

    const changeFieldValue = (e, field) => {
        let value = e.target.value;
        setFormData(oldArray => ({
            ...oldArray,
            [field]: value
        }));
    }

    const changeTableFieldValue = (e, item, field, index) => {
        let value = e.target.value;
        let newValue = data;
        switch (field) {
            case 'unit_cost':
                value = isNaN(value) || value == "" ? 0 : parseFloat(value);
                break;
            case 'quantity':
                value =  isNaN(value) || value == "" ? 0 : parseInt(value);
                break;
        
            default:
                break;
        }
        newValue[index][field] = value;
        // console.log(newValue);
        setFormData(oldArray => ({
            ...oldArray,
            items: newValue
        }));
    }

    const total_cost = () => {
        return data.reduce((sum, item) => {
            return sum += (item.quantity * item.unit_cost);
        }, 0);
    }
    return (
        <div id="pr-container" className='container'>
            <p className="text-right ...">Appendix 60</p>
            <p className="text-center ..."><b>PURCHASE REQUEST</b></p>
            <table id="pr-table" style={style}>
                <thead>
                    <tr>
                        <td colSpan={3}>Entity Name: <Input placeholder="Type here..." value="DSWD FO XI" /></td>
                        <td colSpan={3}>Fund Cluster: <Input placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'fund_cluster')} value={formData.fund_cluster} /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={2}>Office/Section: <Input placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'end_user')} value={formData.end_user} /></td>
                        <td colSpan={2}>PR No.: <Input placeholder="Type here..." onChange={(e) => changeFieldValue(e, 'purchase_order_number')} value={formData.purchase_order_number} /></td>
                        <td colSpan={2}></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={2}></td>
                        <td colSpan={2}>Responsibility Center Code: <Input placeholder="Type here..."  onChange={(e) => changeFieldValue(e, 'center_code')} value={formData.center_code} /></td>
                        <td colSpan={2}>Date: <Input placeholder="Type here..." /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className='text-center'>Stock/ Property No.</td>
                        <td className='text-center'>Unit</td>
                        <td className='text-center' style={{ width: "40%"}}>Item Description</td>
                        <td className='text-center'>Quantity</td>
                        <td className='text-center'>Unit Cost</td>
                        <td className='text-center'>Total Cost</td>
                        <td><Button type="primary" onClick={() => { addItem() } }><PlusOutlined /></Button></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, index) => (
                            <tr key={item.key}>
                                <td className='text-center'><Input placeholder="Type here..." onChange={(e) => changeTableFieldValue(e, item, 'code', index) } value={item.code} /></td>
                                <td className='text-center'><Input placeholder="Type here..." onChange={(e) => changeTableFieldValue(e, item, 'unit_of_measure', index) } value={item.unit_of_measure} /></td>
                                <td><Input placeholder="Type here..."  onChange={(e) => changeTableFieldValue(e, item, 'description', index) } value={item.description} /></td>
                                <td className='text-center'><Input type="number" placeholder="Type here..." onChange={(e) => changeTableFieldValue(e, item, 'quantity', index) } value={item.quantity} /></td>
                                <td className='text-right'><Input type="number" step="0.01" placeholder="Type here..."  onChange={(e) => changeTableFieldValue(e, item, 'unit_cost', index) } value={item.unit_cost} /></td>
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
                        <td colSpan={7}>Purpose: <Input placeholder="Type here..." /></td>
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
            <div className='text-center'>
                <br />
                <Button type="primary" onClick={() => deleteItem()}><SaveOutlined /> Save</Button>
                <Button type="danger" onClick={() => deleteItem()}><DeleteOutlined />Cancel</Button>
            </div>
        </div>
    );
}

export default Purchaserequest;
