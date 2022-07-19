import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Skeleton, Button, Tabs, Card, Col, Row, Tooltip  } from 'antd';
import api from '../../../api';
import Icon, {
    CloseOutlined,
} from '@ant-design/icons';
import { debounce, isEmpty } from 'lodash';
import AttachmentUpload from '../../../Components/AttachmentUpload';
import AuditBatches from '../../../Components/AuditBatches';
import TableProcurementPlan from './Components/TableProcurementPlan';
import InfoProcurementPlan from './Components/InfoProcurementPlan';
import FormRouting from '../../../Components/FormRouting';
import MaximizeSvg from '../../../Icons/MaximizeSvg';

const { TabPane } = Tabs;


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
        item_types: state.libraries.item_types,
    };
}



const ListProcurementPlan = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => {
            unmounted.current = true;
            // setProcurementPlans([]);
        }
    }, []);
    useEffect(() => {
        document.title = "List of Procurement Plan";
        if(props.isInitialized){
            if(isEmpty(props.procurementPlans)){
            }
            getProcurementPlans();
        }
    }, [props.isInitialized]);
    
    


    const setTabKey = (value) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_TAB",
            data: value,
        });
    }

    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_LIST_LOADING",
            data: value,
        });
    }
    const setProcurementPlans = (value) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_LIST_PURCHASE_REQUESTS",
            data: value,
        });
    }
    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_LIST_PAGINATION_META",
            data: value,
        });
    }
    const setSelectedProcurementPlan = (value) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_LIST_SELECTED_PURCHASE_REQUEST",
            data: value
        });
    }

    const getProcurementPlans = debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        setTableLoading(true);
        api.ProcurementPlan.all(filters)
        .then(res => {
            if (!unmounted.current) {
                setTableLoading(false);
                let data = res.data.data;
                let meta = res.data.meta;
                setProcurementPlans(data);
                setPaginationMeta(meta.pagination);
            }
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {
            setTableLoading(false);
        })
        ;
    }, 200);
     
    const openInFull = () => {
        window.open(`${props.selectedProcurementPlan.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }

    const closeProcurementPlan = () => {
        setSelectedProcurementPlan({});
    }


    


    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Created Project Procurement Management Plan" bordered={false}>
                        <TableProcurementPlan getProcurementPlans={getProcurementPlans} />
                    </Card>
                </Col>
                { isEmpty(props.selectedProcurementPlan.file) ? "" : ( 
                    <Col md={24} lg={10} xl={8}>
                            <Card size="small" bordered={false} title="Project Procurement Management Plan Details" extra={(
                                <div className='text-right space-x-0.5'>
                                    <Tooltip placement="top" title={"Open in new window"}>
                                        <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                    </Tooltip>
                                    <Tooltip placement="top" title={"Close window"}>
                                        <Button size='small' type='danger' onClick={() => closeProcurementPlan() }><CloseOutlined /></Button>
                                    </Tooltip>
                                </div>
                            )}
                            >
                                <div className='purchase-request-card-content'>
                                    <Tabs activeKey={props.tab} type="card" size="small" onChange={setTabKey}>
                                        <TabPane tab="Information" key="information">
                                            <InfoProcurementPlan form={props.selectedProcurementPlan} />
                                        </TabPane>
                                        <TabPane tab="Routing" key="routing">
                                            { !isEmpty(props.timelines) ? (
                                                <FormRouting timelines={props.timelines} />
                                            ) : <Skeleton active />  }
                                        </TabPane>
                                        <TabPane tab="Audit Trail" key="audit-trail" style={{padding: "5px", paddingBottom: "50px"}}>
                                            { !isEmpty(props.logger) ? (
                                                <AuditBatches logger={props.logger} />
                                            ) : <Skeleton active /> }
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Card>
                    </Col>
                    )
                }
            </Row>
            { isEmpty(props.selectedProcurementPlan) ? "" : (
            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Project Procurement Management Plan" bordered={false} loading={props.formLoading}>
                        <div className='forms-card-form-content'>
                            <iframe src={`${props.selectedProcurementPlan.file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                        </div>
                    </Card>
                </Col>
                <Col md={24} lg={10} xl={8}>
                        <Card size="small" title="Attachments" bordered={false} loading={props.formLoading}>
                            <div className='forms-card-form-content'>
                                <AttachmentUpload formId={props.selectedProcurementPlan.id} formType="procurement_plan" fileList={props.selectedProcurementPlan.form_uploads?.data} />
                            </div>
                        </Card>
                    </Col>
            </Row>
            ) }
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ListProcurementPlan);
