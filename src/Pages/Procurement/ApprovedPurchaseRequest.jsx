import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table  } from 'antd';
import filter from '../../Shared/filter';
import api from '../../api';
import { debounce } from 'lodash';

function mapStateToProps(state) {
    return {
        user_sections: state.library.user_sections
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
    const dataSource = purchaseRequests
    const endUserFilter = props.user_sections.map(i => {
        i.value = i.id;
        return i;
    });
      
    const columns = [
        {
            title: 'SA/OR',
            dataIndex: 'sa_or',
            key: 'sa_or',
            ...filter.search('sa_or','text', setFilterData, filterData, getPurchaseRequests),
        },
        {
            title: 'PR Number',
            dataIndex: 'purchase_request_number',
            key: 'purchase_request_number',
            ...filter.search('purchase_request_number','text', setFilterData, filterData, getPurchaseRequests),
        },
        {
            title: 'Particulars',
            dataIndex: 'purpose',
            key: 'purpose',
            ...filter.search('purpose','text', setFilterData, filterData, getPurchaseRequests),
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
        },
        {
            title: 'Status',
            key: 'status',
            render: (text, item, index) => (
                <span>
                    { item.status }
                </span>
            ),
            filters: [
                { text: 'Approved', value: "Approved" },
                { text: 'Pending', value: "Pending" },
            ],
            ...filter.list('status','text', setFilterData, filterData, getPurchaseRequests),
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
            />
        </>
    );
}

export default connect(
    mapStateToProps,
)(ApprovedPurchaseRequest);

