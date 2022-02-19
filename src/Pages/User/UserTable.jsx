import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Table, Dropdown, Tag, Menu } from 'antd';

import Icon, {
    CloseOutlined,
    EllipsisOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
    LoadingOutlined,
    UserOutlined,
    KeyOutlined,
} from '@ant-design/icons';


function mapStateToProps(state) {
    return {
        
    };
}

const PermissionSvg = () => (
    <svg t="1644895120105" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6108" width="1.2em" height="1.2em"><path d="M915.2 131.2L571.2 16C537.6 6.4 486.4 6.4 452.8 16L108.8 131.2C65.6 144 32 187.2 32 228.8v460.8c0 64 30.4 126.4 108.8 166.4l308.8 147.2c35.2 17.6 89.6 17.6 124.8 0l340.8-147.2c76.8-30.4 76.8-102.4 76.8-166.4V228.8c0-41.6-22.4-83.2-76.8-97.6zM896 795.2L532.8 953.6c-9.6 4.8-32 4.8-43.2 0L160 795.2c-32-16-60.8-59.2-60.8-94.4V211.2c0-4.8 8-14.4 12.8-16L480 73.6c16-4.8 48-4.8 64 0l368 121.6c6.4 1.6 12.8 11.2 12.8 16v489.6c0 33.6 3.2 78.4-28.8 94.4z m-209.6-400c0-96-78.4-174.4-174.4-174.4s-174.4 78.4-174.4 174.4c0 84.8 62.4 156.8 142.4 171.2v264h60.8v-131.2h137.6V636.8h-137.6v-70.4c83.2-16 145.6-86.4 145.6-171.2zM512 505.6c-62.4 0-112-49.6-112-112s49.6-112 112-112 112 49.6 112 112-49.6 112-112 112z" p-id="6109"></path></svg>
);

const UserTable = (props) => {

    const [selectedIndex, setSelectedIndex] = useState(null);
    const dataSource = props.users;
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 150,
        },
        {
            title: 'Fullname',
            key: 'fullname',
            width: 250,
            render: (text, record, index) => (
                <span>
                    { record.user_information.fullname }
                </span>
            ),
        },
        {
            title: 'Position',
            key: 'position',
            width: 150,
            render: (text, record, index) => (
                <span>
                    { record.user_information?.position?.name }
                </span>
            ),
        },
        {
            title: 'Cellphone Number',
            index: 'cellphone_number',
            width: 150,
            render: (text, record, index) => (
                <span>
                    { record.user_information?.cellphone_number }
                </span>
            ),
        },
        {
            title: 'Email Address',
            index: 'email_address',
            width: 150,
            render: (text, record, index) => (
                <span>
                    { record.user_information?.email_address }
                </span>
            ),
        },
        {
            title: 'Section/Unit/Office',
            key: 'office',
            width: 450,
            render: (text, record, index) => (
                <span>
                    { record.user_offices?.data.map(i => <Tag key={i.key}>{i.office.name} <br /> </Tag>) }
                </span>
            ),
        },
        {
            title: 'Technical Working Group',
            key: 'groups',
            width: 250,
            render: (text, record, index) => (
                <span>
                    { record.user_groups?.data.map(i => <Tag key={i.key}>{i.group.name} <br /> </Tag>) }
                </span>
            ),
        },
        {
            title: "Action",
            key: "action",
            fixed: 'right',
            width: 60,
            align: "center",
            render: (text, item, index) => (
                <Dropdown overlay={menu(item, index)} trigger={['click']}>
                    <EllipsisOutlined style={{ fontSize: '24px' }} />
                </Dropdown>
              )
        },
    ];

    const menu = (item, index) => (
        <Menu>
            <Menu.Item key="menu-view" icon={<UserOutlined />}  onClick={() => { props.selectUser(item, 'edit'); setSelectedIndex(index) }}>
                Edit
            </Menu.Item>
            <Menu.Item key="menu-edit" icon={<KeyOutlined />}  onClick={() => { props.selectUser(item, 'permissions'); setSelectedIndex(index) }}>
                Permissions
            </Menu.Item>
        </Menu>
      );

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} scroll={{ y: "70vh" }} rowClassName={(record, index) => {
                    if(selectedIndex == index){
                        return "selected-row";
                    }
                }}
                size={"small"}
                loading={{spinning: props.loading, tip: "Loading Users..."}}
                />
        </div>
    );
}

export default connect(
    mapStateToProps,
)(UserTable);

