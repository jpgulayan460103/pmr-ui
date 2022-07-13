import React, { useEffect, useState } from 'react';

import {
    Table,
    Timeline,
    Button,
    Modal,
} from 'antd';
import {
    CloseOutlined,
} from '@ant-design/icons';
import AuditTrail from './AuditTrail';

const AuditBatches = ({logger}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [audit, setAudit] = useState([]);

    const showModal = (record) => {
        setAudit(record);
        setIsModalVisible(true);
    };
  
    const handleOk = () => {
        setIsModalVisible(false);
    };
  
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const dataSource = logger;
    const columns = [
        {
            title: 'Timestamp',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'User',
            key: 'user',
            render: (text, record, index) => (
                <span onClick={() => showModal(record)}>
                    { record.causer?.user_information?.fullname }
                </span>
            ),
        },
        {
            title: '',
            key: 'view',
            render: (text, record, index) => (
                <span className='custom-pointer' onClick={() => showModal(record)}>
                    View
                </span>
            ),
        },
    ];
    return (
        <div>
            <Modal title="Audit Trail" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width="40vw" bodyStyle={{height: "50vh" , overflow: "auto"}}>
                Timestamp: <b>{ audit?.created_at }</b> <br />
                User: <b>{ audit?.causer?.user_information?.fullname }</b><br />
                <AuditTrail audit={audit} tableScroll="65vh" />
            </Modal>
            <Table size='small' dataSource={dataSource} columns={columns} pagination={false} />
        </div>
    );
}

export default AuditBatches;
