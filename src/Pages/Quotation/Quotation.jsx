import React from 'react';
import { connect } from 'react-redux';
import style from './style.less'

function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
    };
}

const Quotation = () => {
    return (
        <div className='container'>
            <p className="text-right">Appendix A: RFQ</p>
            RFQ No.: <br />
            Date: <br />
            Company Name: <br />
            Company Address: <br />
            Contact Person: <br />
            Contact No.: <br />
            Email Address: <br />
            {/* <p className="text-center"><b>PURCHASE REQUEST</b></p> */}
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Quotation);
