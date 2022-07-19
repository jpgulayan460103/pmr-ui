import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { Button, Table, Tooltip } from 'antd';
import Icon, {
    EditOutlined,
} from '@ant-design/icons';
import TableFooterPagination from '../../../Components/TableFooterPagination';
import TableRefresh from '../../../Components/TableRefresh';
import TableResetFilter from '../../../Components/TableResetFilter';
import filter from '../../../Utilities/filter';
import api from '../../../api';
import { cloneDeep, isEmpty } from 'lodash';

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        user_sections: state.libraries.user_sections,
    };
}   

function TablePurchaseRequest(props) {
    let history = useHistory()
    
    const editPurchaseRequest = (item, index) => {
        api.PurchaseRequest.get(item.id)
        .then(res => {
            let purchaseRequest = res.data;
            purchaseRequest.items = res.data.items.data;
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_FORM_DATA",
                data: purchaseRequest
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_FORM_TYPE",
                data: "update"
            });
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS",
                data: {}
            });
            history.push("/purchase-requests/form");
        })
        .catch(err => {})
        .then(res => {})
        ;

        api.RequisitionIssue.get(item.requisition_issue_id)
        .then(res => {
            let risRes = res.data;
            props.dispatch({
                type: "SET_PURCHASE_REQUEST_SELECTED_REQUISITION_ISSUE",
                data: risRes
            });

            // history.push("/purchase-requests/form");
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
            props.getPurchaseRequests(filters)
        }else{
            props.getPurchaseRequests(filters)
        }
    };

    const paginationChange = async (e) => {
        let clonedFilter = cloneDeep(props.tableFilter);
        props.setTableFilter({...clonedFilter, page: e});
        props.getPurchaseRequests({...props.tableFilter, page: e})
    }


    const endUserFilter = cloneDeep(props.user_sections).map(i => {
        i.value = i.id;
        return i;
    });


    const dataSource = props.purchaseRequests;

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    props.setSelectedPurchaseRequest(record)
                    if(isEmpty(props.selectedPurchaseRequest)){
                        props.openPurchaseRequest(record, colIndex);
                    }else{
                        if(props.selectedPurchaseRequest.id != record.id){
                            props.openPurchaseRequest(record, colIndex);
                        }
                    }
                },
            };
          }
    }
      
    const defaultColumn = [
        {
            title: 'PR Date',
            dataIndex: 'pr_date',
            key: 'pr_date',
            width: 120,
            align: "center",
            ...filter.search('pr_date','date_range', props.setTableFilter, props.tableFilter, props.getPurchaseRequests),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'PR Number',
            dataIndex: 'pr_number',
            key: 'pr_number',
            width: 150,
            ...filter.search('pr_number','text', props.setTableFilter, props.tableFilter, props.getPurchaseRequests),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            ...filter.search('title','text', props.setTableFilter, props.tableFilter, props.getPurchaseRequests),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 200,
            ...filter.search('purpose','text', props.setTableFilter, props.tableFilter, props.getPurchaseRequests),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Total Cost',
            key: 'total_cost',
            width: 150,
            align: "center",
            ...filter.search('total_cost','number_range', props.setTableFilter, props.tableFilter, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    { item.total_cost_formatted }
                </span>
            ),
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
            ],
            ...filter.list('status','text', props.setTableFilter, props.tableFilter, props.getPurchaseRequests),
            ...onCell,
        },
        {
            title: 'End User',
            key: 'end_user',
            ellipsis: true,
            width: 250,
            filters: endUserFilter,
            ...filter.list('end_user_id','text', props.setTableFilter, props.tableFilter, props.getPurchaseRequests),
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            ),
            ...onCell,
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
                        <Tooltip placement="bottom" title={"Edit"}>
                            <Button size='small' type='default' icon={<EditOutlined />}  onClick={() => { editPurchaseRequest(item, index) }}>
    
                            </Button>
                        </Tooltip>
                        {/* <Tooltip placement="bottom" title={"Cancel"}>
                            <Button size='small' type='danger' icon={<StopOutlined />}  onClick={() => { editPurchaseRequest(item, index) }}>
    
                            </Button>
                        </Tooltip> */}
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
                <TableRefresh getData={props.getPurchaseRequests} />
            </div>
            <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                    if(props.selectedPurchaseRequest?.id == record.id){
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
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(TablePurchaseRequest);