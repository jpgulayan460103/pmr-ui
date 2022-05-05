import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider, Table  } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Label, LabelList, Legend } from 'recharts';
import { isEmpty } from 'lodash';

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const PieAccountClassification = ({label, summaryData, selectCategory}) => {
    const data01 = summaryData?.data1;
    const data02 = summaryData?.data2;
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius)  * 1.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`} - {data01[index].name}
            </text>
        );
    };


    const dataSource = data01;
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Percentage',
            key: 'category_percentage',
            align: "center",
            sorter: (a, b) => a.category_percentage - b.category_percentage,
            render: (text, item, index) => (<span>{ helpers.currencyFormat(item.category_percentage) }%</span>),
        },
        {
            title: 'Total',
            key: 'category_total',
            align: "right",
            sorter: (a, b) => a.category_total - b.category_total,
            render: (text, item, index) => (<span>{ helpers.currencyFormat(item.category_total) }</span>),
        },
    ];
    

    const handleClick = (e) => {
        if(!isEmpty(e)){
            selectCategory(e.payload.payload)
        }
    }
    return (
        <Card size="small" bordered={false} style={{height: "766px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "356px"}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Tooltip cursor={false} formatter={(value, name, props) => {
                            // return `${value}%`;
                            return helpers.currencyFormat(props.payload.payload.category_total);
                        }} />
                        {/* <Legend verticalAlign="top" layout='radial'/> */}
                        <Pie  onClick={handleClick} data={data01} dataKey="category_percentage" cx="50%" cy="50%" innerRadius={60} outerRadius={110} fill="#8884d8" label={renderCustomizedLabel} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{height: "300px"}}>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        scroll={{ y: "265px" }}
                        pagination={false}
                        summary={pageData => {
                            let total = 0;
                            total = pageData.reduce((sum, item) => {
                                return sum += item.category_total;
                            }, 0);
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell>
                                            <b>Total</b>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                        
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell align='right'>
                                            <b>{ helpers.currencyFormat(total) }</b>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            );
                        }}
                    />
                </div>
                <Divider className='mb-2' />
                Period: <b>{ summaryData?.start_day } - { summaryData?.end_day }</b>
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(PieAccountClassification);
