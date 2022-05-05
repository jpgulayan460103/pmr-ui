import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Input, Card, Col, Row, Tag, Form, Select, notification, Popconfirm, Tooltip  } from 'antd';
import { UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { cloneDeep, debounce, isEmpty, map } from 'lodash';
import api from '../../api';
import helpers from '../../Utilities/helpers';
import EditableCell from './SupplierContactEditable'

const { Option } = Select;

function mapStateToProps(state) {
    return {
        user: state.user.data,
        isInitialized: state.user.isInitialized,
        suppliers: state.suppliers.suppliers,
        account_classifications: state.libraries.account_classifications,
    };
}


const Suppliers = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => { unmounted.current = true }
    }, []);
    const formRef = React.useRef();
    const [formErrors, setFormErrors] = useState({});
    const [selectedSupplier, setSelectedSupplier] = useState({});
    const [supplierContacts, setSupplierContacts] = useState([]);
    const [formType, setFormType] = useState("Create");
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        if(props.isInitialized){
            getSuppliers();
        }
    }, [props.isInitialized]);

    const getSuppliers = debounce(() => {
        setLoading(true);
        api.Supplier.all()
        .then(res => {
            if (unmounted.current) { return false; }
            setLoading(false);
            setSuppliers(res.data.data);
        })
        .catch(err => {
            setLoading(false);
        })
        .then(res => {})
        ;
    }, 150);

    const deleteSupplier = async (supplier) => {
        await api.Supplier.delete(supplier.id);
        getSuppliers();
    }

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedSupplier(record);
                    setSupplierContacts(record?.contacts?.data);
                    setFormType("Update");
                    let categories = map(record.categories?.data, 'category_id');
                    formRef.current.setFieldsValue({
                        ...record,
                        categories: categories
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
            sorter: (a, b) => a.name?.localeCompare(b.name),
            ...onCell,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 250,
            sorter: (a, b) => a.address?.localeCompare(b.address),
            ...onCell,
        },
        {
            title: 'Categories',
            key: 'categories',
            width: 500,
            ...onCell,
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
                <Popconfirm title="Are you sure to delete this supplier?" okText="Yes" cancelText="No" onConfirm={() => { deleteSupplier(item) }}>
                    <span className='custom-pointer'>
                        <DeleteOutlined />
                    </span>
                </Popconfirm>
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

    const removeContact = (item) => {
        setSupplierContacts(prev => prev.filter(i => i.key != item.key));
    }
    const addContact = () => {
        setSupplierContacts(prev => [
            ...prev,
            {
                name: null,
                contact_number: null,
                email_address: null,
                key: `new-contact-${prev.length}`
            }
        ]);
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
            title: (
                <Tooltip placement="left" title={"Add Contact Person"}>
                    <Button size='small' onClick={addContact}>
                        <PlusOutlined />
                    </Button>
                </Tooltip>
            ),
            key: 'action',
            width: 50,
            render: (text, item, index) => (
                <span onClick={() => {  }}>
                    <Form.Item>
                        <Tooltip placement="left" title={"Remove Contact Person"}>
                            <span className='custom-pointer' onClick={() => { removeContact(item) }}>
                                <DeleteOutlined />
                            </span>
                        </Tooltip>
                    </Form.Item>
                    
                </span>
            ),
        }
    ]

    const onFinish = debounce((values) => {
        setSubmit(true);
        values.contacts = supplierContacts
        values.id = selectedSupplier.id
        api.Supplier.save(values, formType)
        .then(res => {
            if (unmounted.current) { return false; }
            setSubmit(false);
            getSuppliers();
            notification.success({
                message: 'Done',
                description:
                  'Your changes have been successfully saved!',
            });
            resetForm();
        })
        .catch(err => {
            setSubmit(false);
            setFormErrors(err.response.data.errors);
            notification.error({
                message: 'Error',
                description:
                  'Please review the form.',
            });
        })
        .then(res => {})
    }, 150)

    const resetForm = () => {
        setSelectedSupplier({});
        setSupplierContacts([]);
        setFormType("Create");
        formRef.current.resetFields();
    }

    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="Suppliers" bordered={false}  >
                        <div className='user-card-content'>
                            <Table size='small' dataSource={suppliers} columns={supplierColumns} loading={{spinning: loading, tip: "Loading Suppliers..."}} />
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
                                    categories: [],
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
                                    <Input placeholder="Supplier Name" />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    label="Supplier Address"
                                    { ...helpers.displayError(formErrors, `address`)  }
                                    rules={[{ required: true, message: 'Please input supplier address' }]}
                                >
                                    <Input placeholder="Supplier Address" />
                                </Form.Item>

                                <Form.Item
                                    name="categories"
                                    label="Category"
                                    { ...helpers.displayError(formErrors, 'categories') }
                                    rules={[{ required: true, message: 'Please select Category.' }]}
                                >
                                    <Select
                                        placeholder='Select Category'
                                        mode="multiple"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        { props.account_classifications.map(i => {
                                            // return <Option value={i.id} key={i.key}>{i.name}</Option>
                                            return i.children.data.map(c => <Option value={c.id} key={c.key}>{i.name} - {c.name}</Option>)
                                        }) }
                                    </Select>
                                </Form.Item>

                                <Table size='small' dataSource={supplierContacts} columns={supplierContactColumns} />
                                {/* <EditableCell dataSource={selectedSupplier?.contacts?.data} /> */}

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button" loading={submit} disabled={submit}>
                                    Save
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="danger" onClick={resetForm}>
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


