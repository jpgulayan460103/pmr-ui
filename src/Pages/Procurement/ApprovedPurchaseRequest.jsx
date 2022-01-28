import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Pagination  } from 'antd';
import filter from '../../Shared/filter';
import api from '../../api';
import { debounce } from 'lodash';

function mapStateToProps(state) {
    return {
        user_sections: state.library.user_sections,
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest
    };
}
const ApprovedPurchaseRequest = (props) => {
    useEffect(() => {
        getPurchaseRequests();
    }, []);
    const [filterData, setFilterData] = useState({
        page: 1,
        type: 'all'
    });
    const [purchaseRequestOutput, setPurchaseRequestOutput] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState({
        current_page: 1,
        total: 1,
        per_page: 1,
    });

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(sorter);
        console.log(filters);
        getPurchaseRequests({...filterData, ...filters})
    };

    const getPurchaseRequests = debounce((filters) => {
        if(filters == null){
            filters = filterData
        }
        setTableLoading(true);
        api.PurchaseRequest.all(filters)
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
        .then(res => {})
        ;
    }, 200);

    const paginationChange = async (e) => {
        setFilterData(prev => ({...prev, page: e}));
        getPurchaseRequests({...filterData, page: e})
    }
    const openPurchaseRequest = (item, index) => {
        setSelectedItem(item);
        props.dispatch({
            type: "SELECT_PURCHASE_REQUEST",
            data: item
        });
        // setPurchaseRequestOutput(item.file);
    }
    const endUserFilter = props.user_sections.map(i => {
        i.value = i.id;
        return i;
    });
    
    const dataSource = purchaseRequests
    const columns = [
        {
            title: 'SA/OR',
            dataIndex: 'sa_or',
            key: 'sa_or',
            ...filter.search('sa_or','text', setFilterData, filterData, getPurchaseRequests),
            width: 150,
            ellipsis: true,
        },
        {
            title: 'PR Number',
            dataIndex: 'purchase_request_number',
            key: 'purchase_request_number',
            ...filter.search('purchase_request_number','text', setFilterData, filterData, getPurchaseRequests),
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Particulars',
            dataIndex: 'purpose',
            key: 'purpose',
            ...filter.search('purpose','text', setFilterData, filterData, getPurchaseRequests),
            width: 150,
            ellipsis: true,
        },
        {
            title: 'PMO/End-User',
            dataIndex: 'end_user_id',
            key: 'end_user_id',
            filters: endUserFilter,
            render: (text, item, index) => (
                <span>
                    { item.end_user.name }
                </span>
            ),
            ...filter.list('end_user_id','text', setFilterData, filterData, getPurchaseRequests),
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Type',
            key: 'purchase_request_type',
            dataIndex: 'purchase_request_type',
            width: 150,
        },
        {
            title: 'Mode of Procurement',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Pre-Proc Conference',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Ads/Post of IB',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Pre-bid Conf',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Eligibility Check',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Sub/Open of Bids',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Bid Evaluation',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Post Qual',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Notice of Award',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Contract Signing',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Notice to Proceed',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Estimated LDD',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: 'Abstract of Quotations',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
        },
        {
            title: "Actions",
            key: "action",
            fixed: 'right',
            width: 100,
            render: (text, item, index) => (
                <Space  size={2}>
                    <span className='custom-pointer' onClick={() => { openPurchaseRequest(item, index) }}>View</span>
                </Space>
              )
        },
    ];
    return (
        <>
            <Table
                dataSource={dataSource}
                columns={columns}
                size={"small"}
                loading={tableLoading}
                pagination={false}
                onChange={handleTableChange}
                scroll={{ y: "32vh" }}
                bordered={true}
                rowClassName={(record, index) => {
                    if(props.selectedPurchaseRequest?.id == record.id){
                        return "selected-row";
                    }
                }}
            />
            <Pagination
                current={paginationMeta.current_page}
                total={paginationMeta.total}
                pageSize={paginationMeta.per_page}
                className='mt-2'
                onChange={paginationChange}
            />
        </>
    );
}

export default connect(
    mapStateToProps,
)(ApprovedPurchaseRequest);

