import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux';
import { Table, Popover, Select, List, Menu, Dropdown, Tooltip, Button, Modal, Form,} from 'antd';
import filter from '../../Utilities/filter';
import _, { cloneDeep, debounce, isEmpty, map } from 'lodash';
import Icon, { SettingOutlined, EyeOutlined, EyeInvisibleOutlined, MoreOutlined, EllipsisOutlined, MessageOutlined } from '@ant-design/icons';
import api from '../../api';
import helpers from '../../Utilities/helpers';
import TableFooterPagination from '../../Components/TableFooterPagination';
import TableRefresh from '../../Components/TableRefresh'
import TableResetFilter from '../../Components/TableResetFilter';

const { Option } = Select;

function mapStateToProps(state) {
    return {
        user_sections: state.libraries.user_sections,
        accounts: state.libraries.accounts,
        account_classifications: state.libraries.account_classifications,
        mode_of_procurements: state.libraries.mode_of_procurements,
        procurement_types: state.libraries.procurement_types,
        selectedPurchaseRequest: state.procurements.purchaseRequest.selectedPurchaseRequest,
        columns: state.procurements.purchaseRequest.columns,
        purchaseRequests: state.procurements.purchaseRequest.purchaseRequests,
        purchaseRequestsPagination: state.procurements.purchaseRequest.pagination,
        tableFilter: state.procurements.purchaseRequest.tableFilter,
        defaultTableFilter: state.procurements.purchaseRequest.defaultTableFilter,
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
    const [selectedAccountClassification, setSelectedAccountClassification] = useState(null);
    const [modalProcurementForm, setModalProcurementForm] = useState(false);

    useEffect(() => {
        if(props.isInitialized){
            if(isEmpty(props.purchaseRequests)){
            }
            props.getPurchaseRequests();
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
    
    const setTableFilter = (data) => {
        if(data == "reset"){
            props.dispatch({
                type: "SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
            props.getPurchaseRequests(props.defaultTableFilter);
        }else{
            props.dispatch({
                type: "SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_FILTER",
                data: data,
            });
        }
    }

    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        let clonedFilter = cloneDeep(props.tableFilter);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            setTableFilter({...clonedFilter, sortColumn: filters.sortColumn, sortOrder: filters.sortOrder});
        }
        props.getPurchaseRequests({...props.tableFilter, ...filters})
    };

    const paginationChange = async (e) => {
        // console.log(e);
        let clonedFilter = cloneDeep(props.tableFilter);
        setTableFilter({...clonedFilter, page: e});
        props.getPurchaseRequests({...props.tableFilter, page: e})
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

    const purchaseRequestTypeCategoryFilter = cloneDeep(props.account_classifications).map(i => {
        i.value = i.id;
        return i;
    });

    const purchaseRequestTypeFilter = () => {
        let filteredCategory = cloneDeep(props.account_classifications);
        if(!isEmpty(props.tableFilter.purchase_request_type_category)){
            filteredCategory = filteredCategory.filter(i => props.tableFilter.purchase_request_type_category.includes(i.id));
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
    const procurementTypeFilter = cloneDeep(props.procurement_types).map(i => {
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
            ...filter.search('pr_date','date_range', setTableFilter, props.tableFilter, props.getPurchaseRequests),
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
            ...filter.search('sa_or','text', setTableFilter, props.tableFilter, props.getPurchaseRequests),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'PR Number',
            dataIndex: 'pr_number',
            key: 'pr_number',
            width: 200,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'pr_number')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'pr_number')[0].shown : true,
            filterable: true,
            ...filter.search('pr_number','text', setTableFilter, props.tableFilter, props.getPurchaseRequests),
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
            ...filter.search('title','text', setTableFilter, props.tableFilter, props.getPurchaseRequests),
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
            ...filter.search('purpose','text', setTableFilter, props.tableFilter, props.getPurchaseRequests),
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
            ...filter.list('end_user_id','text', setTableFilter, props.tableFilter, props.getPurchaseRequests),
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
            ...filter.search('total_cost','number_range', setTableFilter, props.tableFilter, props.getPurchaseRequests),
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
            ...filter.list('purchase_request_type_category','text', setTableFilter, props.tableFilter, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    {item?.account?.parent?.name}
                </span>
            ),
            ...onCell,
            // sorter: (a, b) => {},
        },
        {
            title: 'Type',
            key: 'account_id',
            filters: purchaseRequestTypeFilter(),
            width: 200,
            ellipsis: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'account_id')[0].ellipsis : true,
            shown: !isEmpty(props.columns) ? props.columns.filter(i => i.key == 'account_id')[0].shown : true,
            filterable: true,
            ...filter.list('account_id','text', setTableFilter, props.tableFilter, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    { item?.account?.name }
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
            ...filter.list('mode_of_procurement_id','text', setTableFilter, props.tableFilter, props.getPurchaseRequests),
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
                    <Dropdown overlay={menu(item, index)} trigger={['hover']}>
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
            type: null,
            technical_working_group_id: null,
            account_classification: null,
            account_id: null,
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
        console.log(record);
        setSelectedAccountClassification(record.account.parent.id);
        setTimeout(() => {
            procurementFormRef.current.setFieldsValue({
                account_classification: record.account.parent.id,
                account_id: record.account_id,
                mode_of_procurement_id: record.mode_of_procurement_id,
            });
        }, 150);
    }

    return (
        <>
            <div className="flex justify-end mb-2 space-x-2">
            <Popover content={<Settings columns={props.columns} toggleColumn={toggleColumn} />} title="Column Settings" trigger="click" placement='bottomRight'>
                <Tooltip placement="top" title="Settings">
                    <SettingOutlined />
                </Tooltip>
            </Popover>
                <TableResetFilter defaultTableFilter="reset" setTableFilter={setTableFilter} />
                <TableRefresh getData={props.getPurchaseRequests} />
            
            
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
                                name="procurement_type_id"
                                label="Type of Procurement"
                                { ...helpers.displayError(errorMessage, 'procurement_type_id') }
                                rules={[{ required: true, message: 'Please select Mode of Procurement.' }]}
                            >
                                <Select placeholder='Select Type of Procurement'>
                                    { props.procurement_types.map(i => <Option value={i.id} key={i.key}>{i.name}</Option>) }
                                </Select>
                            </Form.Item>

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
            <TableFooterPagination pagination={props.purchaseRequestsPagination} paginationChange={paginationChange} />
        </>
    );
}

export default connect(
    mapStateToProps,
)(ApprovedPurchaseRequest);

