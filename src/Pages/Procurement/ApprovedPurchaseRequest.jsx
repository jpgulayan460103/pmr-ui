import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Pagination, Popover, Select, Button, List } from 'antd';
import filter from '../../Shared/filter';
import api from '../../api';
import _, { cloneDeep, debounce, isEmpty, map } from 'lodash';
import {
    SettingOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from '@ant-design/icons';


const { Option } = Select;

function mapStateToProps(state) {
    return {
        user_sections: state.library.user_sections,
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        columns: state.procurement.columns
    };
}

const Settings = ({columns, toggleColumn}) => {
    useEffect(() => {
        console.log("render");
    }, []);
    return (

        <List
            style={{height: 250, overflowY: "scroll"}}
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}
            size='small'
            bordered
            dataSource={columns.filter(i => i.filterable)}
            renderItem={(item, index) => (
            <List.Item actions={[
                <span key="custom-pointer" className='custom-pointer' onClick={() => { toggleColumn(index) }}>
                    { item.shown ? <EyeOutlined /> : <EyeInvisibleOutlined /> }
                </span>
            ]}>
                {item.title}
            </List.Item>
            )}
        />
    )
}

const ApprovedPurchaseRequest = (props) => {
    useEffect(() => {
        getPurchaseRequests();
        props.dispatch({
            type: "SET_PROCUREMENT_COLUMNS",
            data: columns.map(i => (
                {
                    'shown':i.shown,
                    'key': i.key,
                    'title': i.title,
                    'dataIndex': i.dataIndex,
                    'filterable': i.dataIndex,
                }
            ))
        })
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
    }

    const toggleColumn = (index) => {
        let prev = cloneDeep(props.columns);
        prev[index] = {
            ...prev[index],
            shown: !prev[index].shown,
        };
        props.dispatch({
            type: "SET_PROCUREMENT_COLUMNS",
            data: prev
        })
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
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'sa_or')[0].shown : true,
            filterable: true,
            ...filter.search('sa_or','text', setFilterData, filterData, getPurchaseRequests),
        },
        {
            title: 'PR Number',
            dataIndex: 'purchase_request_number',
            key: 'purchase_request_number',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_number')[0].shown : true,
            filterable: true,
            ...filter.search('purchase_request_number','text', setFilterData, filterData, getPurchaseRequests),
        },
        {
            title: 'Particulars',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purpose')[0].shown : true,
            filterable: true,
            ...filter.search('purpose','text', setFilterData, filterData, getPurchaseRequests),
        },
        {
            title: 'PMO/End-User',
            dataIndex: 'end_user_id',
            key: 'end_user_id',
            filters: endUserFilter,
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'end_user_id')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item.end_user.name }
                </span>
            ),
            ...filter.list('end_user_id','text', setFilterData, filterData, getPurchaseRequests),
        },
        {
            title: 'Type',
            key: 'purchase_request_type',
            dataIndex: 'purchase_request_type',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_type')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Mode of Procurement',
            key: 'mode_of_procurement',
            dataIndex: 'mode_of_procurement',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'mode_of_procurement')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Pre-Proc Conference',
            key: 'preproc_conference',
            dataIndex: 'preproc_conference',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'preproc_conference')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Ads/Post of IB',
            key: 'adspost_of_ib',
            dataIndex: 'adspost_of_ib',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'adspost_of_ib')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Pre-bid Conf',
            key: 'prebid_conf',
            dataIndex: 'prebid_conf',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'prebid_conf')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Eligibility Check',
            key: 'eligibility_check',
            dataIndex: 'eligibility_check',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'eligibility_check')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Sub/Open of Bids',
            key: 'subopen_of_bids',
            dataIndex: 'subopen_of_bids',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'subopen_of_bids')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Bid Evaluation',
            key: 'bid_evaluation',
            dataIndex: 'bid_evaluation',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'bid_evaluation')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Post Qual',
            key: 'post_qual',
            dataIndex: 'post_qual',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'post_qual')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Notice of Award',
            key: 'notice_of_award',
            dataIndex: 'notice_of_award',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'notice_of_award')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Contract Signing',
            key: 'contract_signing',
            dataIndex: 'contract_signing',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'contract_signing')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Notice to Proceed',
            key: 'notice_to_proceed',
            dataIndex: 'notice_to_proceed',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'notice_to_proceed')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Estimated LDD',
            key: 'estimated_ldd',
            dataIndex: 'estimated_ldd',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'estimated_ldd')[0].shown : true,
            filterable: true,
        },
        {
            title: 'Abstract of Quotations',
            key: 'abstract_of_quotations',
            dataIndex: 'abstract_of_quotations',
            width: 150,
            ellipsis: true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'abstract_of_quotations')[0].shown : true,
            filterable: true,
        },
        {
            title: "Actions",
            key: "action",
            fixed: 'right',
            width: 100,
            shown: true,
            filterable: false,
            render: (text, item, index) => (
                <Space  size={2}>
                    <span className='custom-pointer' onClick={() => { openPurchaseRequest(item, index) }}>View</span>
                </Space>
              )
        },
    ];

    return (
        <>
            <div className="flex justify-end mb-2">
            
            <Popover content={<Settings columns={props.columns} toggleColumn={toggleColumn} />} title="Column Settings" trigger="click" placement='bottomRight'>
                <SettingOutlined />
            </Popover>
            
            </div>
            <Table
                dataSource={dataSource}
                columns={columns.filter(i => i.shown == true)}
                size={"small"}
                loading={tableLoading}
                pagination={false}
                onChange={handleTableChange}
                scroll={{ y: "50vh" }}
                rowClassName={(record, index) => {
                    if(props.selectedPurchaseRequest?.id == record.id){
                        return "selected-row";
                    }
                }}
            />
            <div className="flex justify-end mt-2">
            <Pagination
                    current={paginationMeta.current_page}
                    total={paginationMeta.total}
                    pageSize={paginationMeta.per_page}
                    onChange={paginationChange}
                    showSizeChanger
                    showQuickJumper
                    size="small"
                />
            </div>
            
        </>
    );
}

export default connect(
    mapStateToProps,
)(ApprovedPurchaseRequest);

