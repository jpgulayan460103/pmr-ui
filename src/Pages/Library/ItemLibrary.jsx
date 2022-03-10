import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import api from '../../api';


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized
    };
}

const ListLibrary = (props) => {

    useEffect(() => {
        if(props.isInitialized){
            if(isEmpty(props.items)){
                getItems();
            }
        }
    }, [props.isInitialized]);
    
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
    return (
        <div className='row'>
            asdasdas
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(ListLibrary);
