import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Pagination,
    Popover,
    Select,
    List,
    Menu,
    Dropdown,
    Tooltip,
} from 'antd';
import filter from '../../Shared/filter';
import _, { cloneDeep, debounce, isEmpty, map } from 'lodash';
import {
    SettingOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MoreOutlined,
    EllipsisOutlined,
    FormOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import api from '../../api';


const { Option } = Select;

function mapStateToProps(state) {
    return {
        user_sections: state.library.user_sections,
        procurement_types: state.library.procurement_types,
        mode_of_procurements: state.library.mode_of_procurements,
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        columns: state.procurement.columns,
        purchaseRequests: state.procurement.purchaseRequests,
        purchaseRequestsPagination: state.procurement.purchaseRequestsPagination,
        filterData: state.procurement.purchaseRequestsTableFilter,
        tableLoading: state.procurement.purchaseRequestsTableLoading,
        isInitialized: state.user.isInitialized,
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
                <span key="custom-pointer" className='custom-pointer' onClick={() => { toggleColumn(index, 'shown') }}>
                    { item.shown ? <EyeOutlined /> : <EyeInvisibleOutlined /> }
                </span>,
                <span key="custom-pointer" className='custom-pointer' onClick={() => { toggleColumn(index, 'ellipsis') }}>
                { item.ellipsis ? <EllipsisOutlined /> : <MoreOutlined /> }
            </span>
            ]}>
                {item.title}
            </List.Item>
            )}
        />
    )
}

