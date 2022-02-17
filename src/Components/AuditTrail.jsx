import React, { useState } from 'react';

import {
    Table,
    Timeline,
    Button,
} from 'antd';
import {
    CloseOutlined,
} from '@ant-design/icons';

const AuditTrail = ({logger, timelineCss, tableScroll, showSubject, displayProp}) => {
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
                {showSubject ? <div className="flex"><div className='truncate' style={{width: "90%"}}><b>{selectedLogger.subject[displayProp]}</b> </div><br /></div> : ""}
                <i>{selectedLogger.created_at_time}</i><br />
                {selectedLogger.description} by: <b>{selectedLogger.user.user_information.fullname}</b>
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
                <div>
                    <Timeline>
                        { logger.map(i => (
                        <Timeline.Item key={i.key}>
                            {showSubject ? <div className="flex"><div className='truncate' style={{width: "53%"}}><b>{i.subject[displayProp]}</b> </div><div className='custom-pointer' onClick={() => selectLogger(i)}>View Changes</div><br /></div> : ""}
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
    showSubject: true,
    displayProp: 'uuid_last',
}

export default AuditTrail;
