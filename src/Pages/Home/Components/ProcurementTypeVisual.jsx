import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import ProcurementCategoryPie from './ProcurementCategoryPie';
import ProcurementTypePie from './ProcurementTypePie';


function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
        purchaseRequest: state.reports.purchaseRequest,
    };
}

const ProcurementTypeVisual = ({purchaseRequest}) => {
    const [selectedCategory, setSelectedCategory] = useState({});

    const selectCategory = (e) => {
        setSelectedCategory(e);
    }
    return (
        <div>
            { isEmpty(selectedCategory) ? (
                <ProcurementCategoryPie label="Procurement Category" summaryData={purchaseRequest.procurement_types} selectCategory={selectCategory} />
            ) : (
                <ProcurementTypePie label="Procurement Category" summaryData={purchaseRequest.procurement_types} selectedCategory={selectedCategory} selectCategory={selectCategory} />
            ) }
            
        </div>
    );
}

export default connect(
    mapStateToProps,
)(ProcurementTypeVisual);