const ApprovedPurchaseRequest = (props) => {
    let navigate = useNavigate();

    useEffect(() => {
        if(props.isInitialized){
            if(isEmpty(props.purchaseRequests)){
                props.getPurchaseRequests();
            }
            props.dispatch({
                type: "SET_PROCUREMENT_COLUMNS",
                data: columns.map(i => (
                    {
                        'key': i.key,
                        'title': i.title,
                        'shown':i.shown,
                        'filterable': i.filterable,
                        'ellipsis': i.ellipsis,
                    }
                ))
            })
        }
    }, [props.isInitialized]);
    const setFilterData = (data) => {
        props.dispatch({
            type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS_TABLE_FILTER",
            data: {...props.filterData, ...data()}
        });
    }

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(sorter);
        console.log(filters);
        props.getPurchaseRequests({...props.filterData, ...filters})
    };



    const paginationChange = async (e) => {
        setFilterData(prev => ({...prev, page: e}));
        props.getPurchaseRequests({...props.filterData, page: e})
    }

    const changePageSize = (page, size) => {
        setFilterData(prev => ({...prev, page: page, size: size}));
        props.getPurchaseRequests({...props.filterData, page: page, size: size})
    }

    const viewPurchaseRequest = (item, index) => {
        selectPurchaseRequest(item)
        props.dispatch({
            type: "SET_PROCUREMENT_SET_PURCHASE_REQUEST_TAB",
            data: "pdf"
        });
    }
    const selectPurchaseRequest = (item) => {
        props.dispatch({
            type: "SELECT_PURCHASE_REQUEST",
            data: item
        });
    }

    const editPurchaseRequest = (item, index) => {
        selectPurchaseRequest(item);
        props.dispatch({
            type: "SET_PROCUREMENT_SET_PURCHASE_REQUEST_TAB",
            data: "edit-form"
        });
    }

    const makeQuotation = (item, index) => {
        api.PurchaseRequest.get(item.id)
        .then(res => {
            selectPurchaseRequest(res.data);
            navigate("/procurement/quotations");
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const toggleColumn = (index, prop) => {
        let prev = cloneDeep(props.columns);
        prev[index] = {
            ...prev[index],
            [prop]: !prev[index][prop],
        };
        props.dispatch({
            type: "SET_PROCUREMENT_COLUMNS",
            data: prev
        })
    }
    const endUserFilter = cloneDeep(props.user_sections).map(i => {
        i.value = i.id;
        return i;
    });

    const purchaseRequestTypeFilter = cloneDeep(props.procurement_types).map(i => {
        i.value = i.id;
        return i;
    });

    const modeOfProcurementFilter = cloneDeep(props.mode_of_procurements).map(i => {
        i.value = i.id;
        return i;
    });
    
    const dataSource = props.purchaseRequests

    const columns = [
        {
            title: 'PR Date',
            dataIndex: 'pr_date',
            key: 'pr_date',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'pr_date')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'pr_date')[0].shown : true,
            filterable: true,
            ...filter.search('pr_date','date_range', setFilterData, props.filterData, props.getPurchaseRequests),
        },
        {
            title: 'SA/OR',
            dataIndex: 'sa_or',
            key: 'sa_or',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'sa_or')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'sa_or')[0].shown : true,
            filterable: true,
            ...filter.search('sa_or','text', setFilterData, props.filterData, props.getPurchaseRequests),
        },
        {
            title: 'PR Number',
            dataIndex: 'purchase_request_number',
            key: 'purchase_request_number',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_number')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_number')[0].shown : true,
            filterable: true,
            ...filter.search('purchase_request_number','text', setFilterData, props.filterData, props.getPurchaseRequests),
        },
        {
            title: 'Particulars',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purpose')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purpose')[0].shown : true,
            filterable: true,
            ...filter.search('purpose','text', setFilterData, props.filterData, props.getPurchaseRequests),
        },
        {
            title: 'PMO/End-User',
            dataIndex: 'end_user_id',
            key: 'end_user_id',
            filters: endUserFilter,
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'end_user_id')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'end_user_id')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item.end_user.name }
                </span>
            ),
            ...filter.list('end_user_id','text', setFilterData, props.filterData, props.getPurchaseRequests),
        },
        {
            title: 'Total Cost',
            key: 'total_cost',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'total_cost')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'total_cost')[0].shown : true,
            ...filter.search('total_cost','number', setFilterData, props.filterData, props.getPurchaseRequests),
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item.total_cost_formatted }
                </span>
            ),
            
        },
        {
            title: 'Type',
            key: 'purchase_request_type_id',
            filters: purchaseRequestTypeFilter,
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_type_id')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_type_id')[0].shown : true,
            filterable: true,
            ...filter.list('purchase_request_type_id','text', setFilterData, props.filterData, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    { item?.purchase_request_type?.name }
                </span>
            ),
        },
        {
            title: 'Mode of Procurement',
            key: 'mode_of_procurement_id',
            filters: modeOfProcurementFilter,
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'mode_of_procurement_id')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'mode_of_procurement_id')[0].shown : true,
            filterable: true,
            ...filter.list('mode_of_procurement_id','text', setFilterData, props.filterData, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    { item?.mode_of_procurement?.name }
                </span>
            )
        },
        {
            title: 'Pre-Proc Conference',
            key: 'preproc_conference',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'preproc_conference')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'preproc_conference')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.preproc_conference }
                </span>
            ),
        },
        {
            title: 'Ads/Post of IB',
            key: 'adspost_of_ib',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'adspost_of_ib')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'adspost_of_ib')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.adspost_of_ib }
                </span>
            ),
        },
        {
            title: 'Pre-bid Conf',
            key: 'prebid_conf',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'prebid_conf')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'prebid_conf')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.prebid_conf }
                </span>
            ),
        },
        {
            title: 'Eligibility Check',
            key: 'eligibility_check',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'eligibility_check')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'eligibility_check')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.eligibility_check }
                </span>
            ),
        },
        {
            title: 'Sub/Open of Bids',
            key: 'subopen_of_bids',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'subopen_of_bids')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'subopen_of_bids')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.subopen_of_bids }
                </span>
            ),
        },
        {
            title: 'Bid Evaluation',
            key: 'bid_evaluation',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'bid_evaluation')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'bid_evaluation')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.bid_evaluation }
                </span>
            ),
        },
        {
            title: 'Post Qual',
            key: 'post_qual',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'post_qual')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'post_qual')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.post_qual }
                </span>
            ),
        },
        {
            title: 'Notice of Award',
            key: 'notice_of_award',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'notice_of_award')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'notice_of_award')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.notice_of_award }
                </span>
            ),
        },
        {
            title: 'Contract Signing',
            key: 'contract_signing',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'contract_signing')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'contract_signing')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.contract_signing }
                </span>
            ),
        },
        {
            title: 'Notice to Proceed',
            key: 'notice_to_proceed',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'notice_to_proceed')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'notice_to_proceed')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.notice_to_proceed }
                </span>
            ),
        },
        {
            title: 'Estimated LDD',
            key: 'estimated_ldd',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'estimated_ldd')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'estimated_ldd')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.estimated_ldd }
                </span>
            ),
        },
        {
            title: 'Abstract of Quotations',
            key: 'abstract_of_quotations',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'abstract_of_quotations')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'abstract_of_quotations')[0].shown : true,
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item?.bac_task?.abstract_of_quotations }
                </span>
            ),
        },
        {
            title: "Action",
            key: "action",
            fixed: 'right',
            width: 60,
            shown: true,
            align: "center",
            filterable: false,
            render: (text, item, index) => (
                <Dropdown overlay={menu(item, index)} trigger={['click']}>
                    <EllipsisOutlined style={{ fontSize: '24px' }} />
                </Dropdown>
              )
        },
    ];

    const menu = (item, index) => (
        <Menu onClick={() => handleMenuClick()}>
            <Menu.Item key="menu-view" icon={<FormOutlined />}  onClick={() => { viewPurchaseRequest(item, index) }}>
                View
            </Menu.Item>
            <Menu.Item key="menu-bac-task" icon={<MessageOutlined />} onClick={() => { viewBacForm(item, index) }}>
                BAC Data
            </Menu.Item>
            <Menu.Item key="menu-quotation" icon={<MessageOutlined />} onClick={() => { makeQuotation(item, index) }}>
                Make Quotation
            </Menu.Item>
        </Menu>
      );

    const handleMenuClick =() => {

    }
    
    const viewBacForm = (item, index) => {
        selectPurchaseRequest(item)
        props.dispatch({
            type: "SET_PROCUREMENT_SET_PURCHASE_REQUEST_TAB",
            data: "bac-task"
        });
    }




    return (
        <>
            <div className="flex justify-end mb-2">
            
            <Popover content={<Settings columns={props.columns} toggleColumn={toggleColumn} />} title="Column Settings" trigger="click" placement='bottomRight'>
                <Tooltip placement="left" title="Settings">
                    <SettingOutlined />
                </Tooltip>
            </Popover>
            
            </div>
            <Table
                dataSource={dataSource}
                columns={columns.filter(i => i.shown == true)}
                size={"small"}
                loading={{spinning: props.tableLoading, tip: "Loading..."}}
                pagination={false}
                onChange={handleTableChange}
                scroll={{ y: "45vh" }}
                rowClassName={(record, index) => {
                    if(props.selectedPurchaseRequest?.id == record.id){
                        return "selected-row";
                    }
                }}
            />
            <div className="flex justify-end mt-2">
            {/* <b>{process.env.REACT_APP_PRODUCTION_URL}</b> */}
            <Pagination
                    current={props.purchaseRequestsPagination?.current_page || 1}
                    total={props.purchaseRequestsPagination?.total || 1}
                    pageSize={props.purchaseRequestsPagination?.per_page || 1}
                    onChange={paginationChange}
                    // showSizeChanger
                    showQuickJumper
                    size="small"
                    onShowSizeChange={(current, size) => changePageSize(current, size)}
                />
            </div>
        </>
    );
}

export default connect(
    mapStateToProps,
)(ApprovedPurchaseRequest);

