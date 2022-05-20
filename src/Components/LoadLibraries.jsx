import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../api';
import { isEmpty } from 'lodash';

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
                // await getLibraries();
                await getAllLibraries();
                // getLibraries("user_division");
                // getLibraries("user_section");
                // getLibraries("unit_of_measure");
                // getLibraries("item_category");
                // getLibraries("user_position");
                // getLibraries("user_area_of_assignment");
                // getLibraries("account");
                // getLibraries("account_classification");
                // getLibraries("mode_of_procurement");
                // getLibraries("technical_working_group");
                // getLibraries("user_signatory_designation");
                // getLibraries("user_signatory_name");
                // getLibraries("uacs_code");
                // getLibraries("procurement_type");
            }
            if(isEmpty(props.user)){
                if (localStorage.getItem("session") !== null) {
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
    

        }
    }, []);

    const getLibraries = async ($type) => {
        return api.Library.getLibraries($type)
        .then(res => {
            let libraries = res.data.data;
            libraries = libraries.filter(i => i.is_active);
            if($type == "user_division"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_DIVISIONS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_section"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_SECTION",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "unit_of_measure"){
                props.dispatch({
                    type: "SET_LIBRARY_UNIT_OF_MEASURES",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "item_category"){
                props.dispatch({
                    type: "SET_LIBRARY_ITEM_CATEGORIES",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_position"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_POSITIONS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_area_of_assignment"){
                props.dispatch({
                    type: "SET_LIBRARY_USER_AREA_OF_ASSIGNMENTS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "account"){
                props.dispatch({
                    type: "SET_LIBRARY_ACCOUNTS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "account_classification"){
                props.dispatch({
                    type: "SET_LIBRARY_ACCOUNT_CLASSIFICATIONS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "mode_of_procurement"){
                props.dispatch({
                    type: "SET_LIBRARY_MODE_OF_PROCUREMENT_TYPES",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }

            if($type == "technical_working_group"){
                props.dispatch({
                    type: "SET_LIBRARY_TECHNICAL_WORKING_GROUPS",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }

            if($type == "user_signatory_designation"){
                props.dispatch({
                    type: "SET_LIBRARY_SIGNATORY_DESIGNATION",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "user_signatory_name"){
                props.dispatch({
                    type: "SET_LIBRARY_SIGNATORY_NAME",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "uacs_code"){
                props.dispatch({
                    type: "SET_LIBRARY_UACS_CODE",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            if($type == "procurement_type"){
                props.dispatch({
                    type: "SET_LIBRARY_PROCUREMENT_TYPE",
                    data: libraries.filter(library => library.library_type == $type)
                });
            }
            
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    const getAllLibraries = async () => {
        return api.Library.all()
        .then(res => {
            let libraries = res.data.data;
            libraries = libraries.filter(i => i.is_active);
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
                type: "SET_LIBRARY_ACCOUNTS",
                data: libraries.filter(library => library.library_type == "account")
            });
            props.dispatch({
                type: "SET_LIBRARY_ACCOUNT_CLASSIFICATIONS",
                data: libraries.filter(library => library.library_type == "account_classification")
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
            props.dispatch({
                type: "SET_LIBRARY_UACS_CODE",
                data: libraries.filter(library => library.library_type == "uacs_code")
            });
            props.dispatch({
                type: "SET_LIBRARY_PROCUREMENT_TYPE",
                data: libraries.filter(library => library.library_type == "procurement_type")
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
            let userOffice = res?.data?.user_offices?.data[0]?.office?.id;
            sessionStorage.setItem("user_office", userOffice);
        })
        .catch(err => {
            if(err.response.status == 401 || err.response.status == 429){
                
            }else{
                getUser();
            }
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
