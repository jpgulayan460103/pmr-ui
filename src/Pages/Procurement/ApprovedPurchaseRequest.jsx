import React, { useEffect, useState } from 'react';
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
    Form,
} from 'antd';
import filter from '../../Utilities/filter';
import _, { cloneDeep, debounce, isEmpty, map } from 'lodash';
import Icon, {
    SettingOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MoreOutlined,
    EllipsisOutlined,
    ReloadOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
import api from '../../api';
import helpers from '../../Utilities/helpers';


const ReloadSvg = () => (
    <svg t="1647230035510" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2175" width="1em" height="1em"><path d="M257.6 462.4c28.8 1.6 43.2-11.2 43.2-36.8 0-25.6-17.6-43.2-43.2-43.2H150.4C201.6 208 358.4 84.8 542.4 84.8c187.2 0 348.8 128 395.2 310.4 4.8 20.8 30.4 38.4 51.2 30.4 20.8-4.8 38.4-30.4 30.4-51.2C958.4 153.6 763.2 0 537.6 0 337.6 0 163.2 123.2 80 305.6v-92.8c0-22.4-9.6-43.2-35.2-43.2S1.6 187.2 0 212.8v200c1.6 30.4 25.6 51.2 57.6 49.6h200zM966.4 590.4H779.2c-12.8 0-27.2 3.2-36.8 11.2-11.2 8-19.2 20.8-19.2 36.8 0 20.8 19.2 32 43.2 32h105.6c-59.2 163.2-208 265.6-374.4 265.6-174.4 0-326.4-110.4-382.4-280-8-20.8-30.4-33.6-56-25.6-20.8 8-33.6 30.4-25.6 56C104 888 286.4 1024 499.2 1024c187.2 0 352-105.6 444.8-272v97.6c1.6 24 9.6 43.2 35.2 43.2s43.2-17.6 44.8-43.2V649.6c-1.6-28.8-27.2-54.4-57.6-59.2z" p-id="2176"></path></svg>
);

const { Option } = Select;

function mapStateToProps(state) {
    return {
        user_sections: state.libraries.user_sections,
        procurement_types: state.libraries.procurement_types,
        procurement_type_categories: state.libraries.procurement_type_categories,
        mode_of_procurements: state.libraries.mode_of_procurements,
        selectedPurchaseRequest: state.procurements.purchaseRequest.selectedPurchaseRequest,
        columns: state.procurements.purchaseRequest.columns,
        purchaseRequests: state.procurements.purchaseRequest.purchaseRequests,
        purchaseRequestsPagination: state.procurements.purchaseRequest.pagination,
        filterData: state.procurements.purchaseRequest.tableFilter,
        tableLoading: state.procurements.purchaseRequest.tableLoading,
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
    const procurementFormRef = React.useRef();
    const [submit, setSubmit] = useState(false);
    const [errorMessage, setErrorMessage] = useState({});
    const [selectedProcurementCategory, setSelectedProcurementCategory] = useState(null);
    const [modalProcurementForm, setModalProcurementForm] = useState(false);

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
            type: "SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_FILTER",
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
                type: "SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_FILTER",
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
        props.dispatch({
            type: "SET_PROCUREMENT_PURCHASE_REQUESTS_WORKSPACE_LOADING",
            data: true
        });
        await api.PurchaseRequest.get(item.id)
        .then(res => {
            let purchase_request = res.data;
            api.PurchaseRequest.logger(item.id)
            .then(res => {
                props.dispatch({
                    type: "SELECT_PURCHASE_REQUEST",
                    data: {...purchase_request, audit_trail: res.data }
                });
                props.dispatch({
                    type: "SET_PROCUREMENT_PURCHASE_REQUESTS_WORKSPACE_LOADING",
                    data: false
                });
            })
            .catch(res => {
                props.dispatch({
                    type: "SET_PROCUREMENT_PURCHASE_REQUESTS_WORKSPACE_LOADING",
                    data: false
                });
            })
            .then(res => {
                props.dispatch({
                    type: "SET_PROCUREMENT_PURCHASE_REQUESTS_WORKSPACE_LOADING",
                    data: false
                });
            })
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
            <Menu.Item key="menu-bac-task" icon={<MessageOutlined />} onClick={() => { handleProceedProcurement(item) }}>
                Proceed to Procurement Process
            </Menu.Item>
        </Menu>
    );


    let token = JSON.parse(sessionStorage.getItem("session"));
    let access_token = token.access_token;
    // customAxios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

  
    const handleMenuClick =() => {

    }
    
    const viewBacForm = (item, index) => {
        selectPurchaseRequest(item)
        props.dispatch({
            type: "SET_PROCUREMENT_PURCHASE_REQUEST_TAB",
            data: "bac-task"
        });
    }

    const cancelProcurementForm = () => {
        procurementFormRef.current.setFieldsValue({
            action_type: null,
            technical_working_group_id: null,
            procurement_type_category: null,
            procurement_type_id: null,
            mode_of_procurement_id: null,
        });
        setModalProcurementForm(false);
    }

    const submitProcurementForm = debounce(async (e) => {
        setSubmit(true);
        let formData = {
            ...e,
            id: props.selectedPurchaseRequest.id,
            updater: "procurement",
        };

        api.PurchaseRequest.save(formData, 'update')
        .then(res => {
            setSubmit(false);
            setErrorMessage({});
            setModalProcurementForm(false);
            cancelProcurementForm();
            props.dispatch({
                type: "SELECT_PURCHASE_REQUEST",
                data: {},
            });
            props.getPurchaseRequests();
        })
        .catch(err => {
            setSubmit(false);
            setErrorMessage(err.response.data.errors)
            
        })
    }, 150);

    const handleProceedProcurement = (record) => {
        viewPurchaseRequest(record, 0);
        setModalProcurementForm(true);
        setSelectedProcurementCategory(record.procurement_type.parent.id);
        // console.log(record);
        setTimeout(() => {
            procurementFormRef.current.setFieldsValue({
                procurement_type_category: record.procurement_type.parent.id,
                procurement_type_id: record.procurement_type_id,
                mode_of_procurement_id: record.mode_of_procurement_id,
            });
        }, 150);
    }

    return (
        <>
            <div className="flex justify-end mb-2 space-x-2">
            <Popover content={<Settings columns={props.columns} toggleColumn={toggleColumn} />} title="Column Settings" trigger="click" placement='bottomRight'>
                <Tooltip placement="left" title="Settings">
                    <SettingOutlined />
                </Tooltip>
            </Popover>
            <Tooltip placement="right" title="Refresh">
                <Icon component={ReloadSvg} style={{cursor: "pointer"}} onClick={() => {
                    props.getPurchaseRequests();
                }} />
            </Tooltip>
            
            
            </div>

            <Modal title="Proceed to Procurement Process" visible={modalProcurementForm} 
                footer={[
                    <Button type='primary' form="procurementForm" key="submit" htmlType="submit" disabled={submit} loading={submit}>
                        Submit
                    </Button>
                    ,
                    <Button form="procurementForm" key="cancel" onClick={() => cancelProcurementForm()}>
                        Cancel
                    </Button>
                    ]}
                onCancel={cancelProcurementForm}
                >
                <Form
                    ref={procurementFormRef}
                    name="normal_login"
                    className="login-form"
                    onFinish={(e) => submitProcurementForm(e)}
                    layout='vertical'
                    id="procurementForm"
                >

                        <Form.Item
                                name="procurement_type_category"
                                label="Procurement Category"
                                { ...helpers.displayError(errorMessage, 'procurement_type_category') }
                                rules={[{ required: true, message: 'Please select Procurement Category.' }]}
                            >
                                <Select placeholder='Select Procurement Category' onSelect={(e) => {
                                    procurementFormRef?.current?.setFieldsValue({
                                        procurement_type_id: null,
                                    });
                                    setSelectedProcurementCategory(e);
                                }}>
                                    { props.procurement_type_categories.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                </Select>
                            </Form.Item>

                            {
                                selectedProcurementCategory != null ? (
                                    <Form.Item
                                        name="procurement_type_id"
                                        label="Procurement Type"
                                        { ...helpers.displayError(errorMessage, 'procurement_type_id') }
                                        rules={[{ required: true, message: 'Please select Procurement Type.' }]}
                                    >
                                        <Select placeholder='Select Procurement Category' allowClear > 
                                            { props.procurement_types.filter(i => i.parent.id == selectedProcurementCategory).map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                        </Select>
                                    </Form.Item>
                                ) : ""
                            }

                            <Form.Item
                                name="mode_of_procurement_id"
                                label="Mode of Procurement"
                                { ...helpers.displayError(errorMessage, 'mode_of_procurement_id') }
                                rules={[{ required: true, message: 'Please select Mode of Procurement.' }]}
                            >
                                <Select placeholder='Select Mode of Procurement'>
                                    { props.mode_of_procurements.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                </Select>
                            </Form.Item>

                                        
                </Form>
            </Modal>

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
                    showSizeChanger={false}
                    size="small"
                />
            </div>
        </>
    );
}

export default connect(
    mapStateToProps,
)(ApprovedPurchaseRequest);

