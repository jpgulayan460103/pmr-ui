import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row } from 'antd';
import style from './style.less'
import SummaryPurchaseRequest from './Components/SummaryPurchaseRequest';
import BarPurchaseRequest from './Components/BarPurchaseRequest';
import TopRequestedItems from './Components/TopRequestedItems';
import ModeOfProcurementPie from './Components/ModeOfProcurementPie';
import ProcurementTypeVisual from './Components/ProcurementTypeVisual';
import api from '../../api';
import { cloneDeep, isEmpty, uniqBy } from 'lodash';

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        purchaseRequest: state.reports.purchaseRequest,
    };
}

const Home = ({dispatch, isInitialized, purchaseRequest}) => {
    useEffect(() => {
        document.title = "Dashboard";
        if(isInitialized){
            if(isEmpty(purchaseRequest)){
                getPurchaseRequests();
            }
        }
    }, [isInitialized]);

    const getPurchaseRequests = () => {
       api.Report.purchaseRequest()
       .then(res => {
           let results = res.data;
           let procurement_types = cloneDeep(results.procurement_types.types);
           let uniqProcCategory = uniqBy(procurement_types, 'procurement_type_category');
           let mappedUniqProcCategory = uniqProcCategory.map(i => {
                let categoryProcurementTypes = procurement_types.filter(p => p.procurement_type_category_id == i.procurement_type_category_id);
                let category_percentage = categoryProcurementTypes.reduce((sum, item) => {
                    return sum += item.procurement_type_percentage;
                }, 0);
                let category_total = categoryProcurementTypes.reduce((sum, item) => {
                    return sum += item.sum_cost;
                }, 0);
                i.category_percentage = Math.round((category_percentage + Number.EPSILON) * 100) / 100;
                i.category_total = Math.round((category_total + Number.EPSILON) * 100) / 100;
                delete i.sum_cost;
                delete i.procurement_type_percentage;
                delete i.name;
                delete i.procurement_type_id;
                i.name = i.procurement_type_category;
                delete i.procurement_type_category;
               return i;
           });
           results.procurement_types = {
               data1: mappedUniqProcCategory,
               data2: results.procurement_types.types,
               start_day: results.procurement_types.start_day,
               end_day: results.procurement_types.end_day,
           };
           dispatch({
               type: "SET_REPORT_PURCHASE_REQUEST",
               data: results
           });
       })
       .catch(err => {})
       .then(res => {})
    }
    return (
        <div style={style}>
             <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <SummaryPurchaseRequest label="Monthly Approved Purchase Request" summaryData={purchaseRequest.approved_month} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <SummaryPurchaseRequest label="Monthly Pending Purchase Request" summaryData={purchaseRequest.pending_month} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <SummaryPurchaseRequest label="Yearly Approved Purchase Request" summaryData={purchaseRequest.approved_year} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <SummaryPurchaseRequest label="Yearly Pending Purchase Request" summaryData={purchaseRequest.pending_year} />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <BarPurchaseRequest label="Yearly Purchase Request" yearlyData={purchaseRequest.yearly} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <TopRequestedItems label="Most requested items by quantity" summaryData={purchaseRequest.most_quantity_items}/>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <TopRequestedItems label="Most requested items by unit cost" summaryData={purchaseRequest.most_cost_items} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <ProcurementTypeVisual />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <ModeOfProcurementPie label="Mode of Procurement" summaryData={purchaseRequest.mode_of_procurements} />
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="mb-3">
                
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Home);

