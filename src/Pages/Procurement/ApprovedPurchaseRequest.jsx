import React from 'react';
import { connect } from 'react-redux';
import { Table  } from 'antd';

function mapStateToProps(state) {
    return {

    };
}
const ApprovedPurchaseRequest = (props) => {

    const dataSource = [];
    const columns = [];
    return (
        <>
            <Table
                dataSource={dataSource}
                columns={columns}
                size={"small"}
            />
        </>
    );
}

export default connect(
    mapStateToProps,
)(ApprovedPurchaseRequest);

