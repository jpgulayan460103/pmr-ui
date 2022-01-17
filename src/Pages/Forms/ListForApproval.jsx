import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography, Popconfirm, notification, Modal, Form, Input, Select } from 'antd';
import api from '../../api';
import { CloseOutlined, SelectOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;


function mapStateToProps(state) {
    return {

    };
}

const ListForApproval = () => {
    const formRef = React.useRef();
    useEffect(() => {
        getForm();
    }, []);
    const [forms, setForms] = useState([]);
    const [formOutput, setFormOutput] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [modalRejectForm, setModalRejectForm] = useState(false);
    const [routeOptions, setRouteOptions] = useState([]);
    const [formRoute, setFormRoute] = useState({});

    const showRejectForm = (formRouteItem) => {
        setFormRoute(formRouteItem)
        setModalRejectForm(true);
        let options = formRouteItem.form_process.form_routes.filter(i => i.status == "approve" || i.status == "approved");
        setRouteOptions(options);
        setTimeout(() => {
            formRef.current.setFieldsValue({
                to_office_id: formRouteItem.origin_office_id,
            });
        }, 150);
        return false;
       
    }

    const submitRejectForm = (val) => {
        let formData = {
            ...val,
            from_office_id: formRoute.to_office_id,
            route_type: formRoute.route_type,
            rejected_route_id: formRoute.id,
            origin_office_id: formRoute.origin_office_id,
            form_routable_id: formRoute.form_routable_id,
            form_routable_type: formRoute.form_routable_type,
            form_process_id: formRoute.form_process_id,
        };
        console.log(formData);
        // setModalRejectForm(false);
    };
    const cancelRejectForm = () => {
        setModalRejectForm(false);
    };

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
                    <Popconfirm icon="" title="" okText="Approve" cancelText="Reject" onConfirm={() => confirm(item) } onCancel={() => { showRejectForm(item, index) }}>
                        {/* <a href="#">Delete</a> */}
                        <span className='custom-pointer' onClick={() => { respondForm(item, index) }}>Respond</span>
                    </Popconfirm>
                </Space>
            )
        },
    ];
    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <Modal title="Reject Form" visible={modalRejectForm} onOk={(e) => submitRejectForm(e)} onCancel={cancelRejectForm} 
            footer={[
                <Button form="rejectForm" key="submit" htmlType="submit">
                    Submit
                </Button>,
                <Button form="rejectForm" key="cancel" htmlType="submit">
                    Cancel
                </Button>
                ]}>
            <Form
                ref={formRef}
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true, username: "jpgulayan", password: "admin123" }}
                onFinish={(e) => submitRejectForm(e)}
                layout='vertical'
                id="rejectForm"
            >
                <Form.Item
                    name="remarks"
                    label="Remarks"
                    rules={[{ required: true, message: 'Please add remarks' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="to_office_id"
                    label="Return to"
                    rules={[{ required: true, message: 'Please select office.' }]}
                >
                    <Select>
                        { routeOptions.map((item, index) => <Option value={item.office_id} key={index}>{item.office_name}</Option> ) }
                    </Select>
                </Form.Item>

            </Form>
            </Modal>
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
