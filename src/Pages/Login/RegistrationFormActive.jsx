import React, {useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../api';

const { Option, OptGroup } = Select;

function mapStateToProps(state) {
    return {
        user_sections: state.library.user_sections,
        user_divisions: state.library.user_divisions,
        libraries: state.library.libraries,
    };
}


const RegistrationFormActive = (props) => {
    const formRef = React.useRef();
    useEffect(() => {
        formRef.current.setFieldsValue({firstname: props.userInfo.firstname, middlename: props.userInfo.middlename, lastname: props.userInfo.lastname})
    }, [props.firstname]);
    useEffect(() => {
        console.log(props);
    }, []);
    const onFinish = (values) => {
        console.log('Success:', values);
        values.username = props.userInfo.username;
        values.user_dn = props.userInfo.user_dn;
        values.password = "ad_account";
        values.type = "ad_account";
        api.User.registerAd(values)
        .then(res => {
            console.log(res);
        })
        .catch(res => {})
        .then(res => {})
        ;
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const testField = () => {
        console.log(props);
        // formRef.current.setFieldsValue({
        //     firstname: "firstname", 
        //     middlename: "middlename", 
        //     lastname: "lastname"
        // });
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
                    rules={[{ required: true, message: 'Please input your Firstname!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Firstname" />
                </Form.Item>
                <Form.Item
                    name="middlename"
                    label="Middle Initial"
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="middlename" />
                </Form.Item>
                <Form.Item
                    name="lastname"
                    label="Lastname"
                    rules={[{ required: true, message: 'Please input your Lastname!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Lastname" />
                </Form.Item>
                <Form.Item
                    name="section_id"
                    label="Section/Unit/Office"
                    rules={[{ required: true, message: 'Please select section/unit/office' }]}
                >
                    <Select
                        placeholder="Section/Unit/Office"
                        optionFilterProp="children"
                        showSearch
                        filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
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
                <Form.Item
                    name="cellphone_number"
                    label="Cellphone Number"
                    rules={[{ required: true, message: 'Please input your Cellphone Number!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Cellphone Number" />
                </Form.Item>
                <Form.Item
                    name="email_address"
                    label="Email Address"
                    rules={[{ required: true, message: 'Please input your Email Address!' }]}
                >
                    <Input type="email" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email Address" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    Register
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="danger" onClick={() => props.setRegisterStep(0)  }>
                    Cancel
                    </Button>
                </Form.Item>
            </Form>
            {/* <span onClick={() => testField() }>aaaaaa</span> */}
        </div>
    );
}

// export default RegistrationFormActive;

export default connect(
    mapStateToProps,
  )(RegistrationFormActive);

