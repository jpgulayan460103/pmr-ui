import React from 'react';
import { Layout } from 'antd';
import Themepicker from '../Components/ThemePicker';

const { Footer } = Layout;

const Footers = () => {
    return (
        <React.Fragment>
            <Footer style={{ textAlign: 'center' }}>
                {/* <Themepicker /> */}
            </Footer>
        </React.Fragment>
    );
}

export default Footers;
