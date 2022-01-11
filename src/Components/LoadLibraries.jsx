import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../api';
import { isEmpty } from 'lodash';

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
        items: state.library.items,
        libraries: state.library.libraries,
        isLibrariesLoadedd: state.library.isLibrariesLoadedd,
        signatories: state.library.signatories,
    };
}

const Loadlibraries = (props) => {
    useEffect(() => {
        if(isEmpty(props.unit_of_measures)){
            getItems();
        }
        if(!props.isLibrariesLoadedd){
            getLibraries();
        }
        if(isEmpty(props.signatories)){
            getSignatories();
        }

        window.Echo.channel('home').listen('NewMessage', (e) => {
            console.log(e);
            var notification = new Notification(e.message);
            console.log(notification);
            props.dispatch({
                type: "ADD_NOTIFICATION",
                data: 0
            });
          });
    }, []);

    const getLibraries = () => {
        api.Library.all()
        .then(res => {
            let libraries = res.data.data;
            let user_division = libraries.filter(library => library.library_type == "user_division");
            let user_section = libraries.filter(library => library.library_type == "user_section");
            props.dispatch({
                type: "LOAD_LIBRARIES",
                data: []
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_DIVISIONS",
                data: user_division
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_SECTION",
                data: user_section
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
            
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const getItems = () => {
        api.Library.getLibraries('items')
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

    const getSignatories = () => {
        api.Signatories.all()
        .then(res => {
            let signatory = res.data.data;
            props.dispatch({
                type: "SET_LIBRARY_SIGNATORIES",
                data: signatory
            });
            setDefualtPrSignatories(signatory);
        })
        .catch(err => {})
        .then(res => {})
        ;
    }

    const setDefualtPrSignatories = (signatory) => {
        let ord = signatory.filter(i => i.signatory_type == "ORD");
        ord = ord[0];
        let oarda = signatory.filter(i => i.signatory_type == "OARDA");
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
    return (
        <div>
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Loadlibraries);
