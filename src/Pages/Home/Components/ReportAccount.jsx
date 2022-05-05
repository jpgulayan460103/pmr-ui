import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PieAccountClassification from './PieAccountClassification';
import PieAccount from './PieAccount';


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        purchaseRequest: state.reports.purchaseRequest,
    };
}

const ReportAccount = ({purchaseRequest}) => {
    const [selectedCategory, setSelectedCategory] = useState({});

    const selectCategory = (e) => {
        setSelectedCategory(e);
    }
    return (
        <div>
            { isEmpty(selectedCategory) ? (
                <PieAccountClassification label="Procurement Description Classification" summaryData={purchaseRequest.accounts} selectCategory={selectCategory} />
            ) : (
                <PieAccount label="Procurement Description Classification" summaryData={purchaseRequest.accounts} selectedCategory={selectedCategory} selectCategory={selectCategory} />
            ) }
            
        </div>
    );
}

export default connect(
    mapStateToProps,
)(ReportAccount);

