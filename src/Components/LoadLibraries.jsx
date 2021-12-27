import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../api';
import { isEmpty } from 'lodash';

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
        items: state.library.items,
        libraries: state.library.libraries,
    };
}

const Loadlibraries = (props) => {
    useEffect(() => {
        if(isEmpty(props.unit_of_measures)){
            getItems();
        }
        if(isEmpty(props.libraries)){
            getLibraries();
        }
    }, []);

    const getLibraries = () => {
        api.Library.all()
        .then(res => {
            let libraries = res.data.data;
            props.dispatch({
                type: "SET_LIBRARY_USER_SECTION",
                data: libraries.filter(library => library.type == "user_section")
            });
            props.dispatch({
                type: "SET_LIBRARY_UNIT_OF_MEASURES",
                data: libraries.filter(library => library.type == "unit_of_measure")
            });
            props.dispatch({
                type: "SET_LIBRARY_ITEM_CATEGORIES",
                data: libraries.filter(library => library.type == "item_category")
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_DIVISIONS",
                data: libraries.filter(library => library.type == "user_division")
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_POSITIONS",
                data: libraries.filter(library => library.type == "user_position")
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_AREA_OF_ASSIGNMENTS",
                data: libraries.filter(library => library.type == "user_area_of_assignment")
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

    const getSections = () => {
        api.Library.getLibraries("user_section")
        .then(res => {
            props.dispatch({
                type: "SET_LIBRARY_USER_SECTION",
                data: res.data.data
            });
            props.dispatch({
                type: "SET_LIBRARY_UNIT_OF_MEASURES",
                data: res.data.data
            });
        })
        .catch(err => {})
        .then(res => {})
        ;
    }
    return (
        <div>
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Loadlibraries);
