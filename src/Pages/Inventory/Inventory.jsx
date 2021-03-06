import { Button, Card, Col, Row, Table, Tooltip } from 'antd';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../../api';
import TableFooterPagination from '../../Components/TableFooterPagination';
import TableRefresh from '../../Components/TableRefresh';
import TableResetFilter from '../../Components/TableResetFilter';
import filter from '../../Utilities/filter';
import Icon, {
    CloseOutlined,
} from '@ant-design/icons';



function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        item_categories: state.libraries.item_categories,
        user: state.user.data,
        tableFilter: state.inventory.supplies.tableFilter,
        defaultTableFilter: state.inventory.supplies.defaultTableFilter,
        selectedSupply: state.inventory.supplies.selectedSupply,
        items: state.inventory.supplies.items,
        loading: state.inventory.supplies.loading,
        pagination: state.inventory.supplies.pagination,
    };
}

const MaximizeSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M794.432 983.552H51.2a25.6 25.6 0 0 1-25.6-25.6V214.784a25.6 25.6 0 0 1 25.6-25.6h152.768V66.112a25.6 25.6 0 0 1 25.6-25.6H972.8a25.6 25.6 0 0 1 25.6 25.6v743.232a25.6 25.6 0 0 1-25.6 25.6h-152.768v123.008a25.6 25.6 0 0 1-25.6 25.6z m-717.632-51.2h692.032V240.384H76.8v691.968z m743.232-148.672H947.2V91.648H255.168v97.472h539.264a25.6 25.6 0 0 1 25.6 25.6v568.96z" p-id="2528"></path>
    </svg>
);

const Inventory = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => { unmounted.current = true }
    }, []);

    useEffect(() => {
        document.title = "Inventory";
        if(props.isInitialized){
            if(isEmpty(props.items)){
                getSupplies();
            }
        }
    }, [props.isInitialized]);

    const getSupplies =  debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        setTableLoading(true);
        api.ItemSupply.all(filters)
        .then(res => {
            setTableLoading(false);
            let data = res.data.data;
            let meta = res.data.meta;
            setItems(data);
            setPagination(meta.pagination);
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {
            setTableLoading(false);
        })
        ;
    }, 200);

    const setPagination = (value) => {
        props.dispatch({
            type: "SET_INVENTORY_SUPPLY_PAGINATION",
            data: value
        });
    }
    const setSelectedSupply = (value) => {
        props.dispatch({
            type: "SET_INVENTORY_SUPPLY_SELECTED_SUPPLY",
            data: value
        });
    }
    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_INVENTORY_SUPPLY_LOADING",
            data: value
        });
    }
    const setItems = (value) => {
        props.dispatch({
            type: "SET_INVENTORY_SUPPLY_ITEMS",
            data: value
        });
    }

    const setTableFilter = (data) => {
        if(typeof data == "function"){
            props.dispatch({
                type: "SET_INVENTORY_SUPPLY_TABLE_FILTER",
                data: data(),
            });
        }else{
            props.dispatch({
                type: "SET_INVENTORY_SUPPLY_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
        }
    }

    const openSupply = async (item, index) => {

    }

    const itemCategoryFilter = cloneDeep(props.item_categories).map(i => {
        i.value = i.id;
        return i;
    });

    const dataSource = props.items;

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    setSelectedSupply(record)
                    if(isEmpty(props.selectedSupply)){
                        openSupply(record, colIndex);
                    }else{
                        if(props.selectedSupply.id != record.id){
                            openSupply(record, colIndex);
                        }
                    }
                },
            };
          }
    }
      
    const columns = [
        {
            title: 'Category',
            key: 'item_category',
            ellipsis: true,
            width: 250,
            filters: itemCategoryFilter,
            ...filter.list('item_category_id','text', setTableFilter, props.tableFilter, getSupplies),
            render: (text, item, index) => (
                <span>
                    <span>{ item.item_category.name }</span>
                </span>
            ),
            ...onCell,
        },
        {
            title: 'Item',
            dataIndex: 'item_name',
            key: 'item_name',
            width: 120,
            align: "center",
            ...filter.search('item_name','text', setTableFilter, props.tableFilter, getSupplies),
            ...onCell,
            sorter: (a, b) => {},
        },
        {
            title: 'Remaining Quantity',
            key: 'remaining_quantity',
            width: 150,
            align: "center",
            // ...filter.search('remaining_quantity','number_range', setTableFilter, props.tableFilter, getSupplies),
            render: (text, item, index) => (
                <span>
                    { item.remaining_quantity.quantity }
                </span>
            ),
            ...onCell,
            sorter: (a, b) => {},
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            getSupplies(filters)
        }else{
            getSupplies(filters)
        }
    };

    const paginationChange = async (e) => {
        setTableFilter(prev => ({...prev, page: e}));
        getSupplies({...props.tableFilter, page: e})
    }

    const openInFull = () => {
        window.open(`${props.selectedSupply.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }

    const closeItemSupply = () => {
        setSelectedSupply({});
    }

    
    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={16} lg={14} xl={14}>
                    <Card size="small" title="Inventory" bordered={false}  >
                        <div className='user-card-content'>
                            <div className="flex justify-end mb-2 space-x-2">
                                <TableResetFilter defaultTableFilter="reset" setTableFilter={setTableFilter} />
                                <TableRefresh getData={getSupplies} />
                            </div>
                            <Table dataSource={dataSource} columns={columns} rowClassName={(record, index) => {
                                    if(props.selectedSupply?.id == record.id){
                                        return "selected-row";
                                    }
                                }}
                                onChange={handleTableChange}
                                size={"small"}
                                pagination={false}
                                scroll={{ y: "70vh" }}
                                loading={{spinning: props.loading, tip: "Loading..."}}
                            />
                            <TableFooterPagination pagination={props.pagination} paginationChange={paginationChange} />
                        </div>                        
                    </Card>
                </Col>
                { isEmpty(props.selectedSupply.file) ? "" : ( 
                <Col xs={24} sm={24} md={8} lg={10} xl={10}>
                    <Card size="small" title="Stock Card" bordered={false} extra={(
                            <div className='text-right space-x-0.5'>
                                <Tooltip placement="top" title={"Open in new window"}>
                                    <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                </Tooltip>
                                <Tooltip placement="top" title={"Close window"}>
                                    <Button size='small' type='danger' onClick={() => closeItemSupply() }><CloseOutlined /></Button>
                                </Tooltip>
                            </div>
                        )}
                    >
                        <div className='user-card-content'>
                            <iframe src={`${props.selectedSupply.file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                        </div>
                    </Card>
                </Col>
                )}
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Inventory);

