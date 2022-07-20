import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row, DatePicker, Tag, Select, Button } from 'antd';
import style from './style.less'
import ReportPurchaseRequest from './Components/ReportPurchaseRequest';
import BarPurchaseRequest from './Components/BarPurchaseRequest';
import BarPurchaseRequestOffice from './Components/BarPurchaseRequestOffice';
import TopRequestedItems from './Components/TopRequestedItems';
import PieModeOfProcurement from './Components/PieModeOfProcurement';
import ReportAccount from './Components/ReportAccount';
import api from '../../api';
import { cloneDeep, isEmpty, uniqBy } from 'lodash';
import moment from 'moment';
import PieUacsCode from './Components/PieUacsCode';

const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        purchaseRequest: state.reports.purchaseRequest,
        tableFilter: state.reports.tableFilter,
        user_divisions: state.libraries.user_divisions,
        user_sections: state.libraries.user_sections,
        user: state.user.data,
    };
}

const Home = (
    {
        dispatch, 
        isInitialized,
        purchaseRequest,
        tableFilter,
        user_divisions,
        user_sections,
        user,
    }
) => {
    useEffect(() => {
        document.title = "Dashboard";
        if(isInitialized){
            if(isEmpty(purchaseRequest)){
                setTableFilter(user.user_offices?.data[0]?.office_id, "end_user_id")
                getPurchaseRequests({
                    end_user_id: user.user_offices?.data[0]?.office_id
                });
            }
        }
    }, [isInitialized]);
    

    const getPurchaseRequests = (initial = {}) => {
       let filter;
       if(isEmpty(initial)){
           filter = tableFilter;
        }else{
           filter = initial;
       }
       api.Report.purchaseRequest(filter)
       .then(res => {
           let results = res.data;
           //start of procurement types
           let accounts = cloneDeep(results.accounts.data);
           let uniqProcCategory = uniqBy(accounts, 'account_classification');
           let mappedUniqProcCategory = uniqProcCategory.map(i => {
                let categoryAccounts = accounts.filter(p => p.account_classification_id == i.account_classification_id);
                let category_percentage = categoryAccounts.reduce((sum, item) => {
                    return sum += item.account_percentage;
                }, 0);
                let category_total = categoryAccounts.reduce((sum, item) => {
                    return sum += item.sum_cost;
                }, 0);
                i.category_percentage = Math.round((category_percentage + Number.EPSILON) * 100) / 100;
                i.category_total = Math.round((category_total + Number.EPSILON) * 100) / 100;
                delete i.sum_cost;
                delete i.account_percentage;
                delete i.name;
                delete i.account_id;
                i.name = i.account_classification;
                delete i.account_classification;
               return i;
           });
           results.accounts = {
               data1: mappedUniqProcCategory,
               data2: results.accounts.data,
               start_day: results.accounts.start_day,
               end_day: results.accounts.end_day,
           };
           //end of procurement types

           let per_section = cloneDeep(results.per_section.data);
           let uniqProcPerDivision = uniqBy(per_section, 'division_id');
           let mappeduniqProcPerDivision = uniqProcPerDivision.map(i => {
                let perDivisionAccounts = per_section.filter(d=> d.division_id == i.division_id);
                let perDivisionApprovedTotal = perDivisionAccounts.reduce((sum, item) => {
                    return sum += item.approved;
                }, 0);
                let perDivisionPendingTotal = perDivisionAccounts.reduce((sum, item) => {
                    return sum += item.pending;
                }, 0);
                delete i.section_name;
                delete i.section_id;
                delete i.section_title;
                delete i.end_user_id;
                i.approved_total = Math.round((perDivisionApprovedTotal + Number.EPSILON) * 100) / 100;
                i.pending_total = Math.round((perDivisionPendingTotal + Number.EPSILON) * 100) / 100;
                return i;
            });
            results.per_section = {
                data1: mappeduniqProcPerDivision,
                data2: results.per_section.data,
                start_day: results.per_section.start_day,
                end_day: results.per_section.end_day,
            };
            // console.log(mappeduniqProcPerDivision);
           dispatch({
               type: "SET_REPORT_PURCHASE_REQUEST",
               data: results
           });
       })
       .catch(err => {})
       .then(res => {})
    }

    const setTableFilter = (e, name) => {
        let cloned = cloneDeep(tableFilter);
        cloned[name] = e;
        dispatch({
            type: "SET_REPORT_TABLE_FILTER",
            data: cloned
        });
    }

    return (
        <div style={style}>
             <Row gutter={[16, 16]} className="mb-3">
             <Col xs={24} sm={24} md={10} lg={10} xl={6}>
                    {/* <RangePicker renderExtraFooter={() => <ExtraDateRangeFooter />} /> */}
                    <RangePicker picker="month" style={{width: "100%"}} format={"MMMM YYYY"} onChange={(e) => {
                        let month = null;
                        if(e){
                            month = e.map(i => moment(i).format("YYYY-MM-DD"));
                        }
                        setTableFilter(month, "month");
                    }} value={tableFilter.month && tableFilter.month.map(i => moment(i, "YYYY-MM-DD"))} />
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={6}>

                    <Select
                        placeholder="Section/Unit/Office"
                        optionFilterProp="children"
                        showSearch
                        style={{width: "100%"}}
                        filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear
                        onClear={() => {
                            setTableFilter(null, "end_user_id")
                        }}
                        onSelect={(e) => {
                            setTableFilter(e, "end_user_id");
                        }}
                        value={tableFilter.end_user_id}
                    >
                        { user_divisions.map(division =>  {
                            return (
                                <OptGroup label={division.name}  key={division.id}>
                                    { user_sections?.filter(section => section.parent.name == division.name).map(section => {
                                        return <Option value={section.id} key={section.id}>{`${section.name} - ${section.title}`}</Option>
                                    }) }
                                </OptGroup>
                            );
                        }) }
                    </Select>
                </Col>
                <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    <Button type='primary' onClick={getPurchaseRequests}>View</Button>
                </Col>
             </Row>
             <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <ReportPurchaseRequest label="Total Approved Purchase Request" summaryData={purchaseRequest.approved_month} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <ReportPurchaseRequest label="Total Pending Purchase Request" summaryData={purchaseRequest.pending_month} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <ReportPurchaseRequest label="Yearly Approved Purchase Request" summaryData={purchaseRequest.approved_year} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <ReportPurchaseRequest label="Yearly Pending Purchase Request" summaryData={purchaseRequest.pending_year} />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <BarPurchaseRequest label="Yearly Purchase Request" yearlyData={purchaseRequest.yearly} />
                </Col>


                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <BarPurchaseRequestOffice />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    {/* <TopRequestedItems label="Most requested items" summaryData={purchaseRequest.most_quantity_items}/> */}
                    <PieUacsCode label="UACS Code" summaryData={purchaseRequest.uacs_codes} />
                </Col>


                {/* <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <TopRequestedItems label="Most requested items by quantity" summaryData={purchaseRequest.most_quantity_items}/>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <TopRequestedItems label="Most requested items by unit cost" summaryData={purchaseRequest.most_cost_items} />
                </Col> */}


                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <ReportAccount />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <PieModeOfProcurement label="Mode of Procurement" summaryData={purchaseRequest.mode_of_procurements} />
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

