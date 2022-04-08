import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { isEmpty } from 'lodash';
import Icon from '@ant-design/icons';

const { Title } = Typography;

const ColorSvg = () => (
    <svg t="1649210395377" className='anticon' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5897" width="1.5em" height="1.5em"><path d="M426.666667 384V213.333333l-298.666667 298.666667 298.666667 298.666667v-174.933334c213.333333 0 362.666667 68.266667 469.333333 217.6-42.666667-213.333333-170.666667-426.666667-469.333333-469.333333z" p-id="5898"></path></svg>
)

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
const BarPurchaseRequestPerSection = ({label, summaryData, selectDivision, selectedDivision}) => {
    const data = summaryData?.data2.filter(i => i.division_id == selectedDivision.division_id);
    return (
        <Card size="small" bordered={false} style={{height: "566px"}} >
            <div>
                <div className="flex justify-between">
                    <p>{label} - {selectedDivision.division_name}</p>
                    <p>
                        <Icon component={ColorSvg} onClick={() => { selectDivision({}) }} />
                    </p>
                </div>
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
                    >
                        <Tooltip
                            label="asd"
                            formatter={(value, name, props) => {
                                return new Intl.NumberFormat('en').format(value)
                            }}
                            labelFormatter={(value, payload) => {
                                if(isEmpty(payload)){
                                    return null;
                                }
                                return payload[0]?.payload?.section_name;
                            }}
                        />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="section_title" height={100} interval={0} tick={<CustomizedAxisTick />} />
                    <YAxis />
                    {/* <Tooltip /> */}
                    <Legend verticalAlign="top" />
                    <Bar dataKey="approved" fill="#8884d8"  name="Approved Purchase Request" />
                    <Bar dataKey="pending" fill="#82ca9d"  name="Pending Purchase Request" />
                    {/* <Brush /> */}
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                <Divider className='mb-2' />
                Period: <b>{ summaryData?.start_day } - { summaryData?.end_day }</b>
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(BarPurchaseRequestPerSection);
