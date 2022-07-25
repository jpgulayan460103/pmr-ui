import React from 'react';
import { Table, Button, Typography, Tooltip, notification, Modal, Form, Input, Select, Card, Col, Row, Dropdown, Menu } from 'antd';
import Icon, { CloseOutlined, FileZipFilled, BankOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import api from '../../../api';

const { TextArea } = Input;
const { Option } = Select;


function ModalResolveForm({
    showModal,
    setShowModal,
    setSelectedFormRoute,
    setSelectedForm,
    setSubmit,
    setErrorMessage,
    getForm,
    selectedFormRoute,
    submit,
}) {

    const resolveFormRef = React.useRef();

    const closeResolveForm = () => {
        resolveFormRef.current.resetFields();
        setShowModal(false);
        setSelectedFormRoute({});
        setSelectedForm({});
    };


    const submitResolveForm = debounce((e) => {
        setSubmit(true);
        setErrorMessage({});
        let formData = {
            ...e,
        };
        api.Forms.approve(selectedFormRoute.id, formData)
        .then(res => {
            let alertMessage = res.data.alert_message;
            notification.success({
                message: `${alertMessage.message} ${alertMessage.status}`,
                description: alertMessage.action_taken,
            });
            setSubmit(false);
            closeResolveForm();
            setErrorMessage({});
            getForm();
        })
        .catch(err => {
            setSubmit(false);
        })
        .then(res => {
            setSubmit(false);
        })
        ;
    }, 250);


    return (
        <Modal title="Resolve Form" visible={showModal} 
            footer={[
                <Button type='primary' form="resolveForm" key="submit" htmlType="submit" disabled={submit} loading={submit}>
                    Submit
                </Button>,
                <Button form="resolveForm" key="cancel" onClick={() => closeResolveForm()}>
                    Cancel
                </Button>
                ]}
            onCancel={closeResolveForm}>
            <Form
                ref={resolveFormRef}
                name="normal_login"
                className="login-form"
                onFinish={(e) => submitResolveForm(e)}
                layout='vertical'
                id="resolveForm"
            >
                <Form.Item
                    name="remarks"
                    label="Remarks"
                    // rules={[{ required: true, message: 'Please add remarks' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalResolveForm;