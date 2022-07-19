import React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom'
import {
    EditOutlined,
} from '@ant-design/icons';
import TableRefresh from '../../../../Components/TableRefresh';
import TableResetFilter from '../../../../Components/TableResetFilter';
import { cloneDeep, isEmpty } from 'lodash';
import api from '../../../../api';
import filter from '../../../../Utilities/filter';
import TableFooterPagination from '../../../../Components/TableFooterPagination';

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        selectedProcurementPlan: state.procurementPlans.list.selectedProcurementPlan,
        procurementPlans: state.procurementPlans.list.procurementPlans,
        paginationMeta: state.procurementPlans.list.paginationMeta,
        loading: state.procurementPlans.list.loading,
        tableFilter: state.procurementPlans.list.tableFilter,
        defaultTableFilter: state.procurementPlans.list.defaultTableFilter,
        user_sections: state.libraries.user_sections,
        item_types: state.libraries.item_types,
    };
}


const TableProcurementPlan = (props) => {
    let history = useHistory()

    const loadProcurementPlanData = async (id) => {
        await api.ProcurementPlan.get(id)
        .then(res => {
            let item = res.data;
            let form_routes = item.form_routes.data;
            setTimelines(form_routes);
            setSelectedProcurementPlan(item)
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const loadAuditTrail = async (id) => {
        await api.ProcurementPlan.logger(id)
        .then(res => {
            setLogger(res.data.data);
        })
        .catch(res => {})
        .then(res => {})
    }

    const editProcurementPlan = (item, index) => {
        api.ProcurementPlan.get(item.id)
        .then(res => {
            let procurementPlan = res.data;
            let itemTypeA = props.item_types[0].id;
            let itemTypeB = props.item_types[1].id;
            procurementPlan.itemsA = res.data.items.data.filter(item => item.item_type_id == itemTypeA);
            procurementPlan.itemsB = res.data.items.data.filter(item => item.item_type_id == itemTypeB);
            console.log(procurementPlan);
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_DATA",
                data: procurementPlan
            });
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_CREATE_FORM_TYPE",
                data: "update"
            });
            history.push("/procurement-plans/form");
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const setTableFilter = (data) => {
        if(typeof data == "function"){
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_TABLE_FILTER",
                data: data(),
            });
        }else{
            props.dispatch({
                type: "SET_PROCUREMENT_PLAN_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
        }
    }
    const setSelectedProcurementPlan = (value) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_LIST_SELECTED_PURCHASE_REQUEST",
            data: value
        });
    }
    
    const setTimelines = (value) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_LIST_TIMELINES",
            data: value
        });
    }

    const setLogger = (value) => {
        props.dispatch({
            type: "SET_PROCUREMENT_PLAN_LIST_LOGGER",
            data: value,
        });
    }


    const openProcurementPlan = async (item, index) => {
        setSelectedProcurementPlan(item)
        setTimelines([]);
        setLogger([]);
        loadProcurementPlanData(item.id);
        loadAuditTrail(item.id);
    }
   

    const endUserFilter = cloneDeep(props.user_sections).map(i => {
        i.value = i.id;
        return i;
    });


    const dataSource = props.procurementPlans;

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedProcurementPlan(record)
                    if(isEmpty(props.selectedProcurementPlan)){
                        openProcurementPlan(record, colIndex);
                    }else{
                        if(props.selectedProcurementPlan.id != record.id){
                            openProcurementPlan(record, colIndex);
                        }
                    }
                },
            };
          }
    }
      
    const columns = [
        {
            title: 'PPMP Date',
            dataIndex: 'ppmp_date',
            key: 'ppmp_date',
            width: 150,
            align: "center",
            ...filter.search('ppmp_date','date_range', setTableFilter, props.tableFilter, props.getProcurementPlans),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'PPMP Type',
            // dataIndex: 'procurement_plan_type',
            key: 'procurement_plan_type_id',
            width: 200,
            ...filter.search('procurement_plan_type_id','text', setTableFilter, props.tableFilter, props.getProcurementPlans),
            ...onCell,
            sorter: (a, b) => {},
            render: (text, item, index) => (
                <span>
                    { item.procurement_plan_type.name }
                </span>
            ),
        },
        {
            title: 'Total Amount',
            key: 'total_estimated_budget',
            width: 150,
            align: "center",
            ...filter.search('total_estimated_budget','number_range', setTableFilter, props.tableFilter, props.getProcurementPlans),
            render: (text, item, index) => (
                <span>
                    { item.common_amount_formatted }
                </span>
            ),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 450,
            ...filter.search('title','text', setTableFilter, props.tableFilter, props.getProcurementPlans),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Purpose',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 450,
            ...filter.search('purpose','text', setTableFilter, props.tableFilter, props.getProcurementPlans),
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
            ...filter.list('status','text', setTableFilter, props.tableFilter, props.getProcurementPlans),
            ...onCell,
        },
        {
            title: 'End User',
            key: 'end_user',
            ellipsis: true,
            width: 250,
            filters: endUserFilter,
            ...filter.list('end_user_id','text', setTableFilter, props.tableFilter, props.getProcurementPlans),
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            ),
            ...onCell,
        },
        {
            title: "Action",
            key: "action",
            fixed: 'right',
            width: 100,
            align: "center",
            render: (text, item, index) => (
                <div className='space-x-0.5'>
                    <Tooltip placement="bottom" title={"Edit"}>
                        <Button size='small' type='default' icon={<EditOutlined />}  onClick={() => { editProcurementPlan(item, index) }}>

                        </Button>
                    </Tooltip>
                    {/* <Tooltip placement="bottom" title={"Cancel"}>
                        <Button size='small' type='danger' icon={<StopOutlined />}  onClick={() => { editProcurementPlan(item, index) }}>

                        </Button>
                    </Tooltip> */}
                </div>
              )
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            props.getProcurementPlans(filters)
        }else{
            props.getProcurementPlans(filters)
        }
    };

    const paginationChange = async (e) => {
        setTableFilter(prev => ({...prev, page: e}));
        props.getProcurementPlans({...props.tableFilter, page: e})
    }
    

  

    return (
        <div className='purchase-request-card-content'>
            <div className="flex justify-end mb-2 space-x-2">
                <TableResetFilter defaultTableFilter="reset" setTableFilter={setTableFilter} />
                <TableRefresh getData={props.getProcurementPlans} />
            </div>
            <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                    if(props.selectedProcurementPlan?.id == record.id){
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
  )(TableProcurementPlan);
