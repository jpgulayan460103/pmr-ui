import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography, Popconfirm, notification } from 'antd';
import api from '../../api';
import { CloseOutlined, SelectOutlined, CheckCircleTwoTone } from '@ant-design/icons';

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
    
    const openInFull = () => {
        window.open(`${formOutput}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }

    const viewForm = (item, index) => {
        setFormOutput(item.form_routable.file);
        setSelectedIndex(index)
    }
    const respondForm = (item, index) => {
        // setFormOutput(item.form_routable.file);
        setSelectedIndex(index)
    }
    const closeForm = () => {
        setFormOutput("");
        setSelectedIndex(null);
    }

    const confirm = (item) => {
        api.Forms.approve(item.id)
        .then(res => {
            notification.success({
                message: 'Purchase Request is approved.',
                description:
                    'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
                }
            );
            getForm();
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const dataSource = forms
      
    const columns = [
        {
            title: 'Form Type',
            dataIndex: 'route_type',
            key: 'route_type',
        },
        {
            title: 'Particulars',
            key: 'particulars',
            render: (text, item, index) => (
                <span>
                    { item.form_routable.particulars }
                </span>
            )
        },
        {
            title: 'End User',
            key: 'end_user',
            render: (text, item, index) => (
                <span style={{ whiteSpace: "pre-line"}}>
                    { item.end_user.name }
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, item, index) => (
                <Space size={2}>
                    <span className='custom-pointer' onClick={() => { viewForm(item, index) }}>View</span>
                    <Divider type="vertical" />
                    <Popconfirm icon="" title="" okText="Approve" cancelText="Reject" onConfirm={() => confirm(item) }>
                        {/* <a href="#">Delete</a> */}
                        <span className='custom-pointer' onClick={() => { respondForm(item, index) }}>Respond</span>
                    </Popconfirm>
                </Space>
            )
        },
    ];
    
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
                { formOutput == "" ? "" : 
                    (
                        <div>
                            <div className='text-right'>
                                <Button size='large' type='primary' onClick={() => openInFull() }><SelectOutlined /></Button>
                                <Button size='large' type='danger' onClick={() => closeForm() }><CloseOutlined /></Button>
                            </div>
                        </div>
                    )
                }
                {
                    formOutput == "" ? "" : (<iframe src={`${formOutput}?view=1`} width="100%" height="100%"></iframe>) 
                }
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ListForApproval);
