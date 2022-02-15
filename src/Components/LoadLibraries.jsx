import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../api';
import { isEmpty } from 'lodash';

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
        items: state.library.items,
        libraries: state.library.libraries,
        isLibrariesLoaded: state.library.isLibrariesLoaded,
        user_offices: state.library.user_offices,
        user: state.user.data,
    };
}

const Loadlibraries = (props) => {
    useEffect(async () => {
        if(isEmpty(props.unit_of_measures)){
            await getItems();
        }
        if(!props.isLibrariesLoaded){
            await getLibraries();
        }
        if(isEmpty(props.user_offices)){
            await getUserOffice();
        }
        if(isEmpty(props.user)){
            if (sessionStorage.getItem("session") !== null) {
                await getUser();
            }
        }
        
        await props.dispatch({
            type: "LOAD_LIBRARIES",
            data: []
        });

        window.Echo.channel('home').listen('NewMessage', (e) => {
            console.log(e);
            // var notification = new Notification(e.message);
            // console.log(notification);
            props.dispatch({
                type: "ADD_NOTIFICATION",
                data: 0
            });
          });
    }, []);

    const getLibraries = async () => {
        return api.Library.all()
        .then(res => {
            let libraries = res.data.data;
            props.dispatch({
                type: "SET_LIBRARY_USER_DIVISIONS",
                data: libraries.filter(library => library.library_type == "user_division")
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_SECTION",
                data: libraries.filter(library => library.library_type == "user_section")
            });
            props.dispatch({
                type: "SET_LIBRARY_UNIT_OF_MEASURES",
                data: libraries.filter(library => library.library_type == "unit_of_measure")
            });
            props.dispatch({
                type: "SET_LIBRARY_ITEM_CATEGORIES",
                data: libraries.filter(library => library.library_type == "item_category")
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_POSITIONS",
                data: libraries.filter(library => library.library_type == "user_position")
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_AREA_OF_ASSIGNMENTS",
                data: libraries.filter(library => library.library_type == "user_area_of_assignment")
            });
            props.dispatch({
                type: "SET_LIBRARY_PROCUREMENT_TYPES",
                data: libraries.filter(library => library.library_type == "procurement_type")
            });
            props.dispatch({
                type: "SET_LIBRARY_MODE_OF_PROCUREMENT_TYPES",
                data: libraries.filter(library => library.library_type == "mode_of_procurement")
            });

            props.dispatch({
                type: "SET_LIBRARY_TECHNICAL_WORKING_GROUPS",
                data: libraries.filter(library => library.library_type == "technical_working_group")
            });

            props.dispatch({
                type: "SET_LIBRARY_SIGNATORY_DESIGNATION",
                data: libraries.filter(library => library.library_type == "user_signatory_designation")
            });
            props.dispatch({
                type: "SET_LIBRARY_SIGNATORY_NAME",
                data: libraries.filter(library => library.library_type == "user_signatory_name")
            });
            
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const getItems = async () => {
        return api.Library.getLibraries('items')
        .then(res => {
            props.dispatch({
                type: "SET_LIBRARY_ITEMS",
                data: res.data.data
            });
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const getUserOffice = async () => {
        return api.UserOffice.all()
        .then(res => {
            let user_office = res.data.data;
            props.dispatch({
                type: "SET_LIBRARY_SIGNATORIES",
                data: user_office
            });
            // setDefualtPrUserOffice(user_office);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const setDefualtPrUserOffice = (user_office) => {
        let ord = user_office.filter(i => i.user_office_type == "ORD");
        ord = ord[0];
        let oarda = user_office.filter(i => i.user_office_type == "OARDA");
        oarda = oarda[0];
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_REQUESTED_BY_SIGNATORY",
            data: oarda
        });
        props.dispatch({
            type: "SET_PURCHASE_REQUEST_APPROVED_BY_SIGNATORY",
            data: ord
        });
    }

    const getUser = async () => {
        return api.User.auth()
        .then(res => {
            props.dispatch({
                type: "SET_USER_DATA",
                data: res.data
            });
        })
        .catch(err => {})
        .then(res => {})
    }
    return (
        <></>
    );
}

export default connect(
    mapStateToProps,
  )(Loadlibraries);
