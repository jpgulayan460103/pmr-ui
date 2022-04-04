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

const TopRequestedItems = ({label}) => {

    const dataSource = [
        {
          key: '1',
          name: 'Item ',
          quantity: Math.floor(Math.random() * 100),
          amount: Math.floor(Math.random() * 1000000),
        },
        {
          key: '2',
          name: 'Item ',
          quantity: Math.floor(Math.random() * 100),
          amount: Math.floor(Math.random() * 1000000),
        },
        {
            key: '3',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
          {
            key: '4',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
          {
            key: '5',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
          {
            key: '6',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
          {
            key: '7',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
          {
            key: '8',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
          {
            key: '9',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
          {
            key: '10',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
          {
            key: '11',
            name: 'Item ',
            quantity: Math.floor(Math.random() * 100),
            amount: Math.floor(Math.random() * 1000000),
          },
      ];
      
      const columns = [
        {
            title: '#',
            key: 'spot',
            render: (text, item, index) => (<span>{index + 1}</span>),
        },
        {
          title: 'Item Name',
          key: 'name',
          render: (text, item, index) => (<span>{ item.name } {Math.floor(Math.random() * 100)}</span>),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            align: "center",
        },
        {
            title: 'Amount',
            key: 'amount',
            align: "right",
            render: (text, item, index) => (<span>{ helpers.currencyFormat(item.amount) }</span>),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.amount - b.amount,
        },
      ];
    return (
        <Card size="small" bordered={false} style={{height: "466px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "356px"}}>
                    <Table dataSource={dataSource} columns={columns} size={"small"}  scroll={{ y: "286px" }}/>
                </div>
                <Divider className='mb-2' />
                { dayjs().startOf('month').format("MMMM DD, YYYY") } - { dayjs().endOf('month').format("MMMM DD, YYYY") }
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(TopRequestedItems);
