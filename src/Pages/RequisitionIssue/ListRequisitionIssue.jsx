import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Skeleton, Button, Tabs, Card, Col, Row, Tooltip  } from 'antd';
import api from '../../api';
import Icon, {
    CloseOutlined,
} from '@ant-design/icons';
import { debounce, isEmpty } from 'lodash';
import AttachmentUpload from '../../Components/AttachmentUpload';
import AuditBatches from '../../Components/AuditBatches';
import MaximizeSvg from '../../Icons/MaximizeSvg';
import TableRequisitionIssue from './Components/TableRequisitionIssue';
import FormRouting from '../../Components/FormRouting';
import InfoRequisitionIssue from './Components/InfoRequisitionIssue';

const { TabPane } = Tabs;


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        selectedRequisitionIssue: state.requisitionIssues.list.selectedRequisitionIssue,
        requisitionIssues: state.requisitionIssues.list.requisitionIssues,
        paginationMeta: state.requisitionIssues.list.paginationMeta,
        loading: state.requisitionIssues.list.loading,
        timelines: state.requisitionIssues.list.timelines,
        logger: state.requisitionIssues.list.logger,
        tableFilter: state.requisitionIssues.list.tableFilter,
        defaultTableFilter: state.requisitionIssues.list.defaultTableFilter,
        tab: state.requisitionIssues.list.tab,
        user_sections: state.libraries.user_sections,
    };
}

const ListRequisitionIssue = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => {
            unmounted.current = true;
            // setRequisitionIssues([]);
        }
    }, []);
    useEffect(() => {
        document.title = "List of Requisition and Issue Plan";
        if(props.isInitialized){
            if(isEmpty(props.requisitionIssues)){
            }
            getRequisitionIssues();
        }
    }, [props.isInitialized]);
    
    
    const setTabKey = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_TAB",
            data: value,
        });
    }

    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_LOADING",
            data: value,
        });
    }
    const setRequisitionIssues = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_REQUISTION_ISSUES",
            data: value,
        });
    }
    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_PAGINATION_META",
            data: value,
        });
    }
    const setLogger = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_LOGGER",
            data: value,
        });
    }
    const setSelectedRequisitionIssue = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_SELECTED_REQUISITION_ISSUE",
            data: value
        });
    }

    const setTimelines = (value) => {
        props.dispatch({
            type: "SET_REQUISITION_ISSUE_LIST_TIMELINES",
            data: value
        });
    }
    
    const setTableFilter = (data) => {
        if(data == "reset"){
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
            getRequisitionIssues(props.defaultTableFilter);
        }else{
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_TABLE_FILTER",
                data: data,
            });
        }
    }

    const getRequisitionIssues = debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        setTableLoading(true);
        api.RequisitionIssue.all(filters)
        .then(res => {
            if (!unmounted.current) {
                setTableLoading(false);
                let data = res.data.data;
                let meta = res.data.meta;
                setRequisitionIssues(data);
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
    }, 250);
     
    const openInFull = () => {
        window.open(`${props.selectedRequisitionIssue.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }




    const openRequisitionIssue = async (item, index) => {
        setSelectedRequisitionIssue(item)
        setTimelines([]);
        setLogger([]);
        loadRequisitionIssueData(item.id);
        loadAuditTrail(item.id);
    }

    const loadRequisitionIssueData = async (id) => {
        await api.RequisitionIssue.get(id)
        .then(res => {
            if (unmounted.current) { return false; }
            let item = res.data;
            let form_routes = item.form_routes.data;
            setTimelines(form_routes);
            setSelectedRequisitionIssue(item)
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    const closeRequisitionIssue = () => {
        setSelectedRequisitionIssue({});
    }

    const loadAuditTrail = async (id) => {
        await api.RequisitionIssue.logger(id)
        .then(res => {
            if (unmounted.current) { return false; }
            setLogger(res.data.data);
        })
        .catch(res => {})
        .then(res => {})
    }

    const tableProps = {
        getRequisitionIssues: getRequisitionIssues,
        openRequisitionIssue: openRequisitionIssue,
        setTableFilter: setTableFilter,
        setSelectedRequisitionIssue: setSelectedRequisitionIssue,
        selectedRequisitionIssue: props.selectedRequisitionIssue,
        tableFilter: props.tableFilter,
        requisitionIssues: props.requisitionIssues,
        paginationMeta: props.paginationMeta,
        loading: props.loading,
        defaultTableFilter: props.defaultTableFilter,
        page: "list",
    };

    return (
        <div>

            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Created Requisition and Issue Slips" bordered={false}>
                        <div className='purchase-request-card-content'>
                            <TableRequisitionIssue {...tableProps} />
                        </div>
                    </Card>
                </Col>
                { isEmpty(props.selectedRequisitionIssue.file) ? "" : ( 
                    <Col md={24} lg={10} xl={8}>
                            <Card size="small" bordered={false} title="Requisition and Issue Slip Details" extra={(
                                <div className='text-right space-x-0.5'>
                                    <Tooltip placement="top" title={"Open in new window"}>
                                        <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                    </Tooltip>
                                    <Tooltip placement="top" title={"Close window"}>
                                        <Button size='small' type='danger' onClick={() => closeRequisitionIssue() }><CloseOutlined /></Button>
                                    </Tooltip>
                                </div>
                            )}
                            >
                                <div className='purchase-request-card-content'>
                                    <Tabs activeKey={props.tab} type="card" size="small" onChange={setTabKey}>
                                        <TabPane tab="Information" key="information">
                                            <InfoRequisitionIssue form={props.selectedRequisitionIssue} />
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
            { isEmpty(props.selectedRequisitionIssue) ? "" : (
            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={14} xl={16}>
                    <Card size="small" title="Requisition and Issue Slip" bordered={false} loading={props.formLoading}>
                        <div className='forms-card-form-content'>
                            <iframe src={`${props.selectedRequisitionIssue.file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                        </div>
                    </Card>
                </Col>
                <Col md={24} lg={10} xl={8}>
                        <Card size="small" title="Attachments" bordered={false} loading={props.formLoading}>
                            <div className='forms-card-form-content'>
                            <AttachmentUpload formId={props.selectedRequisitionIssue.id} formType="requisition_issue" fileList={props.selectedRequisitionIssue.form_uploads?.data} />
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
  )(ListRequisitionIssue);
