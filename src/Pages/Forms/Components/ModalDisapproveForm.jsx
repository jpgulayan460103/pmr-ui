import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Modal, Select } from 'antd';
import Icon, { CloseOutlined, FileZipFilled, BankOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import api from '../../../api';
import { debounce } from 'lodash';

const { TextArea } = Input;
const { Option } = Select;


function mapStateToProps(state) {
    return {
        user: state.user.data,
        accounts: state.libraries.accounts,
        uacsCodes: state.libraries.uacs_codes,
        accountClassifications: state.libraries.account_classifications,
        modeOfProcurements: state.libraries.mode_of_procurements,
        technicalWorkingGroups: state.libraries.technical_working_groups,
        userSections: state.libraries.user_sections,
    };
}

function ModalDisapproveForm({
    showModal,
    formData,
    setShowModal,
    setSubmit,
    setErrorMessage,
    setSelectedFormRoute,
    setSelectedForm,
    submit,
    routeOptions,
    selectedFormRoute,
    getForm,
}) {
    const formRef = React.useRef();

    useEffect(() => {
        formRef?.current?.setFieldsValue(formData);
        return () => {
            formRef?.current?.setFieldsValue({});
        };
    }, [formData]);


    const closeRejectForm = () => {
        formRef.current.resetFields();
        setShowModal(false);
        setSelectedFormRoute({});
        setSelectedForm({});
        setErrorMessage({});
    };

    const submitRejectForm = debounce((e) => {
        setErrorMessage({});
        setSubmit(true);
        let formData = {
            ...e,
        };
        api.Forms.reject(selectedFormRoute.id, formData)
        .then(res => {
            setSubmit(false);
            closeRejectForm();
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
        <Modal title="Disapproval Form" visible={showModal} 
            footer={[
                <Button type='primary' form="rejectForm" key="submit" htmlType="submit" disabled={submit} loading={submit}>
                    Submit
                </Button>,
                <Button form="rejectForm" key="cancel" onClick={() => closeRejectForm()}>
                    Cancel
                </Button>
                ]}
            onCancel={closeRejectForm}>
            <Form
                ref={formRef}
                name="normal_login"
                className="login-form"
                onFinish={(e) => submitRejectForm(e)}
                layout='vertical'
                id="rejectForm"
            >
                <Form.Item
                    name="remarks"
                    label="Remarks"
                    // rules={[{ required: true, message: 'Please add remarks' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="to_office_id"
                    label="Return to"
                    // rules={[{ required: true, message: 'Please select office.' }]}
                >
                    <Select>
                        { routeOptions.map((item, index) => <Option value={item.office_id} key={index}>{item.office_name}</Option> ) }
                    </Select>
                </Form.Item>

            </Form>
        </Modal>
    );
}

export default connect(
    mapStateToProps,
  )(ModalDisapproveForm);