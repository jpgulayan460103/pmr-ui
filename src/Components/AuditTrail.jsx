import React, { useState } from 'react';

import {
    Table,
    Timeline,
    Button,
} from 'antd';
import {
    CloseOutlined,
} from '@ant-design/icons';

const AuditTrail = ({logger, timelineCss, tableScroll, showSubject, displayProp, hasChild, childProp }) => {
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
                    <div className="flex">
                        <div className='truncate' style={{width: "90%"}}>
                            <b>
                                { hasChild && selectedLogger.subject[childProp] ? selectedLogger.subject[childProp][displayProp] : selectedLogger.subject[displayProp] }
                            </b>
                        </div>
                    </div>
                    <i>{selectedLogger.created_at_time}</i><br />
                    {selectedLogger.description} by: <b>{selectedLogger.user.user_information.fullname}</b>
                    <Button className='float-right mb-1' size='small' type='danger' onClick={() => setShowLoggerDetails(false) }>
                        <CloseOutlined />
                    </Button>
                </div>
            ) : <span className='mb-2'>&nbsp;</span> }
            { showLoggerDetails ? (
                <>
                    <Table size='small' dataSource={selectedLogger.properties} columns={columns} pagination={false} />
                </>
            ) : (
                <div>
                    <Timeline>
                        { logger.map(i => (
                        <Timeline.Item key={i.key}>
                            <div className="flex">
                                <div className='truncate' style={{width: "53%"}}>
                                    <b>
                                        { hasChild && i.subject[childProp] ? i.subject[childProp][displayProp] : i.subject[displayProp] }
                                    </b>
                                </div>
                                <div className='custom-pointer' onClick={() => selectLogger(i)}>
                                    <span>View Changes</span>
                                </div>
                            </div>
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
    hasChild: false,
    childProp: '',
    displayProp: 'uuid_last',
}

export default AuditTrail;
