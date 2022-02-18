import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import style from './style.less'
import api from '../../api';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import { Tag, Checkbox, Button, Select, Table, Card, Col, Row, Tooltip } from 'antd';
import {
    SettingOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MoreOutlined,
    EllipsisOutlined,
    FormOutlined,
    MessageOutlined,
} from '@ant-design/icons';


const { Option, OptGroup } = Select;

function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        suppliers: state.supplier.suppliers,
        isInitialized: state.user.isInitialized,
        selectedSupplier: state.quotation.selectedSupplier,
        selectedSuppliers: state.quotation.selectedSuppliers,
        selectedSupplierContact: state.quotation.selectedSupplierContact,
    };
}

const Quotation = (props) => {
    useEffect(() => {
        document.title = "List of Purchase Request";
        if(props.isInitialized){
            if(isEmpty(props.suppliers)){
                getSuppliers();
            }
        }
    }, [props.isInitialized]);
    const getSuppliers = debounce(() => {
        api.Supplier.all()
        .then(res => {
            // setSuppliers(res.data.data);'
            let responseSupplier = res.data.data;
            responseSupplier.map(i => {
                i.selected = false;
                i.selectedContact = i.contacts.data[0]
                i.selectedContactId = i.contacts.data[0].id
                return i;
            })
            props.dispatch({
                type: "SET_SUPPLIERS",
                data: responseSupplier
            });
        })
        .catch(err => {
            // setLoading(false);
        })
        .then(res => {})
        ;
    }, 150);
    const handleSelect = (e, item) => {
        let clonedSuppliers = cloneDeep(props.suppliers);
        let supplierIndex = clonedSuppliers.findIndex(i => i.id == item.id);
        let checked = e.target.checked;
        clonedSuppliers[supplierIndex] = {
            ...item,
            selected: checked
        }
        props.dispatch({
            type: "SET_SUPPLIERS",
            data: clonedSuppliers
        });
    }

    const columns = [
        {
            title: "",
            key: 'select_user',
            width: 50,
            fixed: 'left',
            render: (text, item, index) => (
                <span>
                    <Checkbox onChange={(e) => handleSelect(e, item)} checked={item.selected} ></Checkbox>
                </span>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            fixed: 'left',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 250,
        },
        {
            title: 'Contact Person',
            key: 'contact',
            width: 250,
            render: (text, item, index) => (
                <span>
                    <Tooltip placement="left" title={(
                        <>
                            { item.selectedContact.email_address } <br />
                            { item.selectedContact.contact_number }
                        </>
                    )}>
                        { item.selectedContact.name }
                    </Tooltip>
                </span>
            )
        },
        {
            title: 'Categories',
            key: 'categories',
            width: 500,
            render: (text, item, index) => (
                <span>
                    { item.categories.data.map(i => {
                        return (
                            <Tag key={i.key}>
                                {i.category?.name}
                            </Tag>
                        );
                    }) }
                </span>
            )
        },
    ]


    return (
        <div>
            <Row gutter={[16, 16]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={10} xl={8}>
                    <Card size="small" title="Puchase Requests" bordered={false}>
                        <div className='quotation-main-card-content'>
                            <div style={{ height: "85vh" }}>
                                <iframe src={`${props.selectedPurchaseRequest.file}?view=1`} style={{width: "100%", height: "100%"}}></iframe>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={24} lg={14} xl={16}>
                    <Row gutter={[16, 16]} className="mb-3">
                        <Col span={24}>
                            <Card size="small" title="Suppliers/Service Providers" bordered={false}>
                                <div className='quotation-side-card-content'>
                                    <div className='mb-2 space-x-2'>
                                        <Button type='primary'  icon={<MessageOutlined />}  disabled={props.suppliers.filter(i => i.selected).length == 0}>
                                            Make Quotation
                                        </Button>
                                        <span>Selected { props.suppliers.filter(i => i.selected).length } supplier(s)</span>
                                    </div>
                                    <Table size='small' scroll={{y: "25vh"}} dataSource={props.suppliers} columns={columns} />
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} className="mb-3">
                        <Col span={24}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={12}>
                                    <Card size="small" title="Purchase Request Information" bordered={false}>
                                        <div className='quotation-side-card-content'>
                                            <p>
                                                <b>PR No.:</b> {props.selectedPurchaseRequest?.purchase_request_number || ""} <br />
                                                <b>PR Date:</b> {props.selectedPurchaseRequest?.pr_date || ""} <br />
                                                <b>Procurement Type:</b> {props.selectedPurchaseRequest.purchase_request_type?.name || ""} <br />
                                                <b>Mode of Procurement:</b> {props.selectedPurchaseRequest.mode_of_procurement?.name || ""} <br />
                                                <b>End User:</b> {props.selectedPurchaseRequest?.end_user?.name || ""} <br />
                                                <b>Fund Cluster:</b> {props.selectedPurchaseRequest?.fund_cluster || ""} <br />
                                                <b>Responsibility Center Code:</b> {props.selectedPurchaseRequest?.center_code || ""} <br />
                                                <b>Total Unit Cost:</b> {props.selectedPurchaseRequest?.total_cost_formatted || ""} <br />
                                                <b>Purpose:</b> {props.selectedPurchaseRequest?.purpose || ""} <br />
                                                <b>Charge To:</b> {props.selectedPurchaseRequest?.charge_to || ""} <br />
                                                <b>Alloted Amount:</b> {props.selectedPurchaseRequest?.alloted_amount || ""} <br />
                                                <b>UACS Code:</b> {props.selectedPurchaseRequest?.uacs_code || ""} <br />
                                                <b>SA/OR:</b> {props.selectedPurchaseRequest?.sa_or || ""} <br />
                                            </p>
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={24} md={12}>
                                    <Card size="small" title="Bids and Awards Committee Information" bordered={false}>
                                        <div className='quotation-side-card-content'>
                                            <p>
                                                <b>Pre-Proc Conference:</b> {props.selectedPurchaseRequest?.bac_task?.preproc_conference || ""} <br />
                                                <b>Ads/Post of IB:</b> {props.selectedPurchaseRequest?.bac_task?.post_of_ib || ""} <br />
                                                <b>Pre-bid Conf:</b> {props.selectedPurchaseRequest?.bac_task?.prebid_conf || ""} <br />
                                                <b>Pre-bid Conf:</b> {props.selectedPurchaseRequest?.bac_task?.eligibility_check || ""} <br />
                                                <b>Sub/Open of Bids:</b> {props.selectedPurchaseRequest?.bac_task?.open_of_bids || ""} <br />
                                                <b>Bid Evaluation:</b> {props.selectedPurchaseRequest?.bac_task?.bid_evaluation || ""} <br />
                                                <b>Post Qual:</b> {props.selectedPurchaseRequest?.bac_task?.post_qual || ""} <br />
                                                <b>Notice of Award:</b> {props.selectedPurchaseRequest?.bac_task?.notice_of_award || ""} <br />
                                                <b>Contract Signing:</b> {props.selectedPurchaseRequest?.bac_task?.contract_signing || ""} <br />
                                                <b>Notice to Proceed:</b> {props.selectedPurchaseRequest?.bac_task?.notice_to_proceed || ""} <br />
                                                <b>Estimated LDD:</b> {props.selectedPurchaseRequest?.bac_task?.estimated_ldd || ""} <br />
                                                <b>Abstract of Quotations:</b> {props.selectedPurchaseRequest?.bac_task?.abstract_of_qoutations || ""} <br />
                                            </p>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Quotation);
