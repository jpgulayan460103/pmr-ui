import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography, Tooltip, notification, Modal, Form, Input, Select, Card, Col, Row, Dropdown, Menu, Pagination } from 'antd';
import api from '../../api';
import Icon, { CloseOutlined, FormOutlined, EllipsisOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import filter from '../../Utilities/filter';
import TableFooterPagination from '../../Components/TableFooterPagination';
import helpers from '../../Utilities/helpers';
import TableRefresh from '../../Components/TableRefresh';
import TableResetFilter from '../../Components/TableResetFilter';
import AttachmentUpload from '../../Components/AttachmentUpload';
import MaximizeSvg from '../../Icons/MaximizeSvg';
import InfoPurchaseRequest from '../PurchaseRequest/Components/InfoPurchaseRequest';
import InfoProcurementPlan from '../ProcurementPlan/Components/InfoProcurementPlan';
import InfoRequisitionIssue from '../RequisitionIssue/Components/InfoRequisitionIssue';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;


function mapStateToProps(state) {
    return {
        user: state.user.data,
        accounts: state.libraries.accounts,
        accountClassifications: state.libraries.account_classifications,
        modeOfProcurements: state.libraries.mode_of_procurements,
        technicalWorkingGroups: state.libraries.technical_working_groups,
        user_sections: state.libraries.user_sections,
        isInitialized: state.user.isInitialized,
        forms: state.forms.approvedForm.forms,
        selectedFormRoute: state.forms.approvedForm.selectedFormRoute,
        pagination: state.forms.approvedForm.pagination,
        loading: state.forms.approvedForm.loading,
        tableFilter: state.forms.approvedForm.tableFilter,
        defaultTableFilter: state.forms.approvedForm.defaultTableFilter,
    };
}



const ApprovedForm = (props) => {
    const unmounted = React.useRef(false);
    useEffect(() => {
        return () => {
            unmounted.current = true;
            // setForms([]);
        }
    }, []);
    useEffect(() => {
        document.title = "Approved Forms";
        if(props.isInitialized){
            // getForm();
            if(isEmpty(props.forms)){
            }
            getForm();
        }
    }, [props.isInitialized]);
    
    const setTableFilter = (data) => {
        if(data == "reset"){
            props.dispatch({
                type: "SET_FORM_APPROVED_FORM_TABLE_FILTER",
                data: props.defaultTableFilter,
            });
            getForm(props.defaultTableFilter);
        }else{
            props.dispatch({
                type: "SET_FORM_APPROVED_FORM_TABLE_FILTER",
                data: data,
            });
        }
    }

    const setForms = (value) => {
        props.dispatch({
            type: "SET_FORM_APPROVED_FORM_FORMS",
            data: value,
        });
    }
    const setSelectedFormRoute = (value) => {
        props.dispatch({
            type: "SET_FORM_APPROVED_FORM_SELECTED_FORM_ROUTE",
            data: value,
        });
    }
    const setPaginationMeta = (value) => {
        props.dispatch({
            type: "SET_FORM_APPROVED_FORM_PAGINATION",
            data: value,
        });
    }
    const setTableLoading = (value) => {
        props.dispatch({
            type: "SET_FORM_APPROVED_FORM_LOADING",
            data: value,
        });
    }


    const getForm = debounce((filters) => {
        if(filters == null){
            filters = props.tableFilter
        }
        setTableLoading(true);
        api.Forms.getApproved(filters)
        .then(res => {
            if (!unmounted.current) {
                setTableLoading(false);
                let data = res.data.data;
                let meta = res.data.meta;
                setForms(data);
                setPaginationMeta(meta.pagination);
            }
            
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {
            setTableLoading(false);
        })
        ;
    },150);

    const onCell = {
        onCell: (record, colIndex) => {
            return {
                onClick: event => {
                    viewForm(record, colIndex);
                },
            };
          }
    }

    const viewForm = (item, index) => {
        setSelectedFormRoute(item)
    }

    const endUserFilter = cloneDeep(props.user_sections).map(i => {
        i.value = i.id;
        return i;
    });

    const dataSource = props.forms
      
    const columns = [
        {
            title: 'Form Type',
            dataIndex: 'route_type_str',
            key: 'route_type_str',
            width: 150,
            ...onCell,
            ellipsis: true,
        },
        {
            title: 'Requested on',
            key: 'created_at',
            width: 150,
            ...filter.search('created_at','date_range', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
            render: (text, item, index) => (
                <span>
                    { item.created_at_date }
                </span>
            ),
        },
        {
            title: 'End User',
            key: 'end_user',
            width: 250,
            filters: endUserFilter,
            ...filter.list('end_user_id','text', setTableFilter, props.tableFilter, getForm),
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            ),
            ...onCell,
            ellipsis: true,
        },
        {
            title: 'Approved on',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: 250,
            ...filter.search('updated_at','date_range', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
        },
        {
            title: 'Description',
            key: 'remarks',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <span>{item.remarks }</span>
                </span>
            ),
            ...filter.search('remarks','text', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
        },
        {
            title: 'Remarks',
            key: 'forwarded_remarks',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <span>{ item.forwarded_remarks }</span>
                </span>
            ),
            ...filter.search('forwarded_remarks','text', setTableFilter, props.tableFilter, getForm),
            ...onCell,
            ellipsis: true,
            sorter: (a, b) => {},
        },
    ];


    const handleTableChange = (pagination, filters, sorter) => {
        // console.log(sorter);
        // console.log(filters);
        let clonedFilter = cloneDeep(props.tableFilter);
        if(!isEmpty(sorter)){
            filters.sortColumn = sorter.columnKey
            filters.sortOrder = sorter.order
            setTableFilter({...clonedFilter, sortColumn: filters.sortColumn, sortOrder: filters.sortOrder});
        }
        getForm({...props.tableFilter, ...filters})
    };

    const paginationChange = async (e) => {
        // console.log(e);
        let clonedFilter = cloneDeep(props.tableFilter);
        setTableFilter({...clonedFilter, page: e});
        getForm({...props.tableFilter, page: e})
    }

    const closeForm = () => {
        setSelectedFormRoute({});
    }

    const openInFull = () => {
        window.open(`${props.selectedFormRoute.form_routable?.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }

    const formInformation = (type) => {
        switch (type) {
            case 'purchase_request':
                return <InfoPurchaseRequest form={props.selectedFormRoute.form_routable} />;
                break;
            case 'procurement_plan':
                return <InfoProcurementPlan form={props.selectedFormRoute.form_routable} />;
                break;
            case 'requisition_issue':
                return <InfoRequisitionIssue form={props.selectedFormRoute.form_routable} />;
                break;
        
            default:
                break;
        }
    }


    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={16} xl={18}>
                    <Card size="small" title="Approved Forms" bordered={false}>
                        <div className='forms-card-content'>
                            <div className="flex justify-end mb-2 space-x-2">
                                <TableResetFilter defaultTableFilter="reset" setTableFilter={setTableFilter} />
                                <TableRefresh getData={getForm} />
                            </div>
                            <Table
                                dataSource={dataSource}
                                columns={columns}
                                size={"small"}
                                loading={{spinning: props.loading, tip: "Loading..."}}
                                pagination={false}
                                onChange={handleTableChange}
                                scroll={{ y: "58vh" }}
                                rowClassName={(record, index) => {
                                    if(props.selectedFormRoute.id == record.id){
                                        return "selected-row";
                                    }
                                }}
                            />
                            <TableFooterPagination pagination={props.pagination} paginationChange={paginationChange} />
                        </div>
                    </Card>
                </Col>
                { isEmpty(props.selectedFormRoute) || props.selectedFormRoute.form_routable.file == "" ? "" : (
                    <Col md={24} lg={8} xl={6}>
                        <Card size="small" title="Form Information" bordered={false} extra={(
                            <div className='text-right flex space-x-0.5'>
                                <Tooltip placement="top" title={"Open in new window"}>
                                    <Button size='small' type='primary' onClick={() => openInFull() }><Icon component={MaximizeSvg} /></Button>
                                </Tooltip>
                                <Tooltip placement="top" title={"Close window"}>
                                    <Button size='small' type='danger' onClick={() => closeForm() }><CloseOutlined /></Button>
                                </Tooltip>
                            </div>
                        )}>
                            <div className='forms-card-content'>
                                <p>
                                    <span><b>Form type:</b> <span>{props.selectedFormRoute.route_type_str}</span></span><br />
                                    <span><b>End User:</b> <span>{props.selectedFormRoute.end_user.name}</span></span><br />
                                    <span><b>Forwarded by:</b> <span>{props.selectedFormRoute.from_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.selectedFormRoute.from_office?.name}` : props.selectedFormRoute.from_office?.name }</span></span><br />
                                    <span><b>Forwarded to:</b> <span>{props.selectedFormRoute.to_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${props.selectedFormRoute.to_office?.name}` : props.selectedFormRoute.to_office?.name }</span></span><br />
                                    <span><b>Description:</b> <span>{props.selectedFormRoute.remarks}</span><br /></span>
                                    <span><b>Remarks:</b> <span>{props.selectedFormRoute.forwarded_remarks}</span><br /></span>
                                    <br />
                                    <span><b>Status:</b> <span>{ props.selectedFormRoute.status }</span></span><br />
                                    <span><b>Action Taken:</b> <span>{ props.selectedFormRoute.action_taken }</span></span><br />
                                    <span><b>Created:</b> <span>{ props.selectedFormRoute.created_at }</span></span><br />
                                    <span><b>Approved:</b> <span>{ props.selectedFormRoute.updated_at }</span></span><br />
                                    <span><b>Turnaround Time:</b> <span>{ helpers.turnAroundTime(props.selectedFormRoute.updated_at_raw, props.selectedFormRoute.created_at_raw) }</span></span><br />
                                </p>
                                <p className='text-center'><b>{props.selectedFormRoute.route_type_str} Information</b></p>
                                { formInformation(props.selectedFormRoute.route_type) }
                                
                            </div>
                        </Card>
                    </Col>
                )  }
            </Row>
            { isEmpty(props.selectedFormRoute) || props.selectedFormRoute.form_routable.file == "" ? "" : (
            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={16} xl={18}>
                    <Card size="small" title="Forwarded Form" bordered={false} loading={props.formLoading}>
                        <div className='forms-card-form-content'>
                            <iframe src={`${props.selectedFormRoute.form_routable?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>
                        </div>
                    </Card>
                </Col>

                <Col md={24} lg={8} xl={6}>
                        <Card size="small" title="Attachments" bordered={false} loading={props.formLoading}>
                            <div className='forms-card-form-content'>
                                <AttachmentUpload formId={props.selectedFormRoute.form_routable_id} formType={props.selectedFormRoute.route_type} fileList={props.attachments}></AttachmentUpload>
                            </div>
                        </Card>
                    </Col>
            </Row>
            )  }


            <div className='col-md-8'>

            </div>
            <div className='col-md-4'>
                
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ApprovedForm);
