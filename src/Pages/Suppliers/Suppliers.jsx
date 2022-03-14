import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Input, Card, Col, Row, Tag, Form  } from 'antd';
import { UserOutlined, MailOutlined, DeleteOutlined } from '@ant-design/icons';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import api from '../../api';
import helpers from '../../Utilities/helpers';
import EditableCell from './SupplierContactEditable'

function mapStateToProps(state) {
    return {
        user: state.user.data,
        isInitialized: state.user.isInitialized,
        suppliers: state.supplier.suppliers,
    };
}


const Suppliers = (props) => {
    const formRef = React.useRef();
    const [formErrors, setFormErrors] = useState({});
    const [selectedSupplier, setSelectedSupplier] = useState({});
    const [supplierContacts, setSupplierContacts] = useState([]);
    const [formType, setFormType] = useState("Create");
    useEffect(() => {
        if(props.isInitialized){
            if(isEmpty(props.suppliers)){
                getSuppliers();
            }
        }
    }, [props.isInitialized]);

    const getSuppliers = debounce(() => {
        api.Supplier.all()
        .then(res => {
            // setSuppliers(res.data.data);'
            let responseSupplier = res.data.data;
            responseSupplier.map(i => {
                i.selected = false;
                i.selectedContact = i.contacts.data[0]
                i.selectedContactId = i.contacts.data[0].id
                return i;
            })
            props.dispatch({
                type: "SET_SUPPLIERS",
                data: responseSupplier
            });
        })
        .catch(err => {
            // setLoading(false);
        })
        .then(res => {})
        ;
    }, 150);

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedSupplier(record);
                    setSupplierContacts(record?.contacts?.data);
                    setFormType("Update");
                    formRef.current.setFieldsValue({
                        ...record
                    })
                },
            };
          }
    }

    const supplierColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            ...onCell,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 250,
            ...onCell,
        },
        {
            title: 'Categories',
            key: 'categories',
            width: 500,
            render: (text, item, index) => (
                <span>
                    { item.categories.data.map(i => {
                        return (
                            <Tag key={i.key}>
                                {i.category?.parent?.name} - {i.category?.name}
                            </Tag>
                        );
                    }) }
                </span>
            )
        },
        {
            title: "",
            key: 'action',
            width: 50,
            render: (text, item, index) => (
                <span className='custom-pointer' onClick={() => {  }}>
                    <DeleteOutlined />
                </span>
            ),
        }
    ]

    const updateContact = (e, item, index, prop) => {
        let clonedContact = cloneDeep(supplierContacts);
        clonedContact[index] = {
            ...clonedContact[index],
            [prop]: e.target.value
        }
        setSupplierContacts(clonedContact);
    }

    const supplierContactColumns = [
        {
            title: 'Contact Person',
            key: 'name',
            dataIndex: 'name',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <Form.Item
                        { ...helpers.displayError(formErrors, `contacts.${index}.name`)  }
                    >
                        <Input placeholder="Contact Person"  defaultValue={item.name} onBlur={(e) => { updateContact(e, item, index, 'name') }} />
                    </Form.Item>
                </span>
            )
        },
        {
            title: 'Contact Number',
            key: 'contact_number',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <Form.Item
                        { ...helpers.displayError(formErrors, `contacts.${index}.contact_number`)  }
                    >
                        <Input placeholder="Contact Number"  defaultValue={item.contact_number} onBlur={(e) => { updateContact(e, item, index, 'contact_number') }} />
                    </Form.Item>
                </span>
            )
        },
        {
            title: 'Email Address',
            key: 'email_address',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <Form.Item
                        { ...helpers.displayError(formErrors, `contacts.${index}.email_address`)  }
                    >
                        <Input placeholder="Email Address"  defaultValue={item.email_address} onBlur={(e) => { updateContact(e, item, index, 'email_address') }} />
                    </Form.Item>
                </span>
            )
        },
        {
            title: "",
            key: 'action',
            width: 50,
            render: (text, item, index) => (
                <span onClick={() => {  }}>
                    <Form.Item
                        { ...helpers.displayError(formErrors, `contacts.${index}.email_address`)  }
                    >
                        <span className='custom-pointer'>
                            <DeleteOutlined />
                        </span>
                    </Form.Item>
                    
                </span>
            ),
        }
    ]

    const onFinish = (values) => {
        values.contacts = supplierContacts
        values.id = selectedSupplier.id
        api.Supplier.save(values, formType)
    }

    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="Suppliers" bordered={false}  >
                        <div className='user-card-content'>
                            <Table size='small' dataSource={props.suppliers} columns={supplierColumns} />
                        </div>
                    </Card>
                </Col>
                <Col sm={24} md={8} lg={10} xl={10}>
                    <Card size="small" title={`${formType} Supplier`} bordered={false}  >
                        <div className='user-card-content'>

                            <Form
                                ref={formRef}
                                name="normal_login"
                                className="login-form"
                                initialValues={{
                                    remember: true,
                                }}
                                layout="vertical"
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="name"
                                    label="Supplier Name"
                                    { ...helpers.displayError(formErrors, `name`)  }
                                    rules={[{ required: true, message: 'Please input supplier name' }]}
                                >
                                    <Input placeholder="name" />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label="Supplier Address"
                                    { ...helpers.displayError(formErrors, `address`)  }
                                    rules={[{ required: true, message: 'Please input supplier address' }]}
                                >
                                    <Input placeholder="address" />
                                </Form.Item>

                                <Table size='small' dataSource={supplierContacts} columns={supplierContactColumns} />
                                {/* <EditableCell dataSource={selectedSupplier?.contacts?.data} /> */}

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                    Save
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="danger" onClick={() => {}  }>
                                    Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Suppliers);


