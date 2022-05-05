import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider, Table  } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Label, LabelList } from 'recharts';
import { cloneDeep, isEmpty } from 'lodash';
import Icon from '@ant-design/icons';

const { Title, Text } = Typography;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const ColorSvg = () => (
    <svg t="1649210395377" className='anticon' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5897" width="1.5em" height="1.5em"><path d="M426.666667 384V213.333333l-298.666667 298.666667 298.666667 298.666667v-174.933334c213.333333 0 362.666667 68.266667 469.333333 217.6-42.666667-213.333333-170.666667-426.666667-469.333333-469.333333z" p-id="5898"></path></svg>
)

const PieAccount = ({label, summaryData, selectedCategory, selectCategory}) => {
    // const data01 = summaryData?.data2.filter(i => i.account_classification_id == selectedCategory.account_classification_id);
    const data01 = cloneDeep(summaryData)?.data2.filter(i => i.account_classification_id == selectedCategory.account_classification_id).map(i => {
        i.account_percentage_mod = Math.round((((i.account_percentage / selectedCategory.category_percentage) * 100) + Number.EPSILON) * 100) / 100;
        return i;
    });
    // console.log(data01);
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
            key: 'account_percentage_mod',
            align: "center",
            sorter: (a, b) => a.account_percentage_mod - b.account_percentage_mod,
            render: (text, item, index) => (<span>{ helpers.currencyFormat(item.account_percentage_mod) }%</span>),
        },
        {
            title: 'Total',
            key: 'sum_cost',
            align: "right",
            sorter: (a, b) => a.sum_cost - b.sum_cost,
            render: (text, item, index) => (<span>{ helpers.currencyFormat(item.sum_cost) }</span>),
        },
    ];
    
    return (
        <Card size="small" bordered={false} style={{height: "766px"}} >
            <div>
                <div className="flex justify-between">
                    <p>{label} - {selectedCategory.name}</p>
                    <p>
                        <Icon component={ColorSvg} onClick={() => { selectCategory({}) }} />
                    </p>
                </div>
                <div style={{height: "356px"}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Tooltip cursor={false} formatter={(value, name, props) => {
                            // return `${value}%`;
                            return helpers.currencyFormat(props.payload.payload.sum_cost);
                        }} />
                        <Pie data={data01} dataKey="account_percentage_mod" cx="50%" cy="50%" innerRadius={60} outerRadius={110} fill="#83a6ed" label={renderCustomizedLabel} />
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
                                return sum += item.sum_cost;
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
)(PieAccount);
