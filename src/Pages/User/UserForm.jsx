import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select, notification } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useLocation, useHistory } from "react-router-dom";
import api from '../../api';
import customAxios from '../../api/axios.settings';
import helpers from '../../Utilities/helpers';
import { debounce } from 'lodash';

const { Option, OptGroup } = Select;

function mapStateToProps(state) {
    return {
        user: state.user.data,
        user_sections: state.libraries.user_sections,
        user_divisions: state.libraries.user_divisions,
        user_positions: state.libraries.user_positions,
        technical_working_groups: state.libraries.technical_working_groups,
        libraries: state.libraries.libraries,
    };
}


const UserForm = (props) => {
    const formRef = React.useRef();
    let history = useHistory();
    const [submit, setSubmit] = useState(false);
    useEffect(() => {
        formRef.current.setFieldsValue({
            firstname: props.userInfo.firstname,
            middlename: props.userInfo.middlename,
            lastname: props.userInfo.lastname,
            username: props.userInfo.username,
            cellphone_number: props.userInfo.cellphone_number,
            email_address: props.userInfo.email_address,
            office_id: props.userInfo.office_id,
            group_id: props.userInfo.group_id,
            position_id: props.userInfo.position_id,
        })
    }, [props.userInfo.username]);
    
    const [formErrors, setFormErrors] = useState({});

    const onFinish = debounce((values) => {
        values.username = props.userInfo.username;
        values.user_dn = props.userInfo.user_dn;
        if(props.type == "update"){
            values.id = props.userInfo.user_id;
            updateUser(values);
        }else{
            values.password = "ad_account";
            values.account_type = "ad_account";
            createUser(values);
        }
    }, 150);

    const createUser = (values) => {
        setSubmit(true);
        api.User.registerAd(values)
        .then(res => {
            setSubmit(false);
            localStorage.setItem("auth_token",JSON.stringify(res.data));
            customAxios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
            props.dispatch({
                type: "SET_INITIALIZED",
                data: false
            });
            history.push("/");
        })
        .catch(err => {
            setSubmit(false);
            setFormErrors(err.response.data.errors);
        })
        .then(res => {
            setSubmit(false);
        })
        ;
    }

    const updateUser = (values) => {
        setSubmit(true);
        api.User.save(values, 'update')
        .then(res => {
            setSubmit(false);
            props.getUsers();
            notification.success({
                message: 'Success',
                description:
                    'Your changes have been successfully saved!',
                }
            );
        })
        .catch(err => {
            setSubmit(false);
            setFormErrors(err.response.data.errors);
        })
        .then(res => {
            setSubmit(false);
        })
        ;
    }

    return (
        <div>
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
                    name="firstname"
                    label="Firstname"
                    { ...helpers.displayError(formErrors, `firstname`)  }
                    rules={[{ required: true, message: 'Please input your Firstname!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon"/>}
                        placeholder="Firstname"
                        disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.information.update']) }
                    />
                </Form.Item>
                <Form.Item
                    name="middlename"
                    label="Middle Name"
                    { ...helpers.displayError(formErrors, `middlename`) }
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="middlename"
                        disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.information.update']) }
                    />
                </Form.Item>
                <Form.Item
                    name="lastname"
                    label="Lastname"
                    { ...helpers.displayError(formErrors, `lastname`) }
                    rules={[{ required: true, message: 'Please input your Lastname!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Lastname"
                        disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.information.update']) }
                    />
                </Form.Item>
                <Form.Item
                    name="office_id"
                    label="Section/Unit/Office"
                    { ...helpers.displayError(formErrors, `office_id`) }
                    rules={[{ required: true, message: 'Please select section/unit/office' }]}
                >
                    
                    <Select
                        placeholder="Section/Unit/Office"
                        optionFilterProp="children"
                        showSearch
                        // mode={props.type == "update" ? "multiple" : ""}
                        filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.office.update']) }
                    >
                        { props.user_divisions.map(division =>  {
                            return (
                                <OptGroup label={division.name}  key={division.id}>
                                    { props.user_sections?.filter(section => section.parent.name == division.name).map(section => {
                                        return <Option value={section.id} key={section.id}>{`${section.name} - ${section.title}`}</Option>
                                    }) }
                                </OptGroup>
                            );
                        }) }
                    </Select>
                </Form.Item>
                {props.type == "update" ? (
                    <Form.Item
                        name="group_id"
                        label="Techinical Working Group"
                        { ...helpers.displayError(formErrors, `group_id`) }
                        // rules={[{ required: true, message: 'Please select Techinical Working Group' }]}
                    >
                        <Select
                            placeholder="Techinical Working Group"
                            optionFilterProp="children"
                            showSearch
                            mode='multiple'
                            filterOption={(input, option) =>
                                option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.twg.update']) }
                        >
                            { props.technical_working_groups.map(group =>  {
                                return (
                                    <Option value={group.id} key={group.id}>{group.name}</Option>
                                );
                            }) }
                        </Select>
                    </Form.Item>
                ) : ""}

                <Form.Item
                    name="position_id"
                    label="Position"
                    { ...helpers.displayError(formErrors, `position_id`) }
                    rules={[{ required: true, message: 'Please select Position' }]}
                >
                    <Select
                        placeholder="Position"
                        optionFilterProp="children"
                        showSearch
                        filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.information.update']) }
                    >
                        { props.user_positions.map(position =>  {
                            return (
                                <Option value={position.id} key={position.id}>{position.name}</Option>
                            );
                        }) }
                    </Select>
                </Form.Item>
                
                <Form.Item
                    name="designation"
                    label="Designation"
                    { ...helpers.displayError(formErrors, `designation`) }
                    // rules={[{ required: true, message: 'Please input your Designation!' }]}
                >
                    <Input
                        placeholder="Designation"
                        disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.information.update']) }
                    />
                </Form.Item>
                <Form.Item
                    name="cellphone_number"
                    label="Cellphone Number"
                    { ...helpers.displayError(formErrors, `cellphone_number`) }
                    rules={[{ required: true, message: 'Please input your Cellphone Number!' }]}
                >
                    <Input
                        prefix={<PhoneOutlined className="site-form-item-icon" />}
                        placeholder="Cellphone Number"
                        disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.information.update']) }
                    />
                </Form.Item>
                <Form.Item
                    name="email_address"
                    label="Email Address"
                    { ...helpers.displayError(formErrors, `email_address`) }
                    rules={[{ required: true, message: 'Please input your Email Address!' }]}
                >
                    <Input
                        type="email"
                        prefix={<MailOutlined className="site-form-item-icon" />}
                        placeholder="Email Address"
                        disabled={ props.page =='profile' && !helpers.hasPermission(props.user, ['profile.information.update']) }
                    />
                </Form.Item>
                { props.type == "create" ? (
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={submit} disabled={submit}>
                        Register
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="danger" onClick={() => {props.setRegisterStep(0); props.setShowRegister(false)}  }>
                        Cancel
                        </Button>
                    </Form.Item>
                ) : (
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={submit} disabled={submit}>
                        Update
                        </Button>
                    </Form.Item>
                ) }
            </Form>
        </div>
    );
}

// export default UserForm;

UserForm.defaultProps = {
    page: "users",
}

export default connect(
    mapStateToProps,
  )(UserForm);

