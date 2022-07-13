import React, { useEffect, useState } from 'react';

import {
    Table,
    Timeline,
    Button,
} from 'antd';
import {
    CloseOutlined,
} from '@ant-design/icons';

const AuditTrail = ({audit}) => {
    useEffect(() => {
        setShowLoggerDetails(false);
    }, [audit]);
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
                        <div className='truncate' style={{width: "100%"}}>
                            <b>
                                
                            </b>
                        </div>
                    </div>
                    <i>Audit Type: <b>{selectedLogger.description} {selectedLogger.form_type_header}</b></i><br />
                    <i>Audit No.: <b>{selectedLogger.logger_id}</b></i><br />
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
                        { audit?.logs?.data.map(i => (
                        <Timeline.Item key={i.key}>
                            <div className="flex">
                                <div className='truncate' style={{width: "70%"}}>
                                    <b>
                                        {i.description} { i.form_type_header }
                                    </b>
                                </div>
                                <div className='custom-pointer' style={{width: "30%"}} onClick={() => selectLogger(i)}>
                                    <span>View Changes</span>
                                </div>
                            </div>
                            <i>Audit No.: <b>{i.logger_id}</b></i><br />
                        </Timeline.Item>
                        )) }
                    </Timeline>
                </div>
            ) }
            </div>
    );
}

export default AuditTrail;
