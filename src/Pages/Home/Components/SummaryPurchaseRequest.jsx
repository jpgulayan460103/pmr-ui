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

const SummaryPurchaseRequest = ({label}) => {
    return (
        <Card size="small" bordered={false} style={{height: "175px"}} >
            <div>
                <p>{label}</p>
                <div style={{height: "55px"}}>
                    <Title className='text-center mt-4'>
                        { helpers.currencyFormat(Math.floor(Math.random() * 1000000)) }
                    </Title>
                </div>
                <Divider className='mb-2' />
                { dayjs().startOf('month').format("MMMM DD, YYYY") } - { dayjs().endOf('month').format("MMMM DD, YYYY") }
            </div>
        </Card>
    );
}

export default connect(
    mapStateToProps,
)(SummaryPurchaseRequest);
