import React from 'react';
import { Tooltip, message } from 'antd';
import Icon, { ClearOutlined } from '@ant-design/icons'


const TableResetFilter = ({defaultTableFilter, setTableFilter}) => {
    return (
        <>
            <Tooltip placement="top" title="Clear Filters">
                <ClearOutlined style={{cursor: "pointer"}} onClick={() => {
                    setTableFilter(defaultTableFilter);
                    message.info('The filters of the table has been removed.');
                }} />
            </Tooltip>
        </>
    );
}

export default TableResetFilter;
