import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Typography, Tooltip, notification, Modal, Form, Input, Select, Card, Col, Row, Dropdown, Menu } from 'antd';
import Icon, { CloseOutlined, FileZipFilled, BankOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import _, { cloneDeep, debounce, isEmpty } from 'lodash';
import helpers from '../../../Utilities/helpers';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;


function mapStateToProps(state) {
    return {
        user: state.user.data,
        accounts: state.libraries.accounts,
        accountClassifications: state.libraries.account_classifications,
        modeOfProcurements: state.libraries.mode_of_procurements,
        technicalWorkingGroups: state.libraries.technical_working_groups,
        userSections: state.libraries.user_sections,
    };
}

function ModalProcurementForm({
    showModal,
    setShowModal,
    setErrorMessage,
    setSubmit,
    selectedFormRoute,
    setSelectedFormRoute,
    setSelectedForm,
    approve,
    setProcurementFormType,
    procurementFormType,
    submit,
    errorMessage,
    setSelectedAccountClassification,
    selectedAccountClassification,
    technicalWorkingGroups,
    modeOfProcurements,
    accountClassifications,
    accounts,
}) {

    const procurementFormRef = React.useRef();

    const closeProcurementForm = () => {
        procurementFormRef.current.resetFields();
        setProcurementFormType("");
        setShowModal(false);
        setSelectedFormRoute({});
        setSelectedForm({});
        setErrorMessage({});
    }

    const submitProcurementForm = debounce(async (e) => {
        setErrorMessage({});
        setSubmit(true);
        if(selectedFormRoute.route_type == "purchase_request"){
            let formData = {
                ...e,
                type: procurementFormType,
            }
            try {
                await approve(selectedFormRoute, formData);
                setSubmit(false);
                setErrorMessage({});
                closeProcurementForm();
            } catch (error) {
                setErrorMessage(error.response.data.errors);
                setSubmit(false);
            }
        }
    }, 150);
    return (
        <Modal title="Procurement Approval Form" visible={showModal} 
            footer={[
                procurementFormType !="" ? (<Button type='primary' form="procurementForm" key="submit" htmlType="submit" disabled={submit} loading={submit}>
                    Submit
                </Button>) : ""
                ,
                <Button form="procurementForm" key="cancel" onClick={() => closeProcurementForm()}>
                    Cancel
                </Button>
                ]}
            onCancel={closeProcurementForm}
            >
            <Form
                ref={procurementFormRef}
                name="normal_login"
                className="login-form"
                onFinish={(e) => submitProcurementForm(e)}
                layout='vertical'
                id="procurementForm"
            >

                { selectedFormRoute.route_code != "pr_approval_from_proc" ? (
                    <Form.Item
                        name="type"
                        label="Action"
                        // rules={[{ required: true, message: 'Please select Procurement Description.' }]}
                        { ...helpers.displayError(errorMessage, 'type') }
                    >
                        <Select placeholder='Select Action' onChange={(e) => setProcurementFormType(e)}>
                            <Option value="twg">Forward to Technical Working Group</Option>
                            <Option value="approve">Proceed to Approval</Option>
                        </Select>
                    </Form.Item>
                ) : "" }

                { procurementFormType == "twg" ? (
                    <Form.Item
                        name="technical_working_group_id"
                        label="Technical Working Groups"
                        // rules={[{ required: true, message: 'Please select Technical Working Group.' }]}
                        { ...helpers.displayError(errorMessage, 'technical_working_group_id') }
                    >
                        <Select placeholder='Select Technical Working Groups'>
                            { technicalWorkingGroups.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                        </Select>
                    </Form.Item>
                ) : "" }
                { procurementFormType == "approve" ? (
                    <>
                        <Form.Item
                            name="account_classification"
                            label="Procurement Description Classification"
                            { ...helpers.displayError(errorMessage, 'account_classification') }
                            // rules={[{ required: true, message: 'Please select Procurement Description Classification.' }]}
                        >
                            <Select placeholder='Select Procurement Description Classification' onSelect={(e) => {
                                procurementFormRef.current.setFieldsValue({
                                    account_id: null,
                                });
                                setSelectedAccountClassification(e);
                            }}>
                                { accountClassifications.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                            </Select>
                        </Form.Item>

                        {
                            selectedAccountClassification != null ? (
                                <Form.Item
                                    name="account_id"
                                    label="Procurement Description"
                                    { ...helpers.displayError(errorMessage, 'account_id') }
                                    // rules={[{ required: true, message: 'Please select Procurement Description.' }]}
                                >
                                    <Select placeholder='Select Procurement Description Classification' allowClear > 
                                        { accounts.filter(i => i.parent.id == selectedAccountClassification).map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                    </Select>
                                </Form.Item>
                            ) : ""
                        }

                        <Form.Item
                            name="mode_of_procurement_id"
                            label="Mode of Procurement"
                            { ...helpers.displayError(errorMessage, 'mode_of_procurement_id') }
                            // rules={[{ required: true, message: 'Please select Mode of Procurement.' }]}
                        >
                            <Select placeholder='Select Mode of Procurement'>
                                { modeOfProcurements.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                            </Select>
                        </Form.Item>
                    </>
                ) : "" }
                                    
            </Form>
        </Modal>
    );
}

export default connect(
    mapStateToProps,
  )(ModalProcurementForm);