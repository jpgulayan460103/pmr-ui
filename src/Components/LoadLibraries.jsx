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
        getUsers();
    }, []);

    const getLibraries = () => {
        api.Library.all()
        .then(res => {
            let libraries = res.data.data;
            let user_division = libraries.filter(library => library.type == "user_division");
            let user_section = libraries.filter(library => library.type == "user_section");
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
                data: libraries.filter(library => library.type == "unit_of_measure")
            });
            props.dispatch({
                type: "SET_LIBRARY_ITEM_CATEGORIES",
                data: libraries.filter(library => library.type == "item_category")
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_POSITIONS",
                data: libraries.filter(library => library.type == "user_position")
            });
            props.dispatch({
                type: "SET_LIBRARY_USER_AREA_OF_ASSIGNMENTS",
                data: libraries.filter(library => library.type == "user_area_of_assignment")
            });

            // props.dispatch({
            //     type: "SET_LIBRARY_DIVISION_SECTION_TREE",
            //     data: user_division
            // });
            
            // user_division = user_division.map(division => {
            //     division['child'] = user_section.filter(section => section.parent.name == division.name)
            //     return division;
            // });
            // console.log(user_division);
            
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

    const getUsers = () => {
        api.User.all();
    }
    return (
        <div>
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(Loadlibraries);
