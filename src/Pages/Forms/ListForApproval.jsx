import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography  } from 'antd';
import api from '../../api';
import { CloseOutlined, HeartTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

const { Title } = Typography;


function mapStateToProps(state) {
    return {

    };
}

const ListForApproval = () => {
    useEffect(() => {
        getForm();
    }, []);
    const [forms, setForms] = useState([]);
    const [formOutput, setFormOutput] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);

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


    const openForm = (item, index) => {
        setFormOutput(item.purchase_request_uuid);
        setSelectedIndex(index)
    }
    const closeForm = () => {
        setFormOutput("");
        setSelectedIndex(null);
    }
    const approveForm = (item, index) => {
        openForm(item, index)
        api.Form.approve(item.id)
        .then(res => {
            getForm();
            closeForm();
        })
        .catch(err => {})
        .then(res => {})
        ;
    }


    const dataSource = forms
      
    const columns = [];
    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <div className='col-md-8'>
                <Title level={2} className='text-center'>Approval of Forms</Title>
                <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                    if(selectedIndex == index){
                        return "selected-row";
                    }
                }} />
            </div>
            <div className='col-md-4'>
                { formOutput == "" ? "" : <div className='text-right'>
                    <Button type='danger' onClick={() => closeForm() }><CloseOutlined /></Button>
                </div> }
                {
                    formOutput == "" ? "" : (<iframe src={`http://pmr-api.test/api/pdf/purchase-requests/${formOutput}?view=1`} width="100%" height="100%"></iframe>) 
                }
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ListForApproval);
