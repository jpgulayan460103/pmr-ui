import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Space, Divider, Button, Typography, Tooltip, notification, Modal, Form, Input, Select, Card, Col, Row, Dropdown, Menu, Pagination } from 'antd';
import api from '../../api';
import Icon, { CloseOutlined, FormOutlined, EllipsisOutlined, LikeTwoTone, DislikeTwoTone, SendOutlined } from '@ant-design/icons';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import dayjs from 'dayjs';
import filter from '../../Shared/filter';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;


function mapStateToProps(state) {
    return {
        user: state.user.data,
        procurementTypes: state.library.procurement_types,
        procurementTypeCategories: state.library.procurement_type_categories,
        modeOfProcurements: state.library.mode_of_procurements,
        technicalWorkingGroups: state.library.technical_working_groups,
        user_sections: state.library.user_sections,
        isInitialized: state.user.isInitialized,
    };
}

const MaximizeSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M794.432 983.552H51.2a25.6 25.6 0 0 1-25.6-25.6V214.784a25.6 25.6 0 0 1 25.6-25.6h152.768V66.112a25.6 25.6 0 0 1 25.6-25.6H972.8a25.6 25.6 0 0 1 25.6 25.6v743.232a25.6 25.6 0 0 1-25.6 25.6h-152.768v123.008a25.6 25.6 0 0 1-25.6 25.6z m-717.632-51.2h692.032V240.384H76.8v691.968z m743.232-148.672H947.2V91.648H255.168v97.472h539.264a25.6 25.6 0 0 1 25.6 25.6v568.96z" p-id="2528"></path>
    </svg>
);  

