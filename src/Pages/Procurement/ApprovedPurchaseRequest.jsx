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
    Button,
    Upload,
    message,
    Modal,
} from 'antd';
import filter from '../../Utilities/filter';
import _, { cloneDeep, debounce, isEmpty, map } from 'lodash';
import {
    SettingOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MoreOutlined,
    EllipsisOutlined,
    UploadOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
import api from '../../api';


const { Option } = Select;

function mapStateToProps(state) {
    return {
        user_sections: state.library.user_sections,
        procurement_type_categories: state.library.procurement_type_categories,
        mode_of_procurements: state.library.mode_of_procurements,
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        columns: state.procurement.columns,
        purchaseRequests: state.procurement.purchaseRequests,
        purchaseRequestsPagination: state.procurement.purchaseRequestsPagination,
        filterData: state.procurement.purchaseRequestsTableFilter,
        tableLoading: state.procurement.purchaseRequestsTableLoading,
        isInitialized: state.user.isInitialized,
        uploadingFiles: state.user.uploadingFiles,
    };
}

const Settings = ({columns, toggleColumn}) => {
    return (
        <List
            style={{height: 250, overflowY: "scroll"}}
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
    let history = useHistory();

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
        // console.log(sorter);
        // console.log(filters);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            props.dispatch({
                type: "SET_PROCUREMENT_SET_PURCHASE_REQUESTS_TABLE_FILTER",
                data: {...props.filterData, sortColumn: filters.sortColumn, sortOrder: filters.sortOrder}
            });
        }
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

    const viewPurchaseRequest = async (item, index) => {
        if(props.uploadingFiles){
            Modal.warning({
                title: "Uploading your files",
                content: "Please wait for the system to finish uploading.",
            });
        }else{
            props.dispatch({
                type: "SELECT_PURCHASE_REQUEST",
                data: item
            });
            await selectPurchaseRequest(item)
        }
    }
    const selectPurchaseRequest = async (item) => {
        await api.PurchaseRequest.get(item.id)
        .then(res => {
            let purchase_request = res.data;
            api.PurchaseRequest.logger(item.id)
            .then(res => {
                props.dispatch({
                    type: "SELECT_PURCHASE_REQUEST",
                    data: {...purchase_request, audit_trail: res.data }
                });
            })
            .catch(res => {})
            .then(res => {})
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const makeQuotation = (item, index) => {
        api.PurchaseRequest.get(item.id)
        .then(res => {
            selectPurchaseRequest(res.data);
            history.push("/procurement/quotations");
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

    const purchaseRequestTypeCategoryFilter = cloneDeep(props.procurement_type_categories).map(i => {
        i.value = i.id;
        return i;
    });

    const purchaseRequestTypeFilter = () => {
        let filteredCategory = cloneDeep(props.procurement_type_categories);
        if(!isEmpty(props.filterData.purchase_request_type_category)){
            filteredCategory = filteredCategory.filter(i => props.filterData.purchase_request_type_category.includes(i.id));
        }
        return filteredCategory.map(i => {
            let newI = [];
            for (let index = 0; index < i.children.data.length; index++) {
                let element = i.children.data[index];
                newI.push({
                    id: element.id,
                    key: element.key,
                    library_type: element.library_type,
                    name: element.name,
                    text: `${element.parent.name} - ${element.text}`,
                    title: element.title,
                    value: element.id,
                });
            }
            return newI;
        }).flat(1);
    };

    const modeOfProcurementFilter = cloneDeep(props.mode_of_procurements).map(i => {
        i.value = i.id;
        return i;
    });


    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    if(isEmpty(props.selectedPurchaseRequest)){
                        viewPurchaseRequest(record, colIndex);
                    }else{
                        if(props.selectedPurchaseRequest.id != record.id){
                            viewPurchaseRequest(record, colIndex);
                        }
                    }
                },
            };
          }
    }
    
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
            ...onCell,
            sorter: (a, b) => {},
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
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'PR Number',
            dataIndex: 'purchase_request_number',
            key: 'purchase_request_number',
            width: 200,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_number')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_number')[0].shown : true,
            filterable: true,
            ...filter.search('purchase_request_number','text', setFilterData, props.filterData, props.getPurchaseRequests),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'title')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'title')[0].shown : true,
            filterable: true,
            ...filter.search('title','text', setFilterData, props.filterData, props.getPurchaseRequests),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purpose')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purpose')[0].shown : true,
            filterable: true,
            ...filter.search('purpose','text', setFilterData, props.filterData, props.getPurchaseRequests),
            ...onCell,
            sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
        },
        {
            title: 'Total Cost',
            key: 'total_cost',
            width: 150,
            align: "right",
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'total_cost')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'total_cost')[0].shown : true,
            // ...filter.search('total_cost','number', setFilterData, props.filterData, props.getPurchaseRequests),
            filterable: true,
            render: (text, item, index) => (
                <span>
                    { item.total_cost_formatted }
                </span>
            ),
            ...onCell,
            sorter: (a, b) => {},
            
        },
        {
            title: 'Category',
            key: 'purchase_request_type_category',
            filters: purchaseRequestTypeCategoryFilter,
            width: 150,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_type_category')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'purchase_request_type_category')[0].shown : true,
            filterable: true,
            ...filter.list('purchase_request_type_category','text', setFilterData, props.filterData, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    {item?.procurement_type?.parent?.name}
                </span>
            ),
            ...onCell,
            // sorter: (a, b) => {},
        },
        {
            title: 'Type',
            key: 'procurement_type_id',
            filters: purchaseRequestTypeFilter(),
            width: 200,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'procurement_type_id')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'procurement_type_id')[0].shown : true,
            filterable: true,
            ...filter.list('procurement_type_id','text', setFilterData, props.filterData, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    { item?.procurement_type?.name }
                </span>
            ),
            ...onCell,
            // sorter: (a, b) => {},
        },
        {
            title: 'Mode of Procurement',
            key: 'mode_of_procurement_id',
            filters: modeOfProcurementFilter,
            width: 250,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'mode_of_procurement_id')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'mode_of_procurement_id')[0].shown : true,
            filterable: true,
            ...filter.list('mode_of_procurement_id','text', setFilterData, props.filterData, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    { item?.mode_of_procurement?.name }
                </span>
            ),
            ...onCell,
            // sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
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
            // ...onCell,
            // sorter: (a, b) => {},
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
            // ...onCell,
            // sorter: (a, b) => {},
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
            // ...onCell,
            // sorter: (a, b) => {},
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
            // ...onCell,
            // sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
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
            ...onCell,
            // sorter: (a, b) => {},
        },
        {
            title: "Action",
            key: "action",
            fixed: 'right',
            width: 60,
            shown: true,
            align: "center",
            filterable: false,
            render: (text, item, index) => {
                if(props.uploadingFiles){
                    return (
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    )
                }
                return(
                    <Dropdown overlay={menu(item, index)} trigger={['click']}>
                        <Button size='small'>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        },
    ];

    const menu = (item, index) => (
        <Menu onClick={() => handleMenuClick()}>
            <Menu.Item key="menu-bac-task" icon={<MessageOutlined />} onClick={() => { viewBacForm(item, index) }}>
                BAC Data
            </Menu.Item>
            <Menu.Item key="menu-quotation" icon={<MessageOutlined />} onClick={() => { makeQuotation(item, index) }}>
                Make Quotation
            </Menu.Item>
        </Menu>
    );


    let token = JSON.parse(sessionStorage.getItem("session"));
    let access_token = token.access_token;
    // customAxios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    const uploadProps = {
        name: 'file',
        action: 'http://pmr-api.test/api/forms/uploads/purchase-request',
        headers: {
          authorization: `Bearer ${access_token}`,
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };

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
            <Pagination
                    current={props.purchaseRequestsPagination?.current_page || 1}
                    total={props.purchaseRequestsPagination?.total || 1}
                    pageSize={props.purchaseRequestsPagination?.per_page || 1}
                    onChange={paginationChange}
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

