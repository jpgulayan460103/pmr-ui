import React from 'react';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons'
import ReloadSvg from '../Icons/ReloadSvg';


const TableRefresh = ({getData}) => {
    return (
        <>
            <Tooltip placement="top" title="Refresh">
                <Icon component={ReloadSvg} style={{cursor: "pointer"}} onClick={() => {
                    getData();
                }} />
            </Tooltip>
        </>
    );
}

export default TableRefresh;
