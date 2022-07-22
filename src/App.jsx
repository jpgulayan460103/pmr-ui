// https://mail.google.com/mail/?view=cm&fs=1&to=ictsupport.fo11@dswd.gov.ph&su=Request%20technical%20assistance%20for%20&body=Issue:%0AName:%0AOffice:

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  Redirect,
  BrowserRouter,
} from "react-router-dom";
import './App.less';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-image-lightbox/style.css';
import Layout from './Layouts/Main'
import Login from './Pages/Login/Login'
import CreatePurchaseRequest from './Pages/PurchaseRequest/CreatePurchaseRequest'
import ListPurchaseRequest from './Pages/PurchaseRequest/ListPurchaseRequest'
import ListLibrary from './Pages/Library/ListLibrary'
import ItemLibrary from './Pages/Library/ItemLibrary'
import User from './Pages/User/User'
import PendingForm from './Pages/Forms/PendingForm';
import ApprovedForm from './Pages/Forms/ApprovedForm';
import DisapprovedForm from './Pages/Forms/DisapprovedForm';
import Procurement from './Pages/Procurement/Procurement'
import Quotation from './Pages/Quotation/Quotation';
import ActivityLogs from './Pages/ActivityLogs/ActivityLogs';
import Home from './Pages/Home/Home';
import Suppliers from './Pages/Suppliers/Suppliers';
import { compare } from 'compare-versions';

import { version } from '../package.json';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import CreateProcurementPlan from './Pages/ProcurementPlan/CreateProcurementPlan';
import ListProcurementPlan from './Pages/ProcurementPlan/ListProcurementPlan';
import SummaryProcurementPlan from './Pages/ProcurementPlan/SummaryProcurementPlan';
import CreateRequisitionIssue from './Pages/RequisitionIssue/CreateRequisitionIssue';
import ListRequisitionIssue from './Pages/RequisitionIssue/ListRequisitionIssue';
import Inventory from './Pages/Inventory/Inventory';
import Profile from './Pages/User/Profile';
import ReferencePurchaseRequest from './Pages/Forms/ReferencePurchaseRequest';
import ReferenceProcurementPlan from './Pages/Forms/ReferenceProcurementPlan';
import ReferenceRequisitionIssue from './Pages/Forms/ReferenceRequisitionIssue';
import Error404 from './Pages/Error404';
import { getTokens, onMessageListener } from './firebase';
import api from './api';
import PreviewForm from './Pages/Forms/PreviewForm';


const isProduction = process.env.NODE_ENV === 'production';

const auth = {
  isAuthenticated: false,
};
const PrivateRoute  = ({ children, ...props }) => {
  let location = useLocation();
  if (localStorage.getItem("auth_token") !== null) {
    auth.isAuthenticated = true;
  }
  if (!auth.isAuthenticated) {
    return <Redirect to="/login" />;
  }
  return children;
}

function mapStateToProps(state) {
    return {
        unit_of_measures: state.libraries.unit_of_measures,
        items: state.libraries.items,
        libraries: state.libraries.libraries,
        isLibrariesLoaded: state.libraries.isLibrariesLoaded,
        user_offices: state.libraries.user_offices,
        user: state.user.data,
        mainLoading: state.user.mainLoading,
        isInitialized: state.user.isInitialized,
        notifications: state.user.notifications,
    };
}


let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}

