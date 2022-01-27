import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Table, Divider, Space } from 'antd';


function mapStateToProps(state) {
    return {
        
    };
}

const UserTable = (props) => {

    const [selectedIndex, setSelectedIndex] = useState(null);
    const dataSource = props.users;
    const columns = [
        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Section/Unit/Office',
            key: 'Section/Unit/Office',
            render: (text, record, index) => (
                <span>{ record.user_information?.section?.value }</span>
              ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
              <Space size={2} >
                <span className='custom-pointer' onClick={() => { props.selectUser(record, 'edit'); setSelectedIndex(index) }} >Edit</span>
                <Divider type='vertical' />
                <span className='custom-pointer'>Delete</span>
                <Divider type='vertical' />
                <span className='custom-pointer' onClick={() => { props.selectUser(record, 'permissions') }}>Permissions</span>
              </Space>
            ),
          }
    ];

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}  rowClassName={(record, index) => {
                    if(selectedIndex == index){
                        return "selected-row";
                    }
                }}
                size={"small"}
                />
        </div>
    );
}

export default connect(
    mapStateToProps,
)(UserTable);

