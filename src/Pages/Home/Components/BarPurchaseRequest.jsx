import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const BarPurchaseRequest = ({label, yearlyData}) => {
    const data = yearlyData?.data;
    return (
        <Card size="small" bordered={false} style={{height: "366px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "256px", width: "100%"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                    >
                        <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="month_short" scale="band" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="approved" stroke="#ff7300" />
                    <Bar dataKey="pending" barSize={20} fill="#413ea0" />
                    </ComposedChart>
                </ResponsiveContainer>
                </div>
                <Divider className='mb-2' />
                Period: { yearlyData?.start_day } - { yearlyData?.end_day }
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(BarPurchaseRequest);
