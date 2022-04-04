import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const BarPurchaseRequest = ({label}) => {
    const data = [
        {
            name: 'January',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'February',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'March',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'April',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'May',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'June',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'July',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'August',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'September',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'October',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'November',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
        {
            name: 'December',
            approved: Math.floor(Math.random() * 1000000),
            unapproved: Math.floor(Math.random() * 1000000),
        },
      ];
    const test = (e) => {
        console.log(e);
    }

    const renderColorfulLegendText = (value, entry) => {
        const { color } = entry;
      
        return <span style={{ color }}>{helpers.currencyFormat(value)}</span>;
      };
    return (
        <Card size="small" bordered={false} style={{height: "366px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "256px", width: "100%"}}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    onClick={(e) => test(e)}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Approved PR Amount" dataKey="approved" fill="#8884d8" />
                    <Bar name="Unapproved PR Amount" dataKey="unapproved" fill="#82ca9d" />
                </BarChart>
                </ResponsiveContainer>
                </div>
                <Divider className='mb-2' />
                { dayjs().startOf('year').format("MMMM DD, YYYY") } - { dayjs().endOf('year').format("MMMM DD, YYYY") }
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(BarPurchaseRequest);
