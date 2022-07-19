import React from 'react';
import { connect } from 'react-redux'


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        user: state.user.data,
    };
}


function AllForm(props) {
    return (
        <div>
            
        </div>
    );
}

export default connect(
    mapStateToProps,
  )(AllForm);
