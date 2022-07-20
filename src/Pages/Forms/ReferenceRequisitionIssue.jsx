import { Card, Col, Row } from 'antd';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import api from '../../api';
import TableRequisitionIssue from '../RequisitionIssue/Components/TableRequisitionIssue';


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        user: state.user.data,
        requisitionIssues: state.forms.allForm.requisitionIssues,
        paginationMeta: state.forms.allForm.requisitionIssuePagination,
        loading: state.forms.allForm.loading,
    };
}


function ReferenceRequisitionIssue(props) {
    useEffect(() => {
        document.title = "List all of Requisition and Issue Slips";
        if(props.isInitialized){
            if(isEmpty(props.requisitionIssues)){
                getRequisitionIssues();
            }
        }
    }, [props.isInitialized]);
    const [form, setForm] = useState({});

    const defaultTableFilter = {
        page: 1,
        status: ['Issued', 'Approved']
    }

    const [tableFilter, setTableFilter] = useState(defaultTableFilter);

    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_FORM_ALL_FORM_LOADING",
            data: value,
        });
    }
    const setRequisitionIssues = (value) => {
        props.dispatch({
            type: "SET_FORM_ALL_FORM_REQUISITION_ISSUES",
            data: value,
        });
    }

    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_FORM_ALL_FORM_REQUISITION_ISSUE_PAGINATION",
            data: value,
        });
    }
    
    
    const getRequisitionIssues = debounce((filters) => {
        if(filters == null){
            filters = tableFilter
        }
        setTableLoading(true);
        api.Forms.getRequisitionIssues(filters)
        .then(res => {
            setTableLoading(false);
            let data = res.data.data;
            let meta = res.data.meta;
            setRequisitionIssues(data);
            setPaginationMeta(meta.pagination);
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {
            setTableLoading(false);
        })
        ;
    }, 250);

    const setSelectedRequisitionIssue = (record) => {
        setForm(record);
    }

    const setTableFilters = (data) => {
        if(data == "reset"){
            setTableFilter(defaultTableFilter);
            getRequisitionIssues(props.defaultTableFilter);
        }else{
            setTableFilter(data);
        }
    }

    const tableProps = {
        getRequisitionIssues: getRequisitionIssues,
        openRequisitionIssue: () => {},
        setTableFilter: setTableFilters,
        setSelectedRequisitionIssue: setSelectedRequisitionIssue,
        tableFilter: tableFilter,
        selectedRequisitionIssue: form,
        requisitionIssues: props.requisitionIssues,
        paginationMeta: props.paginationMeta,
        loading: props.loading,
        defaultTableFilter,
        page: "reference",
    };

    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <Card size="small" title="All Requisition and Issue Slips" bordered={false}>
                        <div className='purchase-request-card-content'>
                            <TableRequisitionIssue {...tableProps} />
                        </div>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card size="small" bordered={false} title="Requisition and Issue Slip Details">
                        <div className='forms-card-form-content'>
                            { form.file && (
                                <iframe src={`${form.file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ReferenceRequisitionIssue);
