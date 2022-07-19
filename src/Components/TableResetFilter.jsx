import React from 'react';
import { Tooltip, message } from 'antd';
import Icon, { ClearOutlined } from '@ant-design/icons'


const TableResetFilter = ({defaultTableFilter, setTableFilter}) => {
    return (
        <>
            <Tooltip placement="top" title="Clear Filters">
                <ClearOutlined style={{cursor: "pointer"}} onClick={() => {
                    setTableFilter(defaultTableFilter);
                    message.info('Table filter has been set to default. Please refresh the table');
                }} />
            </Tooltip>
        </>
    );
}

export default TableResetFilter;
