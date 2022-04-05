import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider, Table  } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const TopRequestedItems = ({label, summaryData}) => {

    const dataSource = summaryData?.items;
      
    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: 50,
            align: "center",
            sorter: (a, b) => a.key - b.key,
        },
        {
            title: 'Item Name',
            key: 'name',
            dataIndex: 'item_name',
            width: 350,
            sorter: (a, b) => a.item_name.localeCompare(b.item_name)
        },
        {
            title: 'Quantity',
            dataIndex: 'sum_quantity',
            key: 'sum_quantity',
            align: "center",
            width: 80,
            sorter: (a, b) => a.sum_quantity - b.sum_quantity,
        },
        {
            title: 'Ave Cost',
            key: 'ave_sum_cost',
            align: "right",
            width: 150,
            render: (text, item, index) => (<span>{ helpers.currencyFormat(item.ave_sum_cost) }</span>),
            sorter: (a, b) => a.ave_sum_cost - b.ave_sum_cost,
        },
        {
            title: 'Amount',
            key: 'sum_cost',
            align: "right",
            width: 150,
            render: (text, item, index) => (<span>{ helpers.currencyFormat(item.sum_cost) }</span>),
            sorter: (a, b) => a.sum_cost - b.sum_cost,
        },
    ];
    return (
        <Card size="small" bordered={false} style={{height: "466px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "356px"}}>
                    <Table pagination={false} dataSource={dataSource} columns={columns} size={"small"}  scroll={{ y: "336px" }}/>
                </div>
                <Divider className='mb-2' />
                { summaryData?.start_day } - { summaryData?.end_day }
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(TopRequestedItems);
