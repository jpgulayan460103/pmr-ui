import React, { useState, useEffect } from 'react';
import { cloneDeep, isEmpty } from 'lodash';
import { connect } from 'react-redux';
import api from '../../api';
import { Table, Card, Col, Row, Form, Input, Select, Button, notification, Checkbox, Space, Popconfirm  } from 'antd';
import { UserOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import helpers from '../../Utilities/helpers';

const { Option } = Select;


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        items: state.libraries.items,
        unit_of_measures: state.libraries.unit_of_measures,
        item_category_cses: state.libraries.item_category_cses,
    };
}

const ItemLibrary = (props) => {
    const [selectedLibrary, setSelectedLibrary] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [formType, setFormType] = useState("Create");
    const formRef = React.useRef();

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    const [itemCategoryFilter, setItemCategoryFilter] = useState([]);
    const [unitOfMeasureFilter, setUnitOfMeasureFilter] = useState([]);
    var searchInput;


    useEffect(() => {
        if(props.isInitialized){
            if(isEmpty(props.items)){
                getItems();
                setItemCategoryFilter(cloneDeep(props.item_category_cses).map(i => {
                        return {
                            text: i.text,
                            value: i.id,
                        };
                    }));
                setUnitOfMeasureFilter(cloneDeep(props.unit_of_measures).map(i => {
                        return {
                            text: i.text,
                            value: i.id,
                        };
                    }));
            }
        }
    }, [props.isInitialized]);
    
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

    const onFinish = (values) => {
        values.id = selectedLibrary.id;
        api.Library.save('items', values, formType)
        .then(res => {
                notification.success({
                    message: 'Success',
                    description:
                      'The library has been updated',
                });
                getItems();
        })
        .catch(err => {})
        .then(res => {})
        ;
    };

    const resetForm = () => {
        formRef.current.resetFields();
        setFormType("Create");
        setSelectedLibrary({});
    }


    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                        confirm({ closeDropdown: false });
                        setSearchText(selectedKeys[0])
                        setSearchedColumn(dataIndex)
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
        record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
        onFilterDropdownVisibleChange: visible => {
        if (visible) {
            setTimeout(() => searchInput.select(), 100);
        }
        },
        render: text =>
        searchedColumn === dataIndex ? text : text,
    });
    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText("")
    };

    const onCell = {
        onCell: (record, colIndex) => {
            if(!helpers.hasRole(props.user, ['super-admin'])){
                return false;
            }
            return {
                onClick: event => {
                    setSelectedLibrary(record);
                    formRef.current.setFieldsValue({
                        item_name: record.item_name,
                        item_code: record.item_code,
                        price: record.price,
                        unit_of_measure_id: record.unit_of_measure.id,
                        item_category_cse_id: record.item_category_cse.id,
                    })
                    setFormType("Update");
                },
            };
          }
    }

    const dataSource = props.items;

    // const itemCategoryFilter = !isEmpty(props.item_category_cses) ? [] : [];
    // const unitOfMeasureFilter = !isEmpty(props.unit_of_measures) ? [] : [];

    const columns = [
        {
            title: 'Library',
            key: 'library_type_str',
            width: 50,
            ...onCell,
            render: (text, item, index) => (
                <span>
                    Items
                </span>
            ),
        },
        {
            title: 'Category',
            key: 'item_category',
            width: 200,
            ...onCell,
            sorter: (a, b) => a.item_category.name.localeCompare(b.item_category.name),
            render: (text, item, index) => (
                <span>
                    { item.item_category_cse.name }
                </span>
            ),
        },
        {
            title: 'item_name',
            dataIndex: 'item_name',
            key: 'item_name',
            width: 200,
            ...onCell,
            ...getColumnSearchProps("item_name"),
            sorter: (a, b) => a.item_name.localeCompare(b.item_name)
        },
        {
            title: 'UOM',
            key: 'unit_of_measure',
            width: 50,
            ...onCell,
            sorter: (a, b) => a.unit_of_measure.name.localeCompare(b.unit_of_measure.name),
            render: (text, item, index) => (
                <span>
                    { item.unit_of_measure.name }
                </span>
            ),
        },
        {
            title: 'Item Code',
            dataIndex: 'item_code',
            key: 'item_code',
            width: 100,
            ...onCell,
            ...getColumnSearchProps("item_code"),
            sorter: (a, b) => a.item_code.localeCompare(b.item_code)
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 50,
            ...onCell,
        },
        {
            title: "",
            key: 'action',
            width: 50,
            render: (text, item, index) => (
                <Popconfirm
                title="Are you sure to delete?"
                onConfirm={() => { setInactiveLibrary(item) }}
                okText="Yes"
                cancelText="No"
            >
                <span className='custom-pointer'>
                    <DeleteOutlined />
                </span>
            </Popconfirm>
            ),
        }
    ];

    const setInactiveLibrary = (item) => {
        let values = {
            id: item.id,
            is_active: 0,
        }
        api.Library.save('items', values, "update")
        .then(res => {
                notification.success({
                    message: 'Success',
                    description:
                      'The library has been updated',
                });
                getItems()
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    return (
        <React.Fragment>
        <Row gutter={[16, 16]} className="mb-3">
            <Col sm={24} md={16} lg={14} xl={14}>
                <Card size="small" title="Items" bordered={false}  >
                    <div className='user-card-content'>
                        <Table
                            dataSource={dataSource}
                            columns={ columns }
                            size={"small"}
                            pagination={{showSizeChanger:true, showQuickJumper: true}}
                        />
                    </div>
                </Card>
            </Col>
            
            { 
                helpers.hasRole(props.user,["super-admin"]) && (
            
            <Col sm={24} md={8} lg={10} xl={10}>
                <Card size="small" title={`${formType} Items`} bordered={false}>
                    <div className='user-card-content'>
                        <Form
                            ref={formRef}
                            name="normal_login"
                            className="login-form"
                            layout="vertical"
                            onFinish={onFinish}
                        >

                            <Form.Item
                                name="item_category_cse_id"
                                label="Item Category"
                                { ...helpers.displayError(formErrors, `title`)  }
                                rules={[{ required: true, message: `Item Category field is required` }]}
                            >
                                {/* <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Firstname" /> */}
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={`Select Item Category`}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    showSearch
                                >
                                    { props.item_category_cses.map(i => <Option value={i.id} key={i.key}>{ i.name }</Option>  ) }
                                </Select>
                            </Form.Item>


                            <Form.Item
                                name="item_name"
                                label="Name"
                                { ...helpers.displayError(formErrors, `item_name`)  }
                                rules={[{ required: true, message: 'Name field is required' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
                            </Form.Item>

                            <Form.Item
                                name="unit_of_measure_id"
                                label="Unit of Measure"
                                { ...helpers.displayError(formErrors, `title`)  }
                                rules={[{ required: true, message: `Unit of Measure field is required` }]}
                            >
                                {/* <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Firstname" /> */}
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={`Select Unit of Measure`}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    showSearch
                                >
                                    { props.unit_of_measures.map(i => <Option value={i.id} key={i.key}>{ i.name }</Option>  ) }
                                </Select>
                            </Form.Item>
                            
                            <Form.Item
                                name="item_code"
                                label="Item Code"
                                { ...helpers.displayError(formErrors, `item_code`)  }
                            >
                                <Input placeholder="Name" />
                            </Form.Item>

                            <Form.Item
                                name="price"
                                label="Price"
                                { ...helpers.displayError(formErrors, `price`)  }
                            >
                                <Input placeholder="Name" type="number" step={0.01} />
                            </Form.Item>
                           

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    {`${formType}`}
                                </Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="danger" onClick={() => resetForm()  }>
                                Cancel
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Card>
            </Col>
            )}
        </Row>
        </React.Fragment>
    );
}

export default connect(
    mapStateToProps,
  )(ItemLibrary);
