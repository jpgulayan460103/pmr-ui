import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Typography, Tooltip, notification, Modal, Form, Input, Select, Card, Col, Row, Dropdown, Menu } from 'antd';
import Icon, { CloseOutlined, FileZipFilled, BankOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import _, { cloneDeep, debounce, isEmpty } from 'lodash';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;


function mapStateToProps(state) {
    return {
        uacsCodes: state.libraries.uacs_codes,
    };
}


function ModalBudgetForm({
    showModal,
    setModalBudgetForm,
    setSelectedFormRoute,
    setSelectedForm,
    setErrorMessage,
    selectedFormRoute,
    setSubmit,
    submit,
    approve,
    addOn,
    setAddOn,
    errorMessage,
    uacsCodes,
    formData
}) {

    useEffect(() => {
        formRef?.current?.setFieldsValue(formData);
        return () => {
            formRef?.current?.setFieldsValue({});
        };
    }, [formData]);

    const formatPrNumber = (e) => {
        let pr_last = e.target.value;
        let padded_pr_last = pr_last.padStart(5, '0');
        formRef.current.setFieldsValue({
            pr_number_last: padded_pr_last,
        });
    }


    const formRef = React.useRef();

    const closeBudgetForm = () => {
        formRef.current.resetFields();
        setModalBudgetForm(false);
        setSelectedFormRoute({});
        setSelectedForm({});
        setErrorMessage({});
    }

    const submitBudgetForm = debounce(async (e) => {
        setErrorMessage({});
        setSubmit(true);
        let formData = {
            ...e,
            pr_number: `${addOn}${e.pr_number_last}`,
            updater: "budget",
        };
        if(selectedFormRoute.route_type == "purchase_request"){
            try {
                await approve(selectedFormRoute, formData);
                closeBudgetForm();
                setSubmit(false);
            } catch (error) {
                setErrorMessage(error.response.data.errors);
                setSubmit(false);
            }
        }
    }, 150);
    return (
        <Modal title="Budget Approval Form" visible={showModal} 
            footer={[
                <Button type='primary' form="budgetForm" key="submit" htmlType="submit" disabled={submit} loading={submit}>
                    Submit
                </Button>,
                <Button form="budgetForm" key="cancel" onClick={() => closeBudgetForm()}>
                    Cancel
                </Button>
                ]}
            onCancel={closeBudgetForm}>
            <Form
                ref={formRef}
                name="normal_login"
                className="login-form"
                onFinish={(e) => submitBudgetForm(e)}
                layout='vertical'
                id="budgetForm"
            >

                <Form.Item
                    name="pr_number_last"
                    label="Purchase Request Number"
                    rules={[{ required: true, message: 'Please input Purchase Request Number.' }]}
                    { ...helpers.displayError(errorMessage, 'pr_number') }
                >
                    <Input onBlur={(e) => formatPrNumber(e)} addonBefore={(
                        <Select onChange={setAddOn} defaultValue={ `BUDRP-PR-${dayjs().format("YYYY-MM-")}` } className="select-after">
                            <Option value={ `BUDRP-PR-${dayjs().format("YYYY-MM-")}` }>{ `BUDRP-PR-${dayjs().format("YYYY-MM-")}` }</Option>
                            <Option value={ `BUDSP-PR-${dayjs().format("YYYY-MM-")}` }>{ `BUDSP-PR-${dayjs().format("YYYY-MM-")}` }</Option>
                        </Select>
                    )} placeholder="Purchase Request Number" />
                </Form.Item>

                <Form.Item
                    name="fund_cluster"
                    label="Fund Cluster"
                    // rules={[{ required: true, message: 'Please input Fund Cluster.' }]}
                    { ...helpers.displayError(errorMessage, 'fund_cluster') }
                >
                    <Input placeholder="Fund Cluster" />
                </Form.Item>

                <Form.Item
                    name="center_code"
                    label="Responsibility Center Code"
                    // rules={[{ required: true, message: 'Please input Responsibility Center Code.' }]}
                    { ...helpers.displayError(errorMessage, 'center_code') }
                >
                    <Input placeholder="Responsibility Center Code" />
                </Form.Item>
                <Form.Item
                    name="charge_to"
                    label="Charge To"
                    rules={[{ required: true, message: 'Please where to charge' }]}
                    { ...helpers.displayError(errorMessage, 'charge_to') }
                >
                    <Input placeholder='Charge to' />
                </Form.Item>
                <Form.Item
                    name="alloted_amount"
                    label="Amount"
                    rules={[{ required: true, message: 'Please enter amount' }]}
                    { ...helpers.displayError(errorMessage, 'alloted_amount') }
                >
                    <Input placeholder='Amount' type="number" min={0.01} step={0.01} />
                </Form.Item>
                <Form.Item
                    name="uacs_code_id"
                    label="UACS Code"
                    rules={[{ required: true, message: 'Please enter UACS Code' }]}
                    { ...helpers.displayError(errorMessage, 'uacs_code_id') }
                >
                    <Select
                        placeholder='Select Category'
                        showSearch
                        filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        { uacsCodes.map(i => <Option value={i.id} key={i.key}>{`${i.name} - ${i.title}`}</Option> ) }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="sa_or"
                    label="SA/OR"
                    rules={[{ required: true, message: 'Please enter SA/OR' }]}
                    { ...helpers.displayError(errorMessage, 'sa_or') }
                >
                    <Input placeholder='SA/OR' />
                </Form.Item>

            </Form>
        </Modal>
    );
}

export default connect(
    mapStateToProps,
  )(ModalBudgetForm);