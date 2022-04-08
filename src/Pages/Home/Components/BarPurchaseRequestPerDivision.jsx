import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { isEmpty } from 'lodash';

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}
const CustomizedLabel = (props) => {
    const { x, y, stroke, value } = props;
    
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
}
const CustomizedAxisTick = (props) => {
    const { x, y, stroke, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="start" fill="#666" transform="rotate(45)" >
          {payload.value}
        </text>
      </g>
    );
}
const BarPurchaseRequestPerDivision = ({label, summaryData, selectDivision}) => {
    const data = summaryData?.data1;
    const handleClick = (e) => {
        if(e && e.activePayload && !isEmpty(e.activePayload)){
            selectDivision(e.activePayload[0].payload)
        }
        // if(!isEmpty(e)){
        //     selectDivision(e.payload)
        // }
    }
    return (
        <Card size="small" bordered={false} style={{height: "566px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "456px", width: "100%"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    onClick={handleClick}
                    >
                        <Tooltip
                            label="asd"
                            formatter={(value, name, props) => {
                                return [
                                    new Intl.NumberFormat('en').format(value),
                                    "Approved Purchase Request"
                                ]
                            }}
                            labelFormatter={(value, payload) => {
                                if(isEmpty(payload)){
                                    return null;
                                }
                                return payload[0]?.payload?.division_name;
                            }}
                        />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="division_title" height={100} interval={0} tick={<CustomizedAxisTick />} />
                    <YAxis />
                    {/* <Tooltip /> */}
                    <Legend verticalAlign="top" />
                    <Bar dataKey="total" fill="#8884d8"  name="Approved Purchase Request" onClick={handleClick} />
                    {/* <Brush /> */}
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                <Divider className='mb-2' />
                Period: { summaryData?.start_day } - { summaryData?.end_day }
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(BarPurchaseRequestPerDivision);
