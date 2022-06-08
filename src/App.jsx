import React, { useEffect } from 'react';
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
import Echo from 'laravel-echo';
import ForwardedForm from './Pages/Forms/ForwardedForm';
import ApprovedForm from './Pages/Forms/ApprovedForm';
import DisapprovedForm from './Pages/Forms/DisapprovedForm';
import Procurement from './Pages/Procurement/Procurement'
import Quotation from './Pages/Quotation/Quotation';
import ActivityLogs from './Pages/ActivityLogs/ActivityLogs';
import Home from './Pages/Home/Home';
import Suppliers from './Pages/Suppliers/Suppliers';
import { compare } from 'compare-versions';

import { version } from '../package.json';
import { cloneDeep } from 'lodash';
import CreateProcurementPlan from './Pages/ProcurementPlan/CreateProcurementPlan';
import ListProcurementPlan from './Pages/ProcurementPlan/ListProcurementPlan';
import SummaryProcurementPlan from './Pages/ProcurementPlan/SummaryProcurementPlan';

const isProduction = process.env.NODE_ENV === 'production';

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: (process.env.NODE_ENV == "development" ? process.env.REACT_APP_PUSHER_APP_KEY_PRODUCTION : process.env.REACT_APP_PUSHER_APP_KEY_DEVEOPMENT),
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    forceTLS: false,
    wsHost: (process.env.NODE_ENV == "development" ? process.env.REACT_APP_DEVELOPMENT_WS_HOST : process.env.REACT_APP_PRODUCTION_WS_HOST),
    wsPort: 6001,
});
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

const App = (props) => {

    useEffect(() => {
        if(isProduction){
            let app_version = version;
            if(localStorage.getItem("app_version") != null){
                app_version = localStorage.getItem("app_version");
            }else{
                localStorage.setItem('app_version',version);
            }
            if(compare(version, app_version, ">")){
                console.log("refresh");
                localStorage.setItem('app_version',version);
                setTimeout(() => {
                    window.location.reload(true)
                }, 500);
            }
        }
        window.Echo.channel('home').listen('NewMessage', (e) => {
            // var notification = new Notification(e.message);
            console.log(e);
            if(sessionStorage.getItem("user_office") == e.message.notify_offices){
                let clonedNotif = cloneDeep(props.notifications)
                switch (e.message.notification_type) {
                    case "approved_form":
                        clonedNotif.push({
                            notification_type: e.message.notification_type,
                            notification_title: e.message.notification_title,
                            notification_message: e.message.notification_message,
                            notification_data: e.message.notification_data,
                            // data: e.message.form_route,
                        })
                        break;
                    case "rejected_form":
                        clonedNotif.push({
                            notification_title: e.message.notification_title,
                            notification_type: e.message.notification_type,
                            notification_message: e.message.notification_message,
                            notification_data: e.message.notification_data,
                            // // data: e.message.form_route,
                        })
                        break;
                
                    default:
                        break;
                }
                props.dispatch({
                    type: "ADD_NOTIFICATION",
                    data: clonedNotif
                });
            }
          });
    }, []);

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
            <Route exact path="/forms/forwarded"  >
                <PrivateRoute><Layout><ForwardedForm /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/forms/approved"  >
                <PrivateRoute><Layout><ApprovedForm /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/forms/disapproved"  >
                <PrivateRoute><Layout><DisapprovedForm /></Layout></PrivateRoute>
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
                <PrivateRoute><Layout><ListLibrary libraryType="item_category" options={{libraryName: "Item Category"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/items/measures"  >
                <PrivateRoute><Layout><ListLibrary libraryType="unit_of_measure" options={{libraryName: "Unit of Measure"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/uacs_code"  >
                <PrivateRoute><Layout><ListLibrary libraryType="uacs_code" options={{libraryName: "UACS Code", title: true}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/offices/divisions"  >
                <PrivateRoute><Layout><ListLibrary libraryType="user_division" options={{libraryName: "Office Division",parent: true, title: true, parentLabel: "Division", parentType: "user_division"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/offices/sections"  >
                <PrivateRoute><Layout><ListLibrary libraryType="user_section" options={{libraryName: "Office Section",parent: true, title: true, parentLabel: "Division", parentType: "user_division"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/user_offices/administrators"  >
                <PrivateRoute><Layout><ListLibrary libraryType="user_signatory_name" options={{libraryName: "Office Administrators",parent: true, title: true, parentLabel: "Designation", parentType: "user_signatory_designation"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/libraries/user_offices/administrators/designations"  >
                <PrivateRoute><Layout><ListLibrary libraryType="user_signatory_designation" options={{libraryName: "Office Administrator's Designation",parent: true, title: true, parentLabel: "Designation", parentType: "user_section"}} /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/users"  >
                <PrivateRoute><Layout><User /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/activity-logs"  >
                <PrivateRoute><Layout><ActivityLogs /></Layout></PrivateRoute>
            </Route>
            <Route exact path="/login"  >
                <Login />
            </Route>
            <Route exact path="/logout"  >
                <Login />
            </Route>
            <Route exact path="*"  >
                <PrivateRoute><Layout></Layout></PrivateRoute>
            </Route>
            </Switch>
    );
}

export default connect(
    mapStateToProps,
  )(App);

