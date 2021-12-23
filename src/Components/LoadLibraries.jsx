import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../api';
import { isEmpty } from 'lodash';

function mapStateToProps(state) {
    return {
        unit_of_measures: state.library.unit_of_measures,
        items: state.library.items,
        sections: state.library.sections,
    };
}

const Loadlibraries = (props) => {
    useEffect(() => {
        if(isEmpty(props.unit_of_measures)){
            getUnitOfMeasures();
        }
        if(isEmpty(props.unit_of_measures)){
            getItems();
        }
        if(isEmpty(props.sections)){
            getSections();
        }
    }, []);

    const getUnitOfMeasures = () => {
        api.Library.getLibraries('unit_of_measure')
        .then(res => {
            props.dispatch({
                type: "SET_LIBRARY_UNIT_OF_MEASURES",
                data: res.data.data
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
