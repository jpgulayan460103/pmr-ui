import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Skeleton, Pagination, Button, Typography, Timeline, Tabs, Input, DatePicker, Card, Col, Row, Dropdown, Menu, Tooltip  } from 'antd';
import api from '../../api';
import Icon, {
    CloseOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
import { cloneDeep, debounce, isEmpty } from 'lodash';
import filter from '../../Utilities/filter';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        selectedProcurementPlan: state.procurementPlans.list.selectedProcurementPlan,
        procurementPlans: state.procurementPlans.list.procurementPlans,
        paginationMeta: state.procurementPlans.list.paginationMeta,
        loading: state.procurementPlans.list.loading,
        timelines: state.procurementPlans.list.timelines,
        logger: state.procurementPlans.list.logger,
        tableFilter: state.procurementPlans.list.tableFilter,
        defaultTableFilter: state.procurementPlans.list.defaultTableFilter,
        tab: state.procurementPlans.list.tab,
        user_sections: state.libraries.user_sections,
    };
}


const SummaryProcurementPlan = (props) => {
    const unmounted = React.useRef(false);
    let history = useHistory()
    useEffect(() => {
        return () => {
            unmounted.current = true;
        }
    }, []);
    useEffect(() => {
        document.title = "List of Procurement Plan";
        if(props.isInitialized){
            getSummary();
            if(isEmpty(props.procurementPlans)){
            
            }
        }
    }, [props.isInitialized]);

    const [summary, setSummary] = useState({});
    

    const getSummary = () => {
        api.ProcurementPlan.management()
        .then(res => {
            setSummary(res.data);
        })
        .catch(res => {})
        .then(res => {})
    }
    
    

    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <Card size="small" title="Summary of Project Procurement Management Plan" bordered={false}>
                        { summary?.calendar_year } <br />
                        { summary?.end_user?.name } <br />
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>ITEM</th>
                                    <th>QUANTITY</th>
                                    <th>Jan</th>
                                    <th>Feb</th>
                                    <th>Mar</th>
                                    <th>Apr</th>
                                    <th>May</th>
                                    <th>Jun</th>
                                    <th>July</th>
                                    <th>Aug</th>
                                    <th>Sept</th>
                                    <th>Oct</th>
                                    <th>Nov </th>
                                    <th>Dec</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    summary?.items?.data.map( item => (
                                        <tr key={item.key}>
                                            <td>{item?.item?.item_name}</td>
                                            <td>{item.total_quantity}</td>
                                            <td>{item.mon1}</td>
                                            <td>{item.mon2}</td>
                                            <td>{item.mon3}</td>
                                            <td>{item.mon4}</td>
                                            <td>{item.mon5}</td>
                                            <td>{item.mon6}</td>
                                            <td>{item.mon7}</td>
                                            <td>{item.mon8}</td>
                                            <td>{item.mon9}</td>
                                            <td>{item.mon10}</td>
                                            <td>{item.mon11}</td>
                                            <td>{item.mon12}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </Card>
                </Col>
            </Row>
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(SummaryProcurementPlan);
