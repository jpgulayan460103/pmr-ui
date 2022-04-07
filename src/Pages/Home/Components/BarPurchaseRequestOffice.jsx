import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import BarPurchaseRequestPerDivision from './BarPurchaseRequestPerDivision';
import BarPurchaseRequestPerSection from './BarPurchaseRequestPerSection';

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        purchaseRequest: state.reports.purchaseRequest,
    };
}

const BarPurchaseRequestOffice = ({purchaseRequest}) => {
    const [selectedDivision, setselectedDivision] = useState({});
    const selectDivision = (e) => {
        setselectedDivision(e)
    }
    return (
        <div>
            { isEmpty(selectedDivision) ? (
                <BarPurchaseRequestPerDivision label="Approved Purchase Request by Office" summaryData={purchaseRequest.per_section} selectDivision={selectDivision}/>
            ) : (
                <BarPurchaseRequestPerSection label="Approved Purchase Request by Office" summaryData={purchaseRequest.per_section} selectDivision={selectDivision} selectedDivision={selectedDivision}/>
            ) }
        </div>
    );
}

export default connect(
    mapStateToProps,
)(BarPurchaseRequestOffice);

