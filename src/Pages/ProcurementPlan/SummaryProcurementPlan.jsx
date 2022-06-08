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
            if(isEmpty(props.procurementPlans)){
            
            }
        }
    }, [props.isInitialized]);
    
    

    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <Card size="small" title="Summary of Project Procurement Management Plan" bordered={false}>
                        
                    </Card>
                </Col>
            </Row>
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(SummaryProcurementPlan);
