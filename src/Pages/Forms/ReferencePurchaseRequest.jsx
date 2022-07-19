import { Card, Col, Row } from 'antd';
import { cloneDeep, debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import api from '../../api';
import TablePurchaseRequest from '../PurchaseRequest/Components/TablePurchaseRequest';


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        user: state.user.data,
        purchaseRequests: state.forms.allForm.purchaseRequests,
        paginationMeta: state.forms.allForm.purchaseRequestPagination,
        loading: state.forms.allForm.loading,
    };
}


function ReferencePurchaseRequest(props) {

    useEffect(() => {
        getPurchaseRequests();
    }, []);

    const defaultTableFilter = {
        page: 1,
        status: ['Approved']
    }

    const [tableFilter, setTableFilter] = useState(defaultTableFilter);

    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_FORM_ALL_FORM_LOADING",
            data: value,
        });
    }
    const setPurchaseRequests = (value) => {
        props.dispatch({
            type: "SET_FORM_ALL_FORM_PURCHASE_REQUESTS",
            data: value,
        });
    }

    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_FORM_ALL_FORM_PURCHASE_REQUEST_PAGINATION",
            data: value,
        });
    }
    
    
    const getPurchaseRequests = debounce((filters) => {
        if(filters == null){
            filters = tableFilter
        }
        setTableLoading(true);
        api.Forms.getPurchaseRequests(filters)
        .then(res => {
            setTableLoading(false);
            let data = res.data.data;
            let meta = res.data.meta;
            setPurchaseRequests(data);
            setPaginationMeta(meta.pagination);
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {
            setTableLoading(false);
        })
        ;
    }, 200);

    const setSelectedPurchaseRequest = (record) => {
        console.log(record);
    }

    const setTableFilters = (data) => {
        if(data == "reset"){
            setTableFilter(defaultTableFilter);
            getPurchaseRequests(props.defaultTableFilter);
        }else{
            setTableFilter(data);
        }
    }

    const tableProps = {
        getPurchaseRequests: getPurchaseRequests,
        openPurchaseRequest: () => {},
        setTableFilter: setTableFilters,
        setSelectedPurchaseRequest: setSelectedPurchaseRequest,
        tableFilter: tableFilter,
        purchaseRequests: props.purchaseRequests,
        paginationMeta: props.paginationMeta,
        loading: props.loading,
        defaultTableFilter,
    };

    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <Card size="small" title="All Puchase Requests" bordered={false}>
                        <div className='purchase-request-card-content'>
                            <TablePurchaseRequest {...tableProps} />
                        </div>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card size="small" bordered={false} title="Puchase Request Details">
                        <div className='purchase-request-card-content'>

                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ReferencePurchaseRequest);
