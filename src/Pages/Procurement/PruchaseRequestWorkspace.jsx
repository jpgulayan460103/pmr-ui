import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
    Table,
    Space,
    Pagination,
    Popover,
    Select,
    Button,
    List,
    Menu,
    notification,
    Tabs,
    Form,
    Input,
} from 'antd';
import filter from '../../Shared/filter';
import api from '../../api';
import { cloneDeep, debounce, isEmpty, map } from 'lodash';
import {
    SettingOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MoreOutlined,
    EllipsisOutlined,
    UserOutlined,
    EditOutlined,
    FormOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;


function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        procurement_types: state.library.procurement_types,
        mode_of_procurements: state.library.mode_of_procurements,
        purchaseRequestTab: state.procurement.purchaseRequestTab,
        purchaseRequests: state.procurement.purchaseRequests,
    };
}

const Pruchaserequestworkspace = (props) => {
    const formRef = React.useRef();
    useEffect(() => {
        setFormData()
    }, [props.purchaseRequestTab && props.selectedPurchaseRequest]);

    const setFormData = () => {
        if(props.purchaseRequestTab == "edit-form"){
            setTimeout(() => {
                formRef.current.setFieldsValue({
                    purchase_request_number: props.selectedPurchaseRequest.purchase_request_number,
                    purchase_request_type_id: props.selectedPurchaseRequest.purchase_request_type_id,
                    mode_of_procurement_id: props.selectedPurchaseRequest.mode_of_procurement_id,
                })
            }, 150);
        }
    }
    const [prAddOn, setPrAddOn] = useState(dayjs().format("YY-MM-"));
    const [submit, setSubmit] = useState(false);
    const [errorMessage, setErrorMessage] = useState([]);
    const showErrorMessage = () => {
        if(!isEmpty(errorMessage)){
            return {
                validateStatus: 'error',
                help: errorMessage
            }
        }
    }
    
    const onFinish = (values) => {
        let formData = {
            ...values,
            id: props.selectedPurchaseRequest.id
        };
        api.PurchaseRequest.save(formData, 'update')
        .then(res => {
            let resData = res.data;
            let clonedPrs = cloneDeep(props.purchaseRequests);
            let index = clonedPrs.findIndex(i => i.id == props.selectedPurchaseRequest.id);
            clonedPrs[index] = {
                ...clonedPrs[index],
                ...resData
            }
            props.dispatch({
                type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS",
                data: clonedPrs
            });
            notification['success']({
                message: `Successfully Saved.`,
                description: `Purchase Request # ${formData.purchase_request_number} has been updated.`,
            });
        })
        .catch(err => {
            
        })
        .then(res => {})
        ;
    };

    const changeTab = (key) => {
        props.dispatch({
            type: "SET_PROCUREMENT_SET_PURCHASE_REQUEST_TAB",
            data: key
        });
    }
    return (
        <div>

        <Tabs activeKey={props.purchaseRequestTab} type="card" size="small" onChange={(key) => changeTab(key)}>
            <TabPane tab="Generated File" key="pdf" style={{height: "60vh"}}>
                {props.selectedPurchaseRequest && props.selectedPurchaseRequest.file ? <iframe src={`${props.selectedPurchaseRequest?.file}?view=1`} width="100%" height="100%"></iframe> : ""}
            </TabPane>
            <TabPane tab="Edit Form" key="edit-form">
                <Form
                    ref={formRef}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true, username: "ict", password: "admin123" }}
                    onFinish={onFinish}
                    layout='vertical'
                >
                    <Form.Item
                        name="purchase_request_number"
                        label="Purchase Request Number"
                        rules={[{ required: true, message: 'Please input Purchase Request Number.' }]}
                        { ...showErrorMessage() }
                    >
                        <Input placeholder="Purchase Request Number" />
                    </Form.Item>

                    <Form.Item
                        name="purchase_request_type_id"
                        label="Procurement Type"
                        rules={[{ required: true, message: 'Please select Procurement Type.' }]}
                        { ...showErrorMessage() }
                    >
                        <Select placeholder='Select Procurement Type'>
                            { props.procurement_types.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="mode_of_procurement_id"
                        label="Procurement Type"
                        rules={[{ required: true, message: 'Please select Procurement Type.' }]}
                        { ...showErrorMessage() }
                    >
                        <Select placeholder='Select Mode of Procurement'>
                            { props.mode_of_procurements.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" disabled={submit} loading={submit}>
                            Save
                        </Button>                    
                    </Form.Item>
                </Form>
            </TabPane>
            <TabPane tab="BAC Task" key="bac-task">
                BAC FORMS
            </TabPane>
            <TabPane tab="Audit Trail" key="audit-trail">
            Audit Trail
            </TabPane>
        </Tabs>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Pruchaserequestworkspace);

