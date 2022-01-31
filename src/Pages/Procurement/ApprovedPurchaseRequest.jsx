import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Pagination, Popover, Select, Button, List } from 'antd';
import filter from '../../Shared/filter';
import api from '../../api';
import _, { cloneDeep, debounce, map } from 'lodash';
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
        setColumns([
            {
                title: 'SA/OR',
                dataIndex: 'sa_or',
                key: 'sa_or',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
                ...filter.search('sa_or','text', setFilterData, filterData, getPurchaseRequests),
            },
            {
                title: 'PR Number',
                dataIndex: 'purchase_request_number',
                key: 'purchase_request_number',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
                ...filter.search('purchase_request_number','text', setFilterData, filterData, getPurchaseRequests),
            },
            {
                title: 'Particulars',
                dataIndex: 'purpose',
                key: 'purpose',
                width: 150,
                ellipsis: true,
                shown: true,
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
                shown: true,
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
                shown: true,
                filterable: true,
            },
            {
                title: 'Mode of Procurement',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Pre-Proc Conference',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Ads/Post of IB',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Pre-bid Conf',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Eligibility Check',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Sub/Open of Bids',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Bid Evaluation',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Post Qual',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Notice of Award',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Contract Signing',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Notice to Proceed',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Estimated LDD',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
                filterable: true,
            },
            {
                title: 'Abstract of Quotations',
                key: 'mode_of_procurement',
                dataIndex: 'mode_of_procurement',
                width: 150,
                ellipsis: true,
                shown: true,
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
        ]);
    }, []);
    const [filterData, setFilterData] = useState({
        page: 1,
        type: 'all'
    });
    const [purchaseRequestOutput, setPurchaseRequestOutput] = useState("");
    const [tableLoading, setTableLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [columns, setColumns] = useState([]);
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
            let repeat = [];
            for (let index = 0; index < 120; index += 2) {
                repeat.push({
                    ...data[0],
                    key:index
                });
                repeat.push({
                    ...data[0],
                    key:index+1
                });
            }
            // console.log(data);
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
        let prev = cloneDeep(columns);
        prev[index] = {
            ...prev[index],
            shown: !prev[index].shown,
        };
        setColumns(prev);
    }
    const endUserFilter = props.user_sections.map(i => {
        i.value = i.id;
        return i;
    });
    
    const dataSource = purchaseRequests

    
    return (
        <>
            <div className="flex justify-end mb-2">
            
            <Popover content={<Settings columns={columns} toggleColumn={toggleColumn} />} title="Column Settings" trigger="click" placement='bottomRight'>
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
                // bordered={true}
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

