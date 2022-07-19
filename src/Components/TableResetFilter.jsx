import React, { useCallback } from 'react';
import { Tooltip, message } from 'antd';
import Icon, { ClearOutlined } from '@ant-design/icons'
import { debounce } from 'lodash';


const TableResetFilter = ({defaultTableFilter, setTableFilter}) => {
    const refreshData = debounce(() => {
        setTableFilter(defaultTableFilter);
        message.info('The filters of the table has been removed.');
    }, 250)

    const debouceRequest = useCallback(() => refreshData(), []);
    return (
        <>
            <Tooltip placement="top" title="Clear Filters">
                <ClearOutlined style={{cursor: "pointer"}} onClick={debouceRequest} />
            </Tooltip>
        </>
    );
}

export default TableResetFilter;
