import React, { useState, useEffect, useCallback } from 'react';
import { useHistory  } from 'react-router-dom'
import style from './style.less'
import { debounce, isEmpty, cloneDeep, map } from 'lodash'
import api from './../../api';
import { connect } from 'react-redux';
import { Button, Input, Select, Popconfirm, Typography, Form, notification, Modal, Row, Col, Tooltip, message, Tag, Switch, InputNumber   } from 'antd';
import Icon, { PlusOutlined, DeleteOutlined, DoubleLeftOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import moment from 'moment';
import helpers from '../../Utilities/helpers';
import { RouterPrompt } from '../../Components/RouterPrompt';

const { TextArea } = Input;
const { Option, OptGroup } = Select;
const { Title } = Typography;

function mapStateToProps(state) {
    return {
        unit_of_measures: state.libraries.unit_of_measures,
        items: state.libraries.items,
        item_categories: state.libraries.item_categories,
        item_types: state.libraries.item_types,
        user_section_signatories: state.libraries.user_section_signatories,
        procurement_plan_types: state.libraries.procurement_plan_types,
        user_sections: state.libraries.user_sections,
        user_divisions: state.libraries.user_divisions,
        user_positions: state.libraries.user_positions,
        user_signatory_designations: state.libraries.user_signatory_designations,
        user_signatory_names: state.libraries.user_signatory_names,
        formData: state.requisitionIssues.create.formData,
        formType: state.requisitionIssues.create.formType,
        formErrors: state.requisitionIssues.create.formErrors,
        user: state.user.data,
        isInitialized: state.user.isInitialized,
    };
}

const CreateRequisitionIssue = (props) => {
    let history = useHistory();
    const formRef = React.useRef();
    useEffect(async () => {
        if(props.isInitialized){
            if(props.formData.end_user_id){
                if(props.formData.from_ppmp == 1){
                    getPpmpItems(true);
                }
                setTableKey(props.formData.items.length);
                setTimeout(() => {
                    formRef.current.setFieldsValue(props.formData);
                }, 150);
            }else{
                if(!isEmpty(props.user)){
                    initiailzeForm();
                }
            }
            if(isEmpty(props.items)){
                getItems();
            }
        }
    }, [props.isInitialized]);
    useEffect(() => {
        document.title = "Create Requisition and Issue Slip";
        return function cleanup() {
            if(props.formType != "create"){
                clearForm();
            }
        };
    }, []);

    const [tableKey, setTableKey] = useState(0);
    const [submit, setSubmit] = useState(false);
    const [items, setItems] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [issueItemModal, setIssueItemModal] = useState(false);
    const [selectedRequestItem, setSelectedRequestItem] = useState({});
    const [selectedInventoryItems, setSelectedInventoryItems] = useState([]);
    const [searchString, setSearchString] = useState("");
    const [inventoryOpen, setInventoryOpen] = useState(true);
    const [issuedQuantity, setIssuedQuantity] = useState(0);

    const initiailzeForm = () => {
        let position = props.user_positions.filter(position => position.key == props.user.user_information?.position_id);
        let formData = {
            items: [],
            issued_items: [],
            end_user_id: props.user.user_offices?.data[0]?.office_id,
            received_by_name: props.user.user_information?.fullname?.toUpperCase(),
            received_by_designation: position[0].name,
            purpose: "For the implementation of ",
        }
        props.dispatch({
            type: "RESET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: formData
        });

        if(formRef.current){
            formRef.current?.setFieldsValue(formData);
        }
    }
    


    const getItems = async () => {
        return api.Library.getLibraries('items')
        .then(res => {
            let items = res.data.data;
            items = items.filter(i => i.is_active);
            props.dispatch({
                type: "SET_LIBRARY_ITEMS",
                data: items
            });
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    const getPpmpItems = async (updateItem = false) => {
        return api.ProcurementPlan.management()
        .then(res => {
            let responseItems = res.data.items.data;
            if(props.formType == "update" && !isEmpty(props.formData.items) && updateItem){
                updateRisItems(responseItems);
            }
            setItems(responseItems);
        })
        .catch(res => {})
        .then(res => {})
    }

    const updateRisItems = (responseItems) => {
        let items = cloneDeep(props.formData.items);
        items = items.map(item => {
            let procurement_plan_item = responseItems.filter(responseItem => responseItem.procurement_plan_item_id == item.procurement_plan_item_id);
            if(!isEmpty(procurement_plan_item)){
                item.max_quantity = procurement_plan_item[0].total_quantity;
            }
            return item;
        });
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items
            }
        });
    }

    const loadInventory = debounce(async (search) => {
        let searchS = search ? search : searchString;
        return api.ItemSupply.all({
            search: searchS
        })
        .then(res => {
            setInventoryItems(res.data.data);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }, 700);

    const debouceRequest = useCallback(value => loadInventory(value), []);

    const handleEnterSearch = (event) => {
        if(event.key === 'Enter'){
          loadInventory();
        }
    }

    const handleSearch = (e) => {
        setSearchString(e.target.value);
        debouceRequest(e.target.value);
    }
    

    const approveForm = async (id, formData) => {
        return api.Forms.approve(id, formData)
        .then(res => {
            let alertMessage = res.data.alert_message;
            notification.success({
                message: `${alertMessage.message} ${alertMessage.status}`,
                description: alertMessage.action_taken,
            });
            return Promise.resolve(res)
        })
        .catch(err => {
            setSubmit(false);
            return Promise.reject(err)
        })
        .then(res => {})
        ;
    }
    

    const saveRequisitionIssue = () => {
        setSubmit(true);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
            data: {}
        });
        let formData = cloneDeep(props.formData);
        api.RequisitionIssue.save(formData,props.formType)
        .then(res => {
            setSubmit(false);
            notification.success({
                message: 'Requisition and Issue Slip is successfully saved.',
                description: props.formType == "create" ?
                    'Please wait for approval from your unit/section head.' :
                    '',
                }
            );

            clearForm();
        })
        .catch(err => {
            setSubmit(false);
            if(err.response.status == "422"){
                props.dispatch({
                    type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
                    data: err.response.data.errors
                });
    
                if(err.response.data.errors.items){
                    Modal.error({
                        title: 'Requisition and Issue creation failed',
                        content: (
                          <div>
                            <p>Please add items on the Requisition and Issue.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }else if(err.response.data.errors.update_error){
                    Modal.error({
                        title: 'Requisition and Issue Slip update failed',
                        content: (
                          <div>
                            <p>Unable to update, items have been issued.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }else{
                    Modal.error({
                        title: 'Requisition and Issue Slip creation failed',
                        content: (
                          <div>
                            <p>Please review the form before saving.</p>
                          </div>
                        ),
                        onOk() {},
                      });
                }
            }
        })
        .then(res => {})
        ;
    }

    const handleSave = debounce(async () => {
        if(props.formType == "issue"){
            try {
                let formData = cloneDeep(props.formData);
                props.dispatch({
                    type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
                    data: []
                });
                await approveForm(props.formData.form_route_id, formData);
                history.push("/forms/forwarded");
                clearForm();
                setSubmit(false);
            } catch (err) {
                setSubmit(false);
                console.log(err);
                if(err.response.status == "422"){
                    props.dispatch({
                        type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
                        data: err.response.data.errors
                    });
        
                    if(err.response.data.errors.items){
                        Modal.error({
                            title: 'Requisition and Issue creation failed',
                            content: (
                              <div>
                                <p>Please add items on the Requisition and Issue.</p>
                              </div>
                            ),
                            onOk() {},
                          });
                    }else if(err.response.data.errors.update_error){
                        Modal.error({
                            title: 'Requisition and Issue Slip update failed',
                            content: (
                              <div>
                                <p>Unable to update, items have been issued</p>
                              </div>
                            ),
                            onOk() {},
                          });
                    }else{
                        Modal.error({
                            title: 'Requisition and Issue Slip creation failed',
                            content: (
                              <div>
                                <p>Please review the form before saving.</p>
                              </div>
                            ),
                            onOk() {},
                          });
                    }
                }
            }
        }else{
            saveRequisitionIssue();
        }
    }, 200);


    const clearForm = async () => {
        if(formRef.current){
            formRef.current?.resetFields();
        }
        initiailzeForm();
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_TYPE",
            data: "create"
        });
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS",
            data: {}
        });
    }

    const changeFieldValue = (e, field, target = true) => {
        let value = e;
        if(target){
            value = e.target.value;
        }
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                [field]: value
            }
        });
    }


    const changeTableFieldValue = (e, item, field, index) => {
        let value = e;
        let newValue = cloneDeep(props.formData[`items`]);
        newValue[index][field] = value;
        switch (field) {
            case 'request_quantity':
                // newValue[index].max_quantity
                let request_quantity = parseInt(value);
                if(request_quantity > newValue[index].max_quantity && props.formData.from_ppmp == 1){
                    request_quantity = newValue[index].max_quantity;
                }
                newValue[index]['request_quantity'] = request_quantity;
                break;
            case 'has_stock':
                // newValue[index]['issue_quantity'] = (newValue[index].has_stock ? newValue[index]['issue_quantity'] : 0 );
                break;
            case 'issue_quantity':
                // newValue[index].max_quantity
                let issue_quantity = parseInt(value);
                if(issue_quantity >= newValue[index]['request_quantity']){
                    issue_quantity = newValue[index]['request_quantity'] ;
                }
                newValue[index]['issue_quantity'] = issue_quantity;
                break;
        
            default:
                break;
        }
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }
        });
    }

    const changeRequestedBy = (e) => {
        let requestedSignatory = props.user_section_signatories.filter(item => item.id == e);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                requested_by_id: e,
                requested_by_name: requestedSignatory[0].name,
                requested_by_designation: requestedSignatory[0].title,
                requested_by_office: requestedSignatory[0].parent.title,
            }
        });
    }
    const changeApprovedBy = (e) => {
        let approvedSignatory = props.user_section_signatories.filter(item => item.id == e);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                approved_by_id: e,
                approved_by_name: approvedSignatory[0].name,
                approved_by_designation: approvedSignatory[0].title,
                approved_by_office: approvedSignatory[0].parent.title,
            }
        });
    }


    const changeIssueQuantity = (e, item, index) => {
        setIssueItemModal(e);
        setSelectedRequestItem(item);
        
        let clonedIssueItems = cloneDeep(props.formData.issued_items);
        let issuedItems = clonedIssueItems.filter(issuedItem => issuedItem.requisition_item_id == item.id);
        if(!isEmpty(issuedItems)){
            setSelectedInventoryItems(issuedItems);
        }
        if(e){
            loadInventory();
        }
    }

    const changeIfPpmp = (e) => {
        if(e == "1"){
            getPpmpItems();
        }else{
            
        }
        // changeFieldValue(e, 'from_ppmp', false);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                from_ppmp: e,
                items: []
            }
        });
    }


    const selectItem = (value, index) => {
        let item = items.filter(item => item.procurement_plan_item_id == value);
        item = item[0];
        let existed_item = props.formData[`items`].filter(item => item.procurement_plan_item_id == value);
        if(!isEmpty(existed_item)){
            notification.error({
                message: 'Item existed!',
                description:
                    `The item ${existed_item[0].description} is already in the list`,
                }
            );
            return false;
        }
        let newValue = cloneDeep(props.formData[`items`]);
        newValue[index]["unit_of_measure_id"] = item.procurement_plan_item.unit_of_measure.id;
        newValue[index]["unit_of_measure"] = {
            name: item.procurement_plan_item.unit_of_measure.name
        };
        newValue[index]["item_code"] = "";
        newValue[index]["item_id"] = item.procurement_plan_item.item_id;
        newValue[index]["description"] = item.procurement_plan_item.description;
        newValue[index]["request_quantity"] = 0;
        newValue[index]["max_quantity"] = item.total_quantity;
        newValue[index]["procurement_plan_item_id"] = item.procurement_plan_item_id;
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }
        });
    }
    

    const addItem = () => {
        setTableKey(tableKey + 1);
        let newValue = {
            key: tableKey + 1,
            unit_of_measure_id: null,
            unit_of_measure: null,
            total_quantity: 0,
            total_price: 0,
            item_code: null,
            item_id: null,
            description: null,
            procurement_plan_item_id: null,
            is_edit: true,
            request_quantity: 0,
        };
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: [...props.formData.items, newValue]
            }
        });
    }

    const deleteItem = (key) => {
        let newValue = props.formData[`items`].filter(item => item.key !== key);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: newValue
            }   
        });
    }

    const issueQuantity = (e, inventoryitem) => {
        let clonedInventoryItems = cloneDeep(selectedInventoryItems);
        let item = {
            id: inventoryitem.id,
            key: inventoryitem.key,
            item_supply_id: inventoryitem.id,
            item_name: inventoryitem.item_name,
            quantity: e,
            unit_of_measure: inventoryitem.unit_of_measure.name,
            requisition_item_description: selectedRequestItem.description,
            requisition_item_id: selectedRequestItem.id,
        };
        let issuedItem = props.formData.issued_items.filter(itemI => itemI.id == inventoryitem.id && itemI.requisition_item_id != selectedRequestItem.id);
        if(!isEmpty(issuedItem)){
            message.error(`${inventoryitem.item_name} is already issued to ${issuedItem[0].requisition_item_description}`);
            return false;
        }
        let index = clonedInventoryItems.findIndex(item => item.id === inventoryitem.id);
        if(index < 0){
            if(e > 0){
                setSelectedInventoryItems([...clonedInventoryItems, item]);
            }
        }else{
            if(e > 0){
                clonedInventoryItems[index] = item;
            }else{
                clonedInventoryItems.splice(index, 1);
            }
            setSelectedInventoryItems(clonedInventoryItems);
        }
    }

    const totalIssuedQuantity = () => {
        if (isEmpty(selectedInventoryItems)) {
            return 0;
        }else{
            return selectedInventoryItems.reduce((sum, item) => {
                return sum += item.quantity;
            }, 0);
        }
    }

    const deleteInventoryItem = (e, selectedItem) => {
        e.preventDefault();
        let cloned = cloneDeep(selectedInventoryItems);
        setSelectedInventoryItems(cloned.filter(item => item.id != selectedItem.id));
    }

    const addInventoryItems = () => {
        if(selectedRequestItem.request_quantity < totalIssuedQuantity()){
            message.error('Issue quantity must not be greater than requested quantity.');
            return false;
        }
        let clonedIssueItems = cloneDeep(props.formData.issued_items);
        let clonedItems = cloneDeep(props.formData.items);
        let requisitionItemIndex = clonedItems.findIndex(requisition_item => requisition_item.id === selectedRequestItem.id);
        clonedItems[requisitionItemIndex].issue_quantity = inventoryOpen ? totalIssuedQuantity() : issuedQuantity;
        clonedItems[requisitionItemIndex].is_pr_recommended = totalIssuedQuantity() != selectedRequestItem.request_quantity;
        clonedItems[requisitionItemIndex].has_issued_item = inventoryOpen ? 1 : 0;

        let filteredIssueItems = clonedIssueItems.filter(item => item.requisition_item_id != selectedRequestItem.id);
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
            data: {
                ...props.formData,
                items: clonedItems,
                issued_items: [...filteredIssueItems, ...selectedInventoryItems]
            }
        });

        closeIssueItemModal();
    }

    const closeIssueItemModal = () => {
        setIssueItemModal(false);
        setSelectedRequestItem({})
        setSelectedInventoryItems([]);
        setInventoryItems([]);
        setIssuedQuantity(0);
        setInventoryOpen(true);
    }

    const handleInventorySwitch = (e) => {
        setInventoryOpen(e);
        setSelectedInventoryItems([]);
    }

    return (
        <div id="pp-container" className='container-fuild bg-white p-16'>

            <RouterPrompt
                when={props.formType == "update"}
                title="Leave this form?"
                content="There are unsaved changes, do you wish to discard them?"
                type="confirm"
                cancelText="Cancel"
                okText="Confirm"
                onOK={() => true}
                onCancel={() => false}
                hasConfirm={false}
            />
            <p className="text-right ...">Appendix 63</p>
           <Title className='text-center' level={3}>REQUISITION AND ISSUE SLIP</Title>
           <Form layout='vertical' ref={formRef}>
                
                <Row gutter={[8, 8]}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Form.Item label="Office/Section">
                            { props.formType == "issue" ? (
                                <b>{ props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name }</b>
                            ) : (
                                <Input placeholder="input placeholder" value={props.user_sections?.filter(i => i.id == props.formData.end_user_id)[0]?.name} />
                            )}
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Form.Item label="Title"  {...helpers.displayError(props.formErrors, `title`)} name="title">
                            { props.formType == "issue" ? (
                                <b>{ props.formData.title }</b>
                            ) : (
                                <Input placeholder="Title" onBlur={(e) => changeFieldValue(e, 'title')} />
                            )}
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Form.Item label="Items From PPMP?"  {...helpers.displayError(props.formErrors, `from_ppmp`)}>
                            { props.formType == "issue" ? (
                                <b>{ props.formData.from_ppmp == "1" ? "Yes" : "No" }</b>
                            ) : (
                                <Select style={{ width: "100%" }} onChange={changeIfPpmp} value={props.formData.from_ppmp} placeholder="Select Item Type">
                                    <Option value={1}>Yes</Option>
                                    <Option value={0}>No</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    
                </Row>

                { props.formType == "issue" ? (
                    <React.Fragment>
                    <Row gutter={[8, 8]} className="pp-items-header">
                        <Col xs={24} sm={24} md={5} lg={11} xl={11}>
                            <div className='text-center'>
                                <b>Item</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Unit Of Measure</b>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Requested Quantity</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Stock Available?</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Issue Quantity</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Recommend for Purchase Request?</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Remarks</b>
                            </div>
                        </Col>
                    </Row>

                    </React.Fragment>
                ) : (
                    <Row gutter={[8, 8]} className="pp-items-header">
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Code</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <div className='text-center'>
                                <b>Item</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Unit Of Measure</b>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Quantity</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-center'>
                                <b>Max Quantity</b>
                            </div>
                        </Col>
                        {/* <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-right'>
                                <b>Estimated Budget</b>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div className='text-right'>
                                <b>Total Amount</b>
                            </div>
                        </Col> */}
                        <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                            <div  className='text-right'>
                                <Tooltip placement="left" title={"Add Item"}>
                                    <Button type="primary" onClick={() => addItem() }  disabled={props.formData.from_ppmp == null}><PlusOutlined /></Button>
                                </Tooltip>
                            </div>
                        </Col>
                    </Row>
                )}

                { isEmpty(props.formData.items) && (
                    <Row gutter={[8, 8]} className="pp-items-row">
                        <Col span={24}>
                            <div className='text-center mb-3'>
                                { props.formData.from_ppmp == null ? "Please select if items is from PPMP above. " : (
                                    <React.Fragment>
                                        <span> Please add items before saving the form. </span>
                                        Click <Button type="primary" onClick={() => { addItem() } } disabled={props.formData.from_ppmp == null}><PlusOutlined /></Button> button to add item.
                                    </React.Fragment>
                                )  }
                            </div>
                        </Col>
                    </Row>
                ) }
                {
                    props.formData.items.map((item, index) => (
                        <React.Fragment key={item.key}>
                            {/* <b>{ item.item_type_name }</b> */}
                            { props.formType == "issue" ? (
                                <React.Fragment>
                                <Row gutter={[8, 8]} className="pp-items-row">
                                    <Col xs={24} sm={24} md={5} lg={11} xl={11}>
                                        <div className='text-center'>
                                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.item_id`) }>
                                                { item.description }
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item>
                                                { item.unit_of_measure.name }
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                                        <div className='text-center'>
                                            { item.request_quantity }
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.has_stock`) }>
                                                <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(e) => changeTableFieldValue(e, item, 'has_stock', index)} checked={item.has_stock == 1} />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.issue_quantity`) }>
                                            { item.has_stock ? (
                                                <Input type="number" autoComplete='off' min={0} onClick={() => changeIssueQuantity(true, item, index)} onKeyUp={() => changeIssueQuantity(true, item, index)} value={item.issue_quantity} style={{ width: "100%" }} placeholder="Quantity" />
                                            ) : item.issue_quantity }
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={3} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.is_pr_recommended`) }>
                                                <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(e) => changeTableFieldValue(e, item, 'is_pr_recommended', index)} checked={item.is_pr_recommended == 1} />
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.remarks`) }>
                                            <Input  autoComplete='off' onBlur={(e) => changeTableFieldValue(e.target.value, item, 'remarks', index, ) } defaultValue={item.remarks} style={{ width: "100%" }} placeholder="Remarks" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <div className='text-left space-y-2 mb-2'>
                                            Issued Items: { props.formData.issued_items.filter(itemF => item.id == itemF.requisition_item_id).map((item, index) => {
                                                return props.formErrors[`issued_items.${index}.quantity`] ? (
                                                    <Tooltip placement="top" title={props.formErrors[`issued_items.${index}.quantity`]}  key={index}>
                                                        <Tag color="error">{item.item_name} <b>({ item.quantity } { item.unit_of_measure })</b></Tag>
                                                    </Tooltip>
                                                    ) : (
                                                        <Tag key={index}>{item.item_name} <b>({ item.quantity } { item.unit_of_measure })</b></Tag>
                                                    )
                                            }) }
                                        </div>
                                    </Col>
                                </Row>
                                </React.Fragment>
                            ) : (
                                <Row gutter={[8, 8]} className="pp-items-row">
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item>
                                                { item.item_code}
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>

                                        <div className='text-center'>
                                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.description`) }>
                                                { props.formData.from_ppmp == 1 ? (

                                                    <Select
                                                        showSearch
                                                        placeholder="Item name"
                                                        optionFilterProp="children"
                                                        onSelect={(value) => { selectItem(value, index, )}}
                                                        filterOption={(input, option) =>
                                                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        value={item.procurement_plan_item_id}
                                                        >
                                                        { items.map(item =>  (
                                                            <Option value={item.procurement_plan_item_id} key={item.key}>{item.procurement_plan_item.description}</Option>
                                                        )) }
                                                    </Select>
                                                ) : (
                                                    <TextArea placeholder='Description' autoSize={{ minRows: 1, maxRows: 6 }} onBlur={(e) => changeTableFieldValue(e.target.value, item, 'description', index) } defaultValue={item.description} />
                                                ) }
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item { ...helpers.displayError(props.formErrors, `items.${index}.unit_of_measure_id`) }>
                                                { props.formData.from_ppmp == 1 ? (
                                                    <span>{ item.procurement_plan_item_id && item.unit_of_measure.name }</span>
                                                ) : (
                                                    <Select
                                                        style={{ width: "100%" }}
                                                        placeholder={`Select Unit of Measure`}
                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        showSearch
                                                        onSelect={(e) => changeTableFieldValue(e, item, 'unit_of_measure_id', index)}
                                                        value={item.unit_of_measure_id}
                                                    >
                                                        { props.unit_of_measures.map(i => <Option value={i.id} key={i.key}>{ i.name }</Option>  ) }
                                                    </Select>
                                                ) }
                                                
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.request_quantity`) }>
                                            <InputNumber style={{ width: "100%" }} min={0} placeholder="Quantity" onBlur={(e) => changeTableFieldValue(e.target.value, item, 'request_quantity', index, ) } value={item.request_quantity}/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-center'>
                                            <Form.Item  { ...helpers.displayError(props.formErrors, `items.${index}.max_quantity`) }>
                                                { item.max_quantity }
                                            </Form.Item>
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                                        <div className='text-right space-x-1'>
                                            <Tooltip placement="bottom" title={"Delete Item"}>
                                                <Button type="danger" onClick={() => deleteItem(item.key, )}><DeleteOutlined /></Button>
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                            ) }

                       
                            
                        </React.Fragment>
                ))
            }
                { (!isEmpty(props.formData.items) && props.formType != "issue") && (
                <Row gutter={[8, 8]} className="pp-items-row">
                    <Col span={24}>
                        <div className='text-center mb-3'>
                            <Button type="primary" onClick={() => { addItem() } } disabled={props.formData.from_ppmp == null}><PlusOutlined /> Add item</Button>
                        </div>
                    </Col>
                </Row>
                )}
                <br />
            <Row gutter={[8, 8]} className="pp-items-footer">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item label="Purpose" { ...helpers.displayError(props.formErrors, `purpose`) } name="purpose">
                        { props.formType == "issue" ? (
                            <b>{ props.formData.purpose }</b>
                        ) : (
                            <Input onBlur={(e) => changeFieldValue(e, 'purpose')} placeholder="Purpose" />
                        ) }
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <Form.Item label="Requested by" { ...helpers.displayError(props.formErrors, `requested_by_name`) }>
                        { props.formType == "issue" ? (
                            <p>
                                <b>{ props.formData.requested_by_name }</b><br />
                                <span>{ props.formData.requested_by_designation }</span><br />
                                <span>{ props.formData.requested_by_date }</span><br />
                            </p>
                        )  : (
                            <Select style={{ width: "100%" }} onSelect={changeRequestedBy} value={props.formData.requested_by_id} placeholder="Select Signatory" optionLabelProp="label">
                                { props.user_section_signatories.filter(item => item.parent.title == props.user.user_offices?.data[0]?.office.parent.title || item.parent.title == props.user.user_offices?.data[0]?.office.title).map(i => (
                                    <Option value={i.id} key={i.key} label={ i.name }>
                                        <div className="demo-option-label-item">
                                            { i.parent.name }
                                        </div>
                                    </Option>
                                )) }
                            </Select>
                        )}
                    </Form.Item>
                    { props.formType != "issue" && (
                        <Form.Item label="Designation" { ...helpers.displayError(props.formErrors, `requested_by_designation`) }>
                            <Input value={props.formData.requested_by_designation} placeholder="Designation" />
                        </Form.Item>
                    )}
                </Col>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <Form.Item label="Approved by" { ...helpers.displayError(props.formErrors, `approved_by_name`) }>
                        { props.formType == "issue" ? (
                            <p>
                                <b>{ props.formData.approved_by_name }</b><br />
                                <span>{ props.formData.approved_by_designation }</span><br />
                                <span>{ props.formData.approved_by_date }</span><br />
                            </p>
                        )  : (
                            <Select style={{ width: "100%" }} onSelect={changeApprovedBy} value={props.formData.approved_by_id} placeholder="Select Signatory" optionLabelProp="label">
                                { props.user_section_signatories.filter(item => item.parent.title == "PSAMS").map(i => (
                                    <Option value={i.id} key={i.key} label={ i.name }>
                                        <div className="demo-option-label-item">
                                            { i.parent.name }
                                        </div>
                                    </Option>
                                )) }
                            </Select>
                        )}
                    </Form.Item>
                    { props.formType != "issue" && (
                        <Form.Item label="Designation" { ...helpers.displayError(props.formErrors, `approved_by_designation`) }>
                            <Input value={props.formData.approved_by_designation} placeholder="Designation" />
                        </Form.Item>
                    )}
                </Col>
            </Row>

           </Form>

            <Modal
                title="Issue Items"
                visible={issueItemModal}
                onCancel={closeIssueItemModal}
                onOk={addInventoryItems}
                width="60vw"
                footer={[
                    <Button key="back" onClick={closeIssueItemModal}>
                      Cancel
                    </Button>,
                    inventoryOpen ? (
                    <Popconfirm
                        key="submit"
                        title={(
                            <div>
                                <b>Please confirm issued items.</b> <br />
                                { selectedInventoryItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <span>{item.item_name} <b>({ item.quantity } { item.unit_of_measure })</b></span>
                                        <br />
                                    </React.Fragment>
                                )) }
                            </div>
                        )}
                        onConfirm={addInventoryItems}
                        okText="Confirm"
                        cancelText="No"
                    >
                        <Button type="primary">
                            Confirm
                        </Button>
                    </Popconfirm>
                    ) : (
                    <Button type="primary" key="submit" onClick={addInventoryItems}>
                        Confirm
                    </Button>
                    ),
                  ]}
                >
                <div>
                    Requested Item: <b>{ selectedRequestItem.description }</b><br />
                    Requested Quantity: <b>{ selectedRequestItem.request_quantity } { selectedRequestItem.unit_of_measure?.name }</b><br />
                    Issued Quantity: <b>{ inventoryOpen ? totalIssuedQuantity() : (<InputNumber min={0} max={selectedRequestItem.request_quantity} placeholder="Quantity" value={issuedQuantity} onChange={setIssuedQuantity} />) }</b><br />
                </div>
                Issue items from inventory? <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={handleInventorySwitch} checked={inventoryOpen} />
                {inventoryOpen && (
                <React.Fragment>
                    

                <div className='my-2'>
                    <Input placeholder="Search Item" onChange={handleSearch} onKeyDown={handleEnterSearch} value={searchString} />
                </div>
                <div className='my-2'>
                { selectedInventoryItems.map((item, index) => <Tag closable onClose={(e) => deleteInventoryItem(e, item)} key={index}>{item.item_name} <b>({ item.quantity } { item.unit_of_measure })</b></Tag>) }
                </div>
                <div style={{height: "45vh", overflowY: "auto", overflowX: "hidden"}}>
                
                <Row gutter={[8, 8]} className="p-2">
                    <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                        <div className='text-left'>
                            <b>Item Name</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <div className='text-left'>
                            <b>Category</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                        <div className='text-center'>
                            <b>Unit Of Measure</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                        <div className='text-center'>
                            <b>Remaining Qty</b>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                        <div className='text-center'>
                            <b>Issue Qty</b>
                        </div>
                    </Col>
                </Row>
                    

                { inventoryItems.map(item => (
                    <Row gutter={[8, 8]} key={item.key} className="inventory-items p-2">
                        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                            <div className='text-left'>
                                <span>{ item.item_name }</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <div className='text-left'>
                                <span>{ item.item_category.name }</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                            <div className='text-center'>
                                <span>{ item.unit_of_measure.name }</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                            <div className='text-center'>
                                <span>{ item.remaining_quantity.quantity }</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                            <div className='text-center'>
                                <InputNumber size='small' min={1} max={item.remaining_quantity.quantity} onChange={(e) => issueQuantity(e, item)}  placeholder="Quantity" />
                            </div>
                        </Col>
                    </Row>
                )) }
                {/* <table style={{
                    width: "100%"
                }}>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th style={{textAlign: "center"}}>Unit Of Measure</th>
                            <th style={{textAlign: "center"}}>Remaining Qty</th>
                            <th>Issue Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        { inventoryItems.map(item => (
                            <tr key={item.key}>
                                <td>{ item.item_name }</td>
                                <td>{ item.item_category.name }</td>
                                <td style={{textAlign: "center"}}>{ item.unit_of_measure.name }</td>
                                <td style={{textAlign: "center"}}>{ item.remaining_quantity.quantity }</td>
                                <td>
                                    <Input placeholder="Issue Quantity" />
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </table> */}
                </div>
                </React.Fragment>
                )}
            </Modal>

           <div className='text-center space-x-2'>
                
                <br />
                <Button type="primary" onClick={() => handleSave()} disabled={submit} loading={submit}><SaveOutlined />
                    { props.formType == "create" ? "Create Requisition and Issue Slip" : "Update Requisition and Issue Slip"}
                </Button>
                <Button type="danger" onClick={() => clearForm()}><DeleteOutlined />
                    { props.formType == "create" ? "Reset Form" : "Clear Form and Create New"}
                </Button>

            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(CreateRequisitionIssue);