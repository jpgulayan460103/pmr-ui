import React, { useState } from 'react';

import {
    Table,
    Timeline,
    Button,
} from 'antd';
import {
    CloseOutlined,
} from '@ant-design/icons';

const AuditTrail = ({logger, timelineCss, tableScroll, showSubject}) => {
    const [showLoggerDetails, setShowLoggerDetails] = useState(false);
    const [selectedLogger, setSelectedLogger] = useState([]);
    const columns = [
        {
          title: 'Field',
          dataIndex: 'label',
          key: 'label',
          width: 100,
        },
        {
          title: 'Old',
          dataIndex: 'old',
          key: 'old',
        },
        {
          title: 'New',
          dataIndex: 'new',
          key: 'new',
        },
    ];

    const selectLogger = (item) => {
        setSelectedLogger(item);
        setShowLoggerDetails(true);
    }
    return (
        <div>
            { showLoggerDetails ? (
                <div>
                {showSubject ? <span>ID: <b>{selectedLogger.subject.uuid_last}</b><br /></span> : ""}
                <span>{selectedLogger.description} by: <b>{selectedLogger.user?.user_information?.fullname}</b><br /></span>
                <span>{selectedLogger.description} by: <b>{selectedLogger.user?.user_information?.fullname}</b><br /></span>
                <span>on <b>{selectedLogger.created_at_time}</b></span>
                    <Button className='float-right mb-1' size='small' type='danger' onClick={() => setShowLoggerDetails(false) }>
                        <CloseOutlined />
                    </Button>
                </div>
            ) : <span className='mb-2'>&nbsp;</span> }
            { showLoggerDetails ? (
                <>
                <Table size='small' dataSource={selectedLogger.properties} columns={columns} pagination={false} scroll={{ y: tableScroll }} />
                </>
            ) : (
                <div style={{ ...timelineCss, overflowY: "auto", overflowX: "hidden", padding: "5px" }}>
                    <Timeline>
                        { logger.map(i => (
                        <Timeline.Item key={i.key}>
                            {showSubject ? <span><b>{i.subject.uuid_last}</b> <span className='custom-pointer' onClick={() => selectLogger(i)}>View Changes</span><br /></span> : ""}
                            <i>{i.created_at_time}</i><br />
                            {i.description} by: <b>{i.user.user_information.fullname}</b>
                        </Timeline.Item>
                        )) }
                    </Timeline>
                </div>
            ) }
            </div>
    );
}

AuditTrail.defaultProps = {
    showSubject: true
}

export default AuditTrail;