const DisapprovedForm = (props) => {
    const rejectFormRef = React.useRef();
    const resolveFormRef = React.useRef();
    const budgetFormRef = React.useRef();
    const procurementFormRef = React.useRef();
    useEffect(() => {
        document.title = "Disapproved Forms";
        if(props.isInitialized){
            getForm();
        }
    }, [props.isInitialized]);

    const [forms, setForms] = useState([]);
    const [selectedFormRoute, setSelectedFormRoute] = useState({});
    const [modalRejectForm, setModalRejectForm] = useState(false);
    const [modalResolveForm, setModalResolveForm] = useState(false);
    const [modalBudgetForm, setModalBudgetForm] = useState(false);
    const [modalProcurementForm, setModalProcurementForm] = useState(false);
    const [routeOptions, setRouteOptions] = useState([]);
    const [procurementFormType, setProcurementFormType] = useState("");
    const [currentRoute, setCurrentRoute] = useState({});
    const [addOn, setAddOn] = useState(`BUDRP-PR-${dayjs().format("YYYY-MM-")}`);
    const [errorMessage, setErrorMessage] = useState({});
    const [filterData, setFilterData] = useState({});
    const [tableLoading, setTableLoading] = useState(false);
    const [paginationMeta, setPaginationMeta] = useState({});
    const [selectedProcurementCategory, setSelectedProcurementCategory] = useState(null);
    const [submit, setSubmit] = useState(false);


    const getForm = debounce((filters) => {
        if(filters == null){
            filters = filterData
        }
        setTableLoading(true);
        api.Forms.getRejected(filters)
        .then(res => {
            setTableLoading(false);
            let data = res.data.data;
            let meta = res.data.meta;
            setForms(data);
            setPaginationMeta(meta.pagination);
            
        })
        .catch(res => {
            setTableLoading(false);
        })
        .then(res => {})
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

    const dataSource = forms
      
    const columns = [
        {
            title: 'Form Type',
            dataIndex: 'route_type_str',
            key: 'route_type_str',
            width: 150,
            ...onCell,
        },
        {
            title: 'Title',
            key: 'title',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.title }
                </span>
            ),
            ...filter.search('title','text', setFilterData, filterData, getForm),
            ...onCell,
            width: 150,
        },
        {
            title: 'Purpose',
            key: 'purpose',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.purpose }
                </span>
            ),
            ...filter.search('purpose','text', setFilterData, filterData, getForm),
            ...onCell,
            width: 150,
        },
        {
            title: 'Amount',
            key: 'amount',
            render: (text, item, index) => (
                <span>
                    { item.form_routable?.total_cost_formatted }
                </span>
            ),
            ...onCell,
            width: 150,
        },
        {
            title: 'End User',
            key: 'end_user',
            ellipsis: true,
            width: 250,
            filters: endUserFilter,
            ...filter.list('end_user_id','text', setFilterData, filterData, getForm),
            render: (text, item, index) => (
                <span>
                    <span>{ item.end_user.name }</span>
                </span>
            ),
            ...onCell,
        },
        {
            title: 'Requested on',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 250,
            ...filter.search('created_at','date_range', setFilterData, filterData, getForm),
            ...onCell,
        },
        {
            title: 'Disapproved on',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: 250,
            ...filter.search('updated_at','date_range', setFilterData, filterData, getForm),
            ...onCell,
        },
        // {
        //     title: 'Status',
        //     key: 'status',
        //     width: 250,
        //     render: (text, item, index) => (
        //         <span>
        //             { item.status_str }
        //         </span>
        //     ),
        //     filters: [{text: "Pending", value: "pending"},{text: "Disapproved", value: "disapproved"}],
        //     ...filter.list('status','text', setFilterData, filterData, getForm),
        //     ...onCell,
        // },
        {
            title: 'Description',
            key: 'description',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <span>{item.remarks }</span>
                </span>
            ),
            ...filter.search('remarks','text', setFilterData, filterData, getForm),
            ...onCell,
        },
        {
            title: 'Remarks',
            key: 'remarks',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <span>{ item.forwarded_remarks }</span>
                </span>
            ),
            ...filter.search('forwarded_remarks','text', setFilterData, filterData, getForm),
            ...onCell,
        },

        // {
        //     title: "Action",
        //     key: "action",
        //     fixed: 'right',
        //     width: 60,
        //     align: "center",
        //     render: (text, item, index) => (
        //         <Dropdown overlay={menu(item, index)} trigger={['click']}>
        //             <Button size='small'>
        //                 <EllipsisOutlined />
        //             </Button>
        //         </Dropdown>
        //     ),
        // },
    ];

    const menu = (item, index) => (
        <Menu onClick={() => setSelectedFormRoute(item) }>
            <Menu.Item key="menu-view" icon={<FormOutlined />}  onClick={() => { viewForm(item, index) }}>
                View
            </Menu.Item>
        </Menu>
      );

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(sorter);
        console.log(filters);
        getForm({...filterData, ...filters})
    };

    const paginationChange = async (e) => {
        console.log(e);
        setFilterData(prev => ({...prev, page: e}));
        getForm({...filterData, page: e})
    }

    const closeForm = () => {
        setSelectedFormRoute({});
    }

    const openInFull = () => {
        window.open(`${selectedFormRoute.form_routable?.file}?view=1`,
                'newwindow',
                'width=960,height=1080');
            return false;
    }




    
    return (
        <div className='row' style={{minHeight: "50vh"}}>
            <Row gutter={[16, 16]} className="mb-3">
                <Col md={24} lg={16} xl={18}>
                    <Card size="small" title="Disapproved Forms" bordered={false}>
                        <div className='forms-card-content'>
                            <Table
                                dataSource={dataSource}
                                columns={columns}
                                size={"small"}
                                loading={{spinning: tableLoading, tip: "Loading..."}}
                                pagination={false}
                                onChange={handleTableChange}
                                scroll={{ y: "60vh" }}
                                rowClassName={(record, index) => {
                                    if(selectedFormRoute.id == record.id){
                                        return "selected-row";
                                    }
                                }}
                            />
                            <div className="flex justify-end mt-2">
                                {/* <b>{process.env.REACT_APP_PRODUCTION_URL}</b> */}
                                <Pagination
                                        current={paginationMeta?.current_page || 1}
                                        total={paginationMeta?.total || 1}
                                        pageSize={paginationMeta?.per_page || 1}
                                        onChange={paginationChange}
                                        // showSizeChanger
                                        showQuickJumper
                                        size="small"
                                        // onShowSizeChange={(current, size) => changePageSize(current, size)}
                                    />
                            </div>
                        </div>
                    </Card>
                </Col>
                { isEmpty(selectedFormRoute) || selectedFormRoute.form_routable.file == "" ? "" : (
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
                                    <span><b>Form type:</b> <i>{selectedFormRoute.route_type_str}</i></span><br />
                                    <span><b>Title:</b> <i>{selectedFormRoute.form_routable?.title}</i></span><br />
                                    <span><b>End User:</b> <i>{selectedFormRoute.end_user.name}</i></span><br />
                                    <span><b>Purpose:</b> <i>{selectedFormRoute.form_routable?.purpose}</i></span><br />
                                    <span><b>Amount:</b> <i>{selectedFormRoute.form_routable?.total_cost_formatted}</i></span><br />
                                    <span><b>Forwarded by:</b> <i>{selectedFormRoute.from_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${selectedFormRoute.from_office?.name}` : selectedFormRoute.from_office?.name }</i></span><br />
                                    <span><b>Forwarded to:</b> <i>{selectedFormRoute.to_office?.library_type == 'technical_working_group' ? `Techinical Working Group: ${selectedFormRoute.to_office?.name}` : selectedFormRoute.to_office?.name }</i></span><br />
                                    <span><b>Description:</b> <i>{selectedFormRoute.remarks}</i><br /></span>
                                    <span><b>Remarks:</b> <i>{selectedFormRoute.forwarded_remarks}</i><br /></span>
                                    <br />
                                    <span><b>Status:</b> <i>{ selectedFormRoute.status }</i></span><br />
                                    <span><b>Action Taken:</b> <i>{ selectedFormRoute.action_taken }</i></span><br />
                                </p>
                                
                            </div>
                        </Card>
                    </Col>
                )  }
            </Row>
            { isEmpty(selectedFormRoute) || selectedFormRoute.form_routable.file == "" ? "" : (
            <Row gutter={[16, 16]} className="mb-3">
                <Col span={24}>
                    <Card size="small" title="Disapproved Form" bordered={false}>
                        <div className='forms-card-form-content'>
                            <iframe src={`${selectedFormRoute.form_routable?.file}?view=1`} style={{height: "100%", width: "100%"}}></iframe>
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
  )(DisapprovedForm);
