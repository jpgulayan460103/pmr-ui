import React, { useCallback } from 'react';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons'
import ReloadSvg from '../Icons/ReloadSvg';
import { debounce } from 'lodash';


const TableRefresh = ({getData}) => {
    const refreshData = debounce(() => {
        getData();
    }, 250)

    const debouceRequest = useCallback(() => refreshData(), []);
    return (
        <>
            <Tooltip placement="top" title="Refresh">
                <Icon component={ReloadSvg} style={{cursor: "pointer"}} onClick={debouceRequest} />
            </Tooltip>
        </>
    );
}

export default TableRefresh;
