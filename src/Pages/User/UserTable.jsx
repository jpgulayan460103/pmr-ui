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
    LockOutlined,
} from '@ant-design/icons';


function mapStateToProps(state) {
    return {
        
    };
}

const UserTable = (props) => {

    const [selectedIndex, setSelectedIndex] = useState(null);
    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    props.selectUser(record, 'edit')
                    setSelectedIndex(colIndex)
                },
            };
          }
    }
    const dataSource = props.users;
    const columns = [
        {
            title: 'Role',
            key: 'role',
            width: 150,
            ...onCell,
            sorter: (a, b) => a.roles.data[0].name?.localeCompare(b.roles.data[0].name),
            render: (text, record, index) => (
                <span>
                    { record.roles.data[0].name }
                </span>
            ),
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 150,
            ...onCell,
            sorter: (a, b) => a.username?.localeCompare(b.username),
        },
        {
            title: 'Fullname',
            key: 'fullname',
            width: 250,
            sorter: (a, b) => a.user_information?.fullname?.localeCompare(b.user_information?.fullname),
            render: (text, record, index) => (
                <span>
                    { record.user_information.fullname }
                </span>
            ),
            ...onCell,
        },
        {
            title: 'Position',
            key: 'position',
            width: 150,
            sorter: (a, b) => a.user_information?.position?.name?.localeCompare(b.user_information?.position?.name),
            render: (text, record, index) => (
                <span>
                    { record.user_information?.position?.name }
                </span>
            ),
            ...onCell,
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
            ...onCell,
        },
        {
            title: 'Email Address',
            index: 'email_address',
            width: 150,
            sorter: (a, b) => a.email_address?.localeCompare(b.email_address),
            render: (text, record, index) => (
                <span>
                    { record.user_information?.email_address }
                </span>
            ),
            ...onCell,
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
            ...onCell,
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
            ...onCell,
        },
        // {
        //     title: "Action",
        //     key: "action",
        //     fixed: 'right',
        //     width: 60,
        //     align: "center",
        //     render: (text, item, index) => (
        //         <Dropdown overlay={menu(item, index)} trigger={['hover']}>
        //             <EllipsisOutlined style={{ fontSize: '24px' }} />
        //         </Dropdown>
        //     ),
        // },
    ];

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

