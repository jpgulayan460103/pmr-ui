import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select, Table, Tooltip } from 'antd';
import {
    EditOutlined,
    ShoppingCartOutlined,
    FileZipFilled,
} from '@ant-design/icons';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom'
import api from '../../../api';
import TableFooterPagination from '../../../Components/TableFooterPagination';
import TableRefresh from '../../../Components/TableRefresh';
import TableResetFilter from '../../../Components/TableResetFilter';
import dayjs from '../../../customDayJs';
import filter from '../../../Utilities/filter';
import ArchiveForm from '../../../Components/ArchiveForm';

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        user_sections: state.libraries.user_sections,
    };
}


function TableRequisitionIssue(props) {
    let history = useHistory();
    const [archiveModal, setArchiveModal] = useState(false);

    const editRequisitionIssue = (item, index) => {
        api.RequisitionIssue.get(item.id)
        .then(res => {
            let ris = res.data;
            ris.items = ris.items.data;
            ris.issued_items = [];
            ris.form_route_id = item.id;
            props.dispatch({
                type: "SET_REQUISITION_ISSUE_CREATE_FORM_TYPE",
                data: "update"
            });

            props.dispatch({
                type: "SET_REQUISITION_ISSUE_CREATE_FORM_DATA",
                data: ris
            });

            history.push("/requisition-and-issues/form");
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            props.getRequisitionIssues(filters)
        }else{
            props.getRequisitionIssues(filters)
        }
    };

    const paginationChange = async (e) => {
        let clonedFilter = cloneDeep(props.tableFilter);
        props.setTableFilter({...clonedFilter, page: e});
        props.getRequisitionIssues({...props.tableFilter, page: e})
    }

    const endUserFilter = cloneDeep(props.user_sections).map(i => {
        i.value = i.id;
        return i;
    });

    const addToPurchaseRequest = (item, index) => {
        api.RequisitionIssue.get(item.id)
        .then(res => {
            let risRes = res.data;
            let ris = {
                purpose: risRes.purpose,
                end_user_id: risRes.end_user_id,
                items: risRes.items.data,
                pr_date: dayjs().format('YYYY-MM-DD'),
                requisition_issue_id: risRes.id,
                requisition_issue_file: risRes.file,
                from_ppmp: risRes.from_ppmp,
            };
            ris.items = ris.items.filter(risItem => risItem.is_pr_recommended == 1).map(risItem => {
                risItem.item_name = risItem.description;
                risItem.item_code = risItem.item?.item_code;
                risItem.quantity = risItem.request_quantity - risItem.issue_quantity;
                risItem.unit_cost = risItem.procurement_plan_item ? risItem.procurement_plan_item.price : 0;
                risItem.requisition_issue_item_id = risItem.id;
                return risItem;
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
                data: ris
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
                data: {}
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_SELECTED_REQUISITION_ISSUE",
                data: risRes
            });

            history.push("/purchase-requests/form");
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const showArchiveForm = (item, index) => {
        setArchiveModal(true);
        props.setSelectedRequisitionIssue(item)
    }

    const dataSource = props.requisitionIssues;

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    props.setSelectedRequisitionIssue(record)
                    if(isEmpty(props.selectedRequisitionIssue)){
                        props.openRequisitionIssue(record, colIndex);
                    }else{
                        if(props.selectedRequisitionIssue.id != record.id){
                            props.openRequisitionIssue(record, colIndex);
                        }
                    }
                },
            };
          }
    }

    const defaultColumn = [
        {
            title: 'RIS Date',
            dataIndex: 'ris_date',
            key: 'ris_date',
            width: 120,
            align: "center",
            ...filter.search('ris_date','date_range', props.setTableFilter, props.tableFilter, props.getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'RIS No.',
            dataIndex: 'ris_number',
            key: 'ris_number',
            width: 150,
            align: "center",
            ...filter.search('ris_number','text', props.setTableFilter, props.tableFilter, props.getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            ...filter.search('title','text', props.setTableFilter, props.tableFilter, props.getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 350,
            ...filter.search('purpose','text', props.setTableFilter, props.tableFilter, props.getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },

        {
            title: 'Status',
            key: 'status',
            align: "center",
            width: 120,
            render: (text, item, index) => (
                <span>
                    { item.status }
                </span>
            ),
            filters: [
                { text: 'Approved', value: "Approved" },
                { text: 'Pending', value: "Pending" },
                { text: 'Disapproved', value: "Disapproved" },
                { text: 'Issued', value: "Issued" },
                { text: 'Archived', value: "Archived" },
            ],
            ...filter.list('status','text', props.setTableFilter, props.tableFilter, props.getRequisitionIssues),
            ...onCell,
        },
        {
            title: 'End User',
            key: 'end_user',
            ellipsis: true,
            width: 250,
            filters: endUserFilter,
            ...filter.list('end_user_id','text', props.setTableFilter, props.tableFilter, props.getRequisitionIssues),
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            ),
            ...onCell,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: 250,
            ...filter.search('remarks','text', props.setTableFilter, props.tableFilter, props.getRequisitionIssues),
            ...onCell,
            sorter: (a, b) => {},
        },
    ];
    

    const addColumns = () => {
        if(props.page == "list"){
            defaultColumn.push({
                title: "Action",
                key: "action",
                fixed: 'right',
                width: 100,
                align: "center",
                render: (text, item, index) => (
                    <div className='space-x-0.5'>
                        { item.status != "Archived" && (
                        <Tooltip placement="right" title={"Edit"}>
                            <Button size='small' type='default' icon={<EditOutlined />}  onClick={() => { editRequisitionIssue(item, index) }}>
    
                            </Button>
                        </Tooltip>
                        ) }
                        { item.status == "Issued" && (
                            <Tooltip placement="right" title={"Create Purchase Request"}>
                                <Button size='small' type='primary' icon={<ShoppingCartOutlined />}  onClick={() => { addToPurchaseRequest(item, index) }}>
    
                                </Button>
                            </Tooltip>
                        ) }
                        { item.status == "Disapproved" && (
                            <Tooltip placement="right" title={"Archive"}>
                                <Button size='small' type='danger' icon={<FileZipFilled />}  onClick={() => { showArchiveForm(item, index) }}>
    
                                </Button>
                            </Tooltip>
                        ) }
                    </div>
                  )
            })
        }
    }
    addColumns();
    const columns = defaultColumn;
    return (
        <div>
            <div className="flex justify-end mb-2 space-x-2">
                <TableResetFilter defaultTableFilter="reset" setTableFilter={props.setTableFilter} />
                <TableRefresh getData={props.getRequisitionIssues} />
            </div>
            <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                    if(props.selectedRequisitionIssue?.id == record.id){
                        return "selected-row";
                    }
                }}
                onChange={handleTableChange}
                size={"small"}
                pagination={false}
                scroll={{ y: "50vh" }}
                loading={{spinning: props.loading, tip: "Loading..."}}
            />

            <TableFooterPagination pagination={props.paginationMeta} paginationChange={paginationChange} />
            <ArchiveForm reloadData={props.getRequisitionIssues} selectedForm={props.selectedRequisitionIssue} setArchiveModal={setArchiveModal} archiveModal={archiveModal} formType="requisition_issue" />
        </div>
    );
}
export default connect(
    mapStateToProps,
  )(TableRequisitionIssue);