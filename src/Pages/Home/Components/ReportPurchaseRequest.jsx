import React from 'react';
import { connect } from 'react-redux';
import { Typography, Card, Divider } from 'antd';
import helpers from '../../../Utilities/helpers';
import dayjs from 'dayjs'

const { Title } = Typography;

function mapStateToProps(state) {
    return {
        isInitialized: state.user.isInitialized,
    };
}

const ReportPurchaseRequest = ({label, summaryData}) => {
    return (
        <Card size="small" bordered={false} style={{height: "175px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "55px"}}>
                    <Title className='text-center mt-4'>
                        { helpers.currencyFormat(summaryData?.data) || "0.00" }
                    </Title>
                </div>
                <Divider className='mb-2' />
                Period: <b>{ summaryData?.start_day } - { summaryData?.end_day }</b>
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(ReportPurchaseRequest);
