import React from 'react';
import { connect } from 'react-redux';
import './style.css'

import { Typography  } from 'antd';


const { Title } = Typography;


function mapStateToProps(state) {
    return {

    };
}
const AppletContainer = (props) => {
    return (
        <>
            <Title level={2} className='text-center'>{props.title}</Title>
            <div className="col-md-12 applet-container">
                { props.children }
            </div>  
        </>
    );
}

export default connect(
    mapStateToProps,
)(AppletContainer);

