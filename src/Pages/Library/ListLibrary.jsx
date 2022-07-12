import React, { useState, useEffect } from 'react';
import { cloneDeep, isEmpty } from 'lodash';
import { connect } from 'react-redux';
import api from '../../api';
import { Table, Card, Col, Row, Form, Input, Select, Button, notification, Space, Popconfirm  } from 'antd';
import { UserOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import helpers from '../../Utilities/helpers';
import filter from '../../Utilities/filter';

const { Option } = Select;


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        item_category: state.libraries.item_categories,
        item_classification: state.libraries.item_classifications,
        unit_of_measure: state.libraries.unit_of_measures,
        user_division: state.libraries.user_divisions,
        user_section: state.libraries.user_sections,
        user_signatory_name: state.libraries.user_signatory_names,
        user_section_signatory: state.libraries.user_section_signatories,
        user_signatory_designation: state.libraries.user_signatory_designations,
        user_position: state.libraries.user_positions,
        uacs_code: state.libraries.uacs_codes,
        user: state.user.data,
    };
}

const ListLibrary = (props) => {
    const [selectedLibrary, setSelectedLibrary] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [formType, setFormType] = useState("Create");

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [office, setOffice] = useState("");
    const [officeParent, setOfficeParent] = useState("");
    const [role, setRole] = useState("");
    var searchInput;

    const formRef = React.useRef();
    useEffect(() => {
        if(props.isInitialized){
            let officeId = props.user?.user_offices?.data[0]?.office?.id;
            let parentTitle = props.user?.user_offices?.data[0]?.office?.parent?.title;
            let userRole = props.user.roles?.data[0]?.name;
            console.log(parentTitle);
            setRole(userRole);
            setOfficeParent(parentTitle);
            setOffice(officeId);
        }
    }, [props.isInitialized]);

    const getLibraries = async ($type) => {
        return api.Library.getLibraries($type)
        .then(res => {
            let libraries = res.data.data;
            libraries = libraries.filter(i => i.is_active);
            if($type == "user_division"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_DIVISIONS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_section"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_SECTION",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "unit_of_measure"){
                props.dispatch({
                    type: "SET_LIBRARY_UNIT_OF_MEASURES",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "uacs_code"){
                props.dispatch({
                    type: "SET_LIBRARY_UACS_CODE",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "item_category"){
                props.dispatch({
                    type: "SET_LIBRARY_ITEM_CATEGORIES",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_position"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_POSITIONS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_area_of_assignment"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_AREA_OF_ASSIGNMENTS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "account"){
                props.dispatch({
                    type: "SET_LIBRARY_ACCOUNTS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "account_classification"){
                props.dispatch({
                    type: "SET_LIBRARY_ACCOUNT_CLASSIFICATIONS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "mode_of_procurement"){
                props.dispatch({
                    type: "SET_LIBRARY_MODE_OF_PROCUREMENT_TYPES",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }

            if($type == "technical_working_group"){
                props.dispatch({
                    type: "SET_LIBRARY_TECHNICAL_WORKING_GROUPS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }

            if($type == "user_signatory_designation"){
                props.dispatch({
                    type: "SET_LIBRARY_SIGNATORY_DESIGNATION",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_signatory_name"){
                props.dispatch({
                    type: "SET_LIBRARY_SIGNATORY_NAME",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "uacs_code"){
                props.dispatch({
                    type: "SET_LIBRARY_UACS_CODE",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "procurement_type"){
                props.dispatch({
                    type: "SET_LIBRARY_PROCUREMENT_TYPE",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_section_signatory"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_SECTION_SIGNATORY",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    let src = props[props.libraryType] && props[props.libraryType].map(i => {
            let newI = cloneDeep(i);
            delete newI.children
            return newI;
        }
    );

    const dataSource = props.libraryType == "user_section_signatory" && role != 'super-admin' ? src.filter(i => i.parent.id == office || i.parent.title == officeParent || i.parent.title == 'ORD' || i.parent.title == 'OARDA' || i.parent.title == 'OARDO') : src;
    // const dataSource = props.libraryType == "user_section_signatory" && role != 'super-admin' ? src.filter(i => i.parent.id == office) : src;


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
            return {
                onClick: event => {
                    setSelectedLibrary(record);
                    formRef.current.setFieldsValue({
                        name: record.name,
                        title: record.title,
                        parent_id: record.parent?.id,
                    })
                    setFormType("Update");
                },
            };
          }
    }
    const defaultColumns = [
        {
            title: 'Library',
            key: 'library_type_str',
            width: 50,
            ...onCell,
            render: (text, item, index) => (
                <span>
                    { props.options.libraryName }
                </span>
            ),
        },
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ...onCell,
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
    ];
    const columns = () => {
        let cols =  [
            ...defaultColumns,
        ]
        if(props.options.title){
            cols.push(
                {
                    title: 'title',
                    dataIndex: 'title',
                    key: 'title',
                    width: 150,
                    ...onCell,
                    ...getColumnSearchProps("title"),
                    sorter: (a, b) => a?.title?.localeCompare(b?.title)
                },
            );
        }
        if(props.options.parent){
            cols.push(
                {
                    title: props.options.parentLabel,
                    key: 'parent-key',
                    width: 150,
                    ...onCell,
                    sorter: (a, b) => a.parent?.name.localeCompare(b.parent?.name),
                    render: (text, item, index) => (
                        <span>
                            { item.parent?.name }
                        </span>
                    ),
                }
            );
        }
        cols.push(
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
        );
        return cols;
    };

    const setInactiveLibrary = (item) => {
        let values = {
            id: item.id,
            is_active: 0,
        }
        api.Library.save(props.libraryType, values, "update")
        .then(res => {
                notification.success({
                    message: 'Done',
                    description:
                      'The library has been updated',
                });
                resetForm();
                getLibraries(props.libraryType);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const onFinish = (values) => {
        values.id = selectedLibrary.id;
        api.Library.save(props.libraryType, values, formType)
        .then(res => {
                notification.success({
                    message: 'Done',
                    description:
                      'The library has been updated',
                });
                getLibraries(props.libraryType)
        })
        .catch(err => {})
        .then(res => {})
        ;
    };

    const resetForm = () => {
        formRef.current.resetFields();
        setFormType("Create");
    }
    return (
        <Row gutter={[16, 16]} className="mb-3">
            <Col sm={24} md={16} lg={14} xl={14}>
                <Card size="small" title={`${props.options.libraryName}`} bordered={false}  >
                    <div className='user-card-content'>
                        <Table
                            dataSource={dataSource}
                            columns={ columns() }
                            size={"small"}
                            pagination={{showSizeChanger:true, showQuickJumper: true}}
                        />
                    </div>
                </Card>
            </Col>
            
            <Col sm={24} md={8} lg={10} xl={10}>
                <Card size="small" title={`${formType} ${props.options.libraryName}`} bordered={false}>
                    <div className='user-card-content'>
                        {/* <UserForm userInfo={formData} type="update" getUsers={getUsers} /> */}
                        <Form
                            ref={formRef}
                            name="normal_login"
                            className="login-form"
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="name"
                                label="Name"
                                { ...helpers.displayError(formErrors, `name`)  }
                                rules={[{ required: true, message: 'Name field is required' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
                            </Form.Item>   

                            { props.options.title && (<Form.Item
                                name="title"
                                label="Title"
                                { ...helpers.displayError(formErrors, `title`)  }
                                rules={[{ required: true, message: 'Title field is required' }]}
                            >
                                { ( props.libraryType == "user_signatory_name" || props.libraryType == "user_signatory_designation" ) ? (
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={`Select ${props.options.parentLabel}`}

                                    >
                                        <Option value="ORD">ORD</Option>
                                        <Option value="OARDA">OARDA</Option>
                                        <Option value="OARDO">OARDO</Option>
                                    </Select>
                                ) : <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Title" />  }
                                
                            </Form.Item>  ) } 

                            { ((props.options.parent && props.libraryType != "user_section_signatory" )|| (role == 'super-admin' && props.options.parent)) && (<Form.Item
                                name="parent_id"
                                label={props.options.parentLabel}
                                { ...helpers.displayError(formErrors, `title`)  }
                                rules={[{ required: true, message: `${props.options.parentLabel} field is required` }]}
                            >
                                {/* <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Firstname" /> */}
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={`Select ${props.options.parentLabel}`}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    showSearch
                                >
                                    { props[props.options.parentType].map(i => <Option value={i.id} key={i.key}>{ i.name }</Option>  ) }
                                </Select>
                            </Form.Item>  ) } 

                            <Form.Item>

                                { (props.libraryType == "user_signatory_name" || props.libraryType == "user_signatory_designation") && formType == 'Update' ? "" : (
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        {`${formType}`}
                                    </Button>
                                )  }
                                {/* <Button type="primary" htmlType="submit" className="login-form-button">
                                    {`${formType}`}
                                </Button> */}
                                &nbsp;&nbsp;&nbsp;
                                <Button type="danger" onClick={() => resetForm()  }>
                                Cancel
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Card>
            </Col>
        </Row>
    );
}

ListLibrary.defaultProps = {
    options: {
        libraryName: "Library",
        parent: false,
        title: false,
        parentLabel: "Parent",
        titleLabel: "Parent",

    }
}

export default connect(
    mapStateToProps,
  )(ListLibrary);
