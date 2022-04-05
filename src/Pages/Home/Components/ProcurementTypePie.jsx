import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider, Table  } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Label, LabelList } from 'recharts';

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const ProcurementTypePie = ({label, summaryData}) => {
    const data01 = summaryData?.data1;
    const data02 = summaryData?.data2;
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius)  * 1.4;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {data01[index].name}  {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };
    return (
        <Card size="small" bordered={false} style={{height: "466px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "356px"}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Tooltip formatter={(value) => {
                            return `${value}%`;
                        }} />
                        <Pie data={data01} dataKey="category_percentage" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" label={renderCustomizedLabel} />
                        {/* <Pie data={data02} dataKey="procurement_type_percentage" cx="50%" cy="50%" innerRadius={100} outerRadius={140} fill="#82ca9d" label /> */}
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <Divider className='mb-2' />
                { dayjs().startOf('month').format("MMMM DD, YYYY") } - { dayjs().endOf('month').format("MMMM DD, YYYY") }
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(ProcurementTypePie);
