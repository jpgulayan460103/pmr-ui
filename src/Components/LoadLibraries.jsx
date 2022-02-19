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
        mainLoading: state.user.mainLoading,
        isInitialized: state.user.isInitialized,
    };
}

const Loadlibraries = (props) => {
    useEffect(async () => {
        if(!props.isInitialized){
            props.dispatch({
                type: "SET_MAIN_LOADING_MESSAGE",
                data: "Loading Libraries..."
            });
            if(!props.isLibrariesLoaded){
                await getLibraries();
            }
            if(isEmpty(props.user)){
                if (sessionStorage.getItem("session") !== null) {
                    props.dispatch({
                        type: "SET_MAIN_LOADING_MESSAGE",
                        data: "Loading User Data..."
                    });
                    await getUser();
                }
            }
            
            await props.dispatch({
                type: "LOAD_LIBRARIES",
                data: []
            });
    
            await props.dispatch({
                type: "SET_MAIN_LOADING",
                data: false
            });

            await props.dispatch({
                type: "SET_INITIALIZED",
                data: true
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
        }
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

    const getUser = async () => {
        return api.User.auth()
        .then(res => {
            props.dispatch({
                type: "SET_USER_DATA",
                data: res.data
            });
        })
        .catch(err => {
            console.log("session");
        })
        .then(res => {})
    }
    return (
        <></>
    );
}

export default connect(
    mapStateToProps,
  )(Loadlibraries);
