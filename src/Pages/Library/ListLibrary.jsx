import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import api from '../../api';
import { Table, Card, Col, Row, Form, Input, Select, Button, notification  } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import helpers from '../../Utilities/helpers';

const { Option } = Select;


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        item_category: state.library.item_categories,
        unit_of_measure: state.library.unit_of_measures,
        user_division: state.library.user_divisions,
        user_section: state.library.user_sections,
        user_signatory_name: state.library.user_signatory_names,
        user_signatory_designation: state.library.user_signatory_designations,
    };
}

const ListLibrary = (props) => {
    const [selectedLibrary, setSelectedLibrary] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [formType, setFormType] = useState("Create");
    const formRef = React.useRef();
    useEffect(() => {
        if(props.isInitialized){

        }
    }, [props.isInitialized]);

    const dataSource = props[props.libraryType].map(i => {
            let newI = i;
            delete newI.children
            return newI;
        }
    );

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
                    sorter: (a, b) => a.title.localeCompare(b.title)
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
        return cols;
    };

    const onFinish = (values) => {
        values.id = selectedLibrary.id;
        api.Library.save(props.libraryType, values, formType)
        .then(res => {
                notification.success({
                    message: 'Done',
                    description:
                      'Refresh the page',
                });
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
                            pagination={{showSizeChanger:false}}
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
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Firstname" />
                            </Form.Item>   

                            { props.options.title && (<Form.Item
                                name="title"
                                label="Title"
                                { ...helpers.displayError(formErrors, `title`)  }
                                rules={[{ required: true, message: 'Title field is required' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Firstname" />
                            </Form.Item>  ) } 

                            { props.options.parent && (<Form.Item
                                name="parent_id"
                                label={props.options.parentLabel}
                                { ...helpers.displayError(formErrors, `title`)  }
                                rules={[{ required: true, message: `${props.options.parentLabel} field is required` }]}
                            >
                                {/* <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Firstname" /> */}
                                <Select style={{ width: "100%" }} placeholder={`Select ${props.options.parentLabel}`}>
                                    { props[props.options.parentType].map(i => <Option value={i.id} key={i.key}>{ i.name }</Option>  ) }
                                </Select>
                            </Form.Item>  ) } 

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
