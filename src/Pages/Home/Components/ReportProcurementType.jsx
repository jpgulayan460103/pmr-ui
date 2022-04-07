import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PieProcurementCategory from './PieProcurementCategory';
import PieProcurementType from './PieProcurementType';


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        purchaseRequest: state.reports.purchaseRequest,
    };
}

const ReportProcurementType = ({purchaseRequest}) => {
    const [selectedCategory, setSelectedCategory] = useState({});

    const selectCategory = (e) => {
        setSelectedCategory(e);
    }
    return (
        <div>
            { isEmpty(selectedCategory) ? (
                <PieProcurementCategory label="Procurement Category" summaryData={purchaseRequest.procurement_types} selectCategory={selectCategory} />
            ) : (
                <PieProcurementType label="Procurement Category" summaryData={purchaseRequest.procurement_types} selectedCategory={selectedCategory} selectCategory={selectCategory} />
            ) }
            
        </div>
    );
}

export default connect(
    mapStateToProps,
)(ReportProcurementType);

