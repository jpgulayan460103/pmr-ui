import React, { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { debounce } from 'lodash';
import helpers from '../Utilities/helpers';
import api from '../api';

const { TextArea } = Input;

function ArchiveForm({
    reloadData,
    selectedForm,
    setArchiveModal,
    archiveModal,
    formType
}) {
    const formRef = React.useRef();
    const [submit, setSubmit] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    

    const submitForm = debounce((values) => {
        setFormErrors({});
        setSubmit(true);
        let { remarks } = values;
        let formData = {
            remarks,
            id: selectedForm.id
        }
        api.Forms.archive(formData, formType)
        .then(res => {
            setSubmit(false);
            setArchiveModal(false);
            reloadData();
            formRef.current.resetFields();
        })
        .catch(err => {
            setSubmit(false);
            setFormErrors(err.response.data.errors);
        })
        .then(res => {});
    }, 250)

    const handleOk = () => {
        setArchiveModal(false);
    }

    const handleCancel = () => {
        setArchiveModal(false);
        formRef.current.resetFields();
    }
    
    return (
        <div>
            <Modal title="Archive Form" visible={archiveModal} onOk={handleOk} onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button form="myForm" key="submit" htmlType="submit"  type='primary' loading={submit} disabled={submit}>
                        Submit
                    </Button>
                ]}
            >
                <Form
                    ref={formRef}
                    name="normal_login"
                    className="login-form"
                    layout="vertical"
                    onFinish={submitForm}
                    id="myForm"
                >
                    <Form.Item
                        label="Remarks/Justification"
                        name="remarks"
                        rules={[
                            {
                                required: true,
                                message: 'The remarks field is required.',
                            },
                        ]}
                        { ...helpers.displayError(formErrors, `remarks`)  }
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ArchiveForm;