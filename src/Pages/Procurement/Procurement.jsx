import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../../api';
import { Tabs, Typography  } from 'antd';
import AppletContainer from './AppletContainer';
import ApprovedPurchaseRequest from './ApprovedPurchaseRequest';


const { Title } = Typography;


function mapStateToProps(state) {
    return {

    };
}


const Procurement = () => {    
    return (
        <div className='row'>
            <div className="row mb-6">
                <div className="col-md-8">
                    <AppletContainer title="Approved Puchase Requests">
                        <ApprovedPurchaseRequest />
                    </AppletContainer>
                </div>
                <div className="col-md-4">
                    <AppletContainer title="">
                    </AppletContainer>
                </div>
            </div>

            <div className="row mb-6">
                <div className="col-md-12">
                    <AppletContainer title="">
                    </AppletContainer>
                </div>
            
            </div>

            <div className="row mb-6">
                <div className="col-md-8">
                    <AppletContainer title="">
                    </AppletContainer>
                </div>
                <div className="col-md-4">
                    <AppletContainer title="">
                    </AppletContainer>
                </div>
            </div>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Procurement);

