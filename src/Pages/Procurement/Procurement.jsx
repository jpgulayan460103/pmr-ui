import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../../api';
import { Tabs, Typography  } from 'antd';
import AppletContainer from './AppletContainer';
import ApprovedPurchaseRequest from './ApprovedPurchaseRequest';


const { Title } = Typography;


function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest
    };
}


const Procurement = (props) => {    
    return (
        <div className='row'>
            <div className="row mb-6">
                <div className="col-md-8">
                    <AppletContainer title="Approved Puchase Requests">
                        <ApprovedPurchaseRequest />
                    </AppletContainer>
                </div>
                <div className="col-md-4">
                    <AppletContainer title="Purchase Request File">
                        {props.selectedPurchaseRequest && props.selectedPurchaseRequest.file ? <iframe src={`${props.selectedPurchaseRequest?.file}?view=1`} width="100%" height="100%"></iframe> : ""}
                    </AppletContainer>
                </div>
            </div>

            <div className="row mb-6">
                <div className="col-md-12">
                    <AppletContainer title={props.type}>
                    </AppletContainer>
                </div>
            
            </div>

            <div className="row mb-6">
                <div className="col-md-8">
                    <AppletContainer title="Section 4">
                    </AppletContainer>
                </div>
                <div className="col-md-4">
                    <AppletContainer title="Section 5">
                    </AppletContainer>
                </div>
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Procurement);

