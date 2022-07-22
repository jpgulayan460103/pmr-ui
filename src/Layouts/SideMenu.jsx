import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import Icon, {
    UserOutlined,
    FileSearchOutlined,
    DatabaseOutlined,
    DashboardOutlined,
    ShoppingCartOutlined,
    ReconciliationOutlined,
    ShopOutlined,
  } from '@ant-design/icons';
import { Link, useLocation  } from 'react-router-dom'
import helpers from '../Utilities/helpers';
import FormsSvg from '../Icons/FormsSvg';
import LogsSvg from '../Icons/LogsSvg';
import LibrarySvg from '../Icons/LibrarySvg';

const { SubMenu } = Menu;

function mapStateToProps(state) {
    return {
        purchaseRequestFormType: state.purchaseRequests.create.formType,
        requisitionIssueFormType: state.requisitionIssues.create.formType,
        procurementPlanFormType: state.procurementPlans.create.formType,
        user: state.user.data,
    };
}


const Sidemenu = (props) => {
    const location = useLocation();
    const [defaultKey, setDefaultKey] = useState('/');
    useEffect(() => {
        setDefaultKey(location.pathname);
    }, [location.pathname]);

    const procurementSubMenu = [
        {
            key: '/procurement/quotations',
            label: (
                <React.Fragment>
                    <Link to="/procurement/quotations"></Link>
                    Quotations
                </React.Fragment>
            )
        },
        {
            key: '/procurement/suppliers',
            label: (
                <React.Fragment>
                    <Link to="/procurement/suppliers"></Link>
                    Suppliers
                </React.Fragment>
            )
        },
    ];

    if(helpers.hasPermission(props.user, ['procurement.view']) || helpers.hasRole(props.user, ["super-admin"])){
        procurementSubMenu.unshift({
            key: '/procurement',
            label: (
                <React.Fragment>
                    <Link to="/procurement"></Link>
                    Procurement
                </React.Fragment>
            )
        });
    }

    const formSubMenu = [];
    if(helpers.hasPermission(props.user, [
        'forms.approve.procurement.plan',
        'forms.approve.purchase.request',
        'forms.approve.requisition.issue',
        'forms.review',
        'forms.resolve',
        'forms.issue.requisition.issue',
    ]) ||  helpers.hasRole(props.user, ["super-admin"])){
        formSubMenu.push({
            key: "/forms/pending",
            label: (
                <React.Fragment>
                    <Link to="/forms/pending"></Link>
                    Pending Forms
                </React.Fragment>
            ),
        });
        formSubMenu.push({
            key: "/forms/approved",
            label: (
                <React.Fragment>
                    <Link to="/forms/approved"></Link>
                    Approved Forms
                </React.Fragment>
            ),
        });

        formSubMenu.push({
            key: "/forms/disapproved",
            label: (
                <React.Fragment>
                    <Link to="/forms/disapproved"></Link>
                    Disapproved Forms
                </React.Fragment>
            ),
        });
    }

    if(helpers.hasPermission(props.user, ['forms.purchase.request.view']) ||  helpers.hasRole(props.user, ["super-admin"])){
        formSubMenu.push({
            key: "/forms/purchase-requests",
            label: (
                <React.Fragment>
                    <Link to="/forms/purchase-requests"></Link>
                    All Purchase Requests
                </React.Fragment>
            ),
        });
    }

    if(helpers.hasPermission(props.user, ['forms.procurement.plan.view']) ||  helpers.hasRole(props.user, ["super-admin"])){
        formSubMenu.push({
            key: "/forms/project-procurement-plans",
            label: (
                <React.Fragment>
                    <Link to="/forms/project-procurement-plans"></Link>
                    All Project Procurment Plans
                </React.Fragment>
            ),
        });
    }

    if(helpers.hasPermission(props.user, ['forms.requisition.issue.view']) ||  helpers.hasRole(props.user, ["super-admin"])){
        formSubMenu.push({
            key: "/forms/requisition-and-issue-slips",
            label: (
                <React.Fragment>
                    <Link to="/forms/requisition-and-issue-slips"></Link>
                    All Requisition and Issue Slips
                </React.Fragment>
            ),
        });
    }


    const procurementPlanSubMenu = [
        {
            key: "/procurement-plans/summary",
            label: (
                <React.Fragment>
                    <Link to="/procurement-plans/summary"></Link>
                    Summary of PPMP
                </React.Fragment>
            )
        }
    ];

    if(helpers.hasPermission(props.user, ['procurement.plan.create','procurement.plan.update']) || helpers.hasRole(props.user, ["super-admin"])){
        procurementPlanSubMenu.push({
            key: "/procurement-plans/form",
            label: (
                <React.Fragment>
                    <Link to="/procurement-plans/form"></Link>
                    { props.procurementPlanFormType == "create" ? "Create" : "Edit" } PPMP
                </React.Fragment>
            ),
        });
    }
    if(helpers.hasPermission(props.user, ['procurement.plan.view']) || helpers.hasRole(props.user, ["super-admin"])){
        procurementPlanSubMenu.push({
            key: "/procurement-plans",
            label: (
                <React.Fragment>
                    <Link to="/procurement-plans"></Link>
                    View Created PPMP
                </React.Fragment>
            ),
        });
    }

    const requisitionPlanSubMenu = [];

    if(helpers.hasPermission(props.user, ['requisition.issue.create','requisition.issue.update']) || helpers.hasRole(props.user, ["super-admin"])){
        requisitionPlanSubMenu.push({
            key: "/requisition-and-issues/form",
            label: (
                <React.Fragment>
                    <Link to="/requisition-and-issues/form"></Link>
                    { props.requisitionIssueFormType == "create" ? "Create" : "Edit" } RIS
                </React.Fragment>
            ),
        });
    }
    if(helpers.hasPermission(props.user, ['requisition.issue.view']) || helpers.hasRole(props.user, ["super-admin"])){
        requisitionPlanSubMenu.push({
            key: "/requisition-and-issues",
            label: (
                <React.Fragment>
                    <Link to="/requisition-and-issues"></Link>
                    View Created RIS
                </React.Fragment>
            ),
        });
    }

    const purchaseRequestSubMenu = [];
    if(helpers.hasPermission(props.user, ['purchase.request.create','purchase.request.update']) || helpers.hasRole(props.user, ["super-admin"])){
        purchaseRequestSubMenu.push({
            key: "/purchase-requests/form",
            label: (
                <React.Fragment>
                    <Link to="/purchase-requests/form"></Link>
                    { props.purchaseRequestFormType == "create" ? "Create" : "Edit" } Purchase Request
                </React.Fragment>
            ),
        });
    }
    if(helpers.hasPermission(props.user, ['purchase.request.view']) || helpers.hasRole(props.user, ["super-admin"])){
        purchaseRequestSubMenu.push({
            key: "/purchase-requests",
            label: (
                <React.Fragment>
                    <Link to="/purchase-requests"></Link>
                    View Created Purchase Request
                </React.Fragment>
            ),
        });
    }

    const librarySubMenu = [];

    if(helpers.hasPermission(props.user, ['libraries.uom.view']) || helpers.hasRole(props.user, ["super-admin"])){
        librarySubMenu.push({
            key: "/libraries/items/measures",
            label: (
                <React.Fragment>
                    <Link to="/libraries/items/measures"></Link>
                    Unit of Measures
                </React.Fragment>
            ),
        });
    }
    if(helpers.hasPermission(props.user, ['libraries.uacs.view']) || helpers.hasRole(props.user, ["super-admin"])){
        librarySubMenu.push({
            key: "/libraries/uacs-codes",
            label: (
                <React.Fragment>
                    <Link to="/libraries/uacs-codes"></Link>
                    UACS Codes
                </React.Fragment>
            ),
        });
    }
    if(helpers.hasPermission(props.user, ['libraries.user.signatories.view']) || helpers.hasRole(props.user, ["super-admin"])){
        librarySubMenu.push({
            key: "/libraries/offices/signatories",
            label: (
                <React.Fragment>
                    <Link to="/libraries/offices/signatories"></Link>
                    Office Signatories
                </React.Fragment>
            ),
        });
    }
    if(helpers.hasRole(props.user, ["super-admin"])){
        librarySubMenu.push({
            key: "/libraries/user/positions",
            label: (
                <React.Fragment>
                    <Link to="/libraries/user/positions"></Link>
                    User Positions
                </React.Fragment>
            ),
        });
        librarySubMenu.push({
            key: "/libraries/offices/divisions",
            label: (
                <React.Fragment>
                    <Link to="/libraries/offices/divisions"></Link>
                    Office Divisions
                </React.Fragment>
            ),
        });
        librarySubMenu.push({
            key: "/libraries/offices/sections",
            label: (
                <React.Fragment>
                    <Link to="/libraries/offices/sections"></Link>
                    Office Sections
                </React.Fragment>
            ),
        });
        librarySubMenu.push({
            key: "/libraries/items/categories",
            label: (
                <React.Fragment>
                    <Link to="/libraries/items/categories"></Link>
                    Item Categories
                </React.Fragment>
            ),
        });
        librarySubMenu.push({
            key: "/libraries/items",
            label: (
                <React.Fragment>
                    <Link to="/libraries/items"></Link>
                    Items (Annex A)
                </React.Fragment>
            ),
        });
    }

    const items = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: (
                <React.Fragment>
                    <Link to="/"></Link>
                    Dashboard
                </React.Fragment>
            )
        },
    ];
    //Procurement
    if(
        helpers.hasPermission(props.user, [
            'procurement.view'
        ])
        ||
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: 'submenu-procurement',
            icon: <ShopOutlined />,
            label: "Procurement",
            children: procurementSubMenu,
        });
    }
    //Forms
    if(
        helpers.hasPermission(props.user, [
            'forms.purchase.request.view',
            'forms.procurement.plan.view',
            'forms.requisition.issue.view',
            'forms.approve.procurement.plan',
            'forms.approve.purchase.request',
            'forms.approve.requisition.issue',
            'forms.review',
            'forms.review',
            'forms.review',
            'forms.issue.requisition.issue',
        ])
        || 
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: 'submenu-form-monitoring',
            icon: <Icon component={FormsSvg} />,
            label: "Forms",
            children: formSubMenu,
        });
    }
    //Procurement Plans
    if(
        helpers.hasPermission(props.user, [
            'procurement.plan.create',
            'procurement.plan.update',
            'procurement.plan.view',
        ])
        || 
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: 'submenu-procurement-plan',
            icon: <DatabaseOutlined />,
            label: "PPMP",
            children: procurementPlanSubMenu,
        });
    }
    //Requisition Issue
    if(
        helpers.hasPermission(props.user, [
            'requisition.issue.create',
            'requisition.issue.update',
            'requisition.issue.view',
        ])
        || 
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: 'submenu-requisition-and-issue',
            icon: <FileSearchOutlined />,
            label: "RIS",
            children: requisitionPlanSubMenu,
        });
    }
    //Purchase Request
    if(
        helpers.hasPermission(props.user, [
            'purchase.request.create',
            'purchase.request.update',
            'purchase.request.view',
        ])
        || 
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: 'submenu-purchase-request',
            icon: <ShoppingCartOutlined />,
            label: "Purchase Requests",
            children: purchaseRequestSubMenu,
        });
    }
    //Users
    if(
        helpers.hasPermission(props.user, [
            'users.view',
        ])
        || 
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: '/users',
            icon: <UserOutlined />,
            label: (
                <React.Fragment>
                    <Link to="/users"></Link>
                    Users
                </React.Fragment>
            ),
        });
    }

    //Activity Logs
    if(
        helpers.hasPermission(props.user, [
            'activitylogs.view',
        ])
        || 
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: '/activity-logs',
            icon: <Icon component={LogsSvg} />,
            label: (
                <React.Fragment>
                    <Link to="/activity-logs"></Link>
                    Activity Logs
                </React.Fragment>
            ),
        });
    }
    //Inventory
    if(
        helpers.hasPermission(props.user, [
            'inventories.items.view',
        ])
        || 
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: '/inventory',
            icon: <ReconciliationOutlined />,
            label: (
                <React.Fragment>
                    <Link to="/inventory"></Link>
                    Inventory
                </React.Fragment>
            ),
        });
    }
    //Libraries
    if(
        helpers.hasPermission(props.user, [
            'libraries.user.signatories.view',
            'libraries.uom.view',
            'libraries.uacs.view',
        ])
        || 
        helpers.hasRole(props.user, ["super-admin"])
    ){
        items.push({
            key: 'submenu-libraries',
            icon: <Icon component={LibrarySvg} />,
            label: "Libraries",
            children: librarySubMenu,
        });
    }

    return (
        <React.Fragment>
            <Menu
                theme="light"
                mode="vertical"
                selectedKeys={[defaultKey]}
                items={items}
            />
        </React.Fragment>
    );
}

export default connect(
    mapStateToProps,
  )(Sidemenu);