const App = (props) => {
    useEffect(async () => {
        if(props.isInitialized){
            if(!isEmpty(props.user)){
                getUserNotifications();
                document.addEventListener(visibilityChange, handleVisibilityChange, false);
                getTokens()
                .then((currentToken) => {
                    if (currentToken) {
                        console.log('current token for client: ', currentToken);
                        setFirebaseToken(currentToken);
                    } else {
                        console.warn('No registration token available. Request permission to generate one.');
                    }
                    }).catch((err) => {
                        console.warn('An error occurred while retrieving token. ', err);
                    });;
            }
        }
        return () => {
            document.removeEventListener(visibilityChange, handleVisibilityChange);
        }
    }, [props.isInitialized]);

    const setFirebaseToken = (token) => {
        api.User.saveFirebaseToken({token})
    }

    const getUserNotifications = debounce(() => {
        api.User.getNotifications()
        .then(res => {
            props.dispatch({
                type: "ADD_NOTIFICATION",
                data: res.data
            });
        })
        .catch(res => {})
        .then(res => {})
        ;
    }, 250)

    var debouncedGetNotification = React.useCallback(debounce(getUserNotifications, 400), []);

    const handleVisibilityChange = () => {
        if (document[hidden]) {
        } else {
            if(props.isInitialized){
                if(!isEmpty(props.user)){
                    debouncedGetNotification();
                }
            }
        }
    }

    return (

    <Switch>
            <Route exact path="/"  >
                <PrivateRoute><Layout><Home /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement"  >
                <PrivateRoute><Layout><Procurement /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement/suppliers"  >
                <PrivateRoute><Layout><Suppliers /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement/quotations"  >
                <PrivateRoute><Layout><Quotation /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement/quotations/form"  >
                <PrivateRoute><Layout><Quotation /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement/quotations"  >
                <PrivateRoute><Layout><Quotation /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement/quotations/suppliers"  >
                <PrivateRoute><Layout><Quotation /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/forms/pending"  >
                <PrivateRoute><Layout><PendingForm /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/forms/approved"  >
                <PrivateRoute><Layout><ApprovedForm /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/forms/disapproved"  >
                <PrivateRoute><Layout><DisapprovedForm /></Layout></PrivateRoute>
            </Route>
            <Route path={`/forms/preview/:uuid`} >
                <PrivateRoute><Layout><PreviewForm /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/forms/project-procurement-plans"  >
                <PrivateRoute><Layout><ReferenceProcurementPlan /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/forms/purchase-requests"  >
                <PrivateRoute><Layout><ReferencePurchaseRequest /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/forms/requisition-and-issue-slips"  >
                <PrivateRoute><Layout><ReferenceRequisitionIssue /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement-plans/form"  >
                <PrivateRoute><Layout><CreateProcurementPlan /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement-plans"  >
                <PrivateRoute><Layout><ListProcurementPlan /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/procurement-plans/summary"  >
                <PrivateRoute><Layout><SummaryProcurementPlan /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/requisition-and-issues/form"  >
                <PrivateRoute><Layout><CreateRequisitionIssue /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/requisition-and-issues"  >
                <PrivateRoute><Layout><ListRequisitionIssue /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/purchase-requests/form"  >
                <PrivateRoute><Layout><CreatePurchaseRequest /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/purchase-requests"  >
                <PrivateRoute><Layout><ListPurchaseRequest /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries"  >
                <PrivateRoute><Layout><ListLibrary /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/items">
                <PrivateRoute><Layout><ItemLibrary /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/items/categories"  >
                <PrivateRoute><Layout><ListLibrary libraryType="item_category" options={{libraryName: "Item Category", parent: true, parentLabel: "Item Classification", parentType: "item_classification"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/items/measures"  >
                <PrivateRoute><Layout><ListLibrary libraryType="unit_of_measure" options={{libraryName: "Unit of Measure"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/uacs-codes"  >
                <PrivateRoute><Layout><ListLibrary libraryType="uacs_code" options={{libraryName: "UACS Code", title: true}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/offices/divisions"  >
                <PrivateRoute><Layout><ListLibrary libraryType="user_division" options={{libraryName: "Office Division",parent: true, title: true, parentLabel: "Division", parentType: "user_division"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/offices/sections"  >
                <PrivateRoute><Layout><ListLibrary libraryType="user_section" options={{libraryName: "Office Section",parent: true, title: true, parentLabel: "Division", parentType: "user_division"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/offices/signatories"  >
                <PrivateRoute><Layout><ListLibrary libraryType="user_section_signatory" options={{libraryName: "Office Signatories",parent: true, title: true, parentLabel: "Section", parentType: "user_section"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/user/positions"  >
                <PrivateRoute><Layout><ListLibrary libraryType="user_position" options={{libraryName: "User Positions", title: true}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/users"  >
                <PrivateRoute><Layout><User /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/profile"  >
                <PrivateRoute><Layout><Profile /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/activity-logs"  >
                <PrivateRoute><Layout><ActivityLogs /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/inventory"  >
                <PrivateRoute><Layout><Inventory /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/login"  >
                <Login />
            </Route>
            <Route exact path="/logout"  >
                <Login />
            </Route>
            <Route exact path="*"  >
                <PrivateRoute><Layout><Error404></Error404></Layout></PrivateRoute>
            </Route>
            </Switch>
    );
}

export default connect(
    mapStateToProps,
  )(App);

