import React from 'react';
import { connect } from 'react-redux';

import { Typography  } from 'antd';


const { Title } = Typography;


function mapStateToProps(state) {
    return {

    };
}
const AppletContainer = (props) => {
    return (
        <>
            <Title level={2}>{props.title}</Title>
            <hr /><br />
            <div className="col-md-12 applet-container">
                { props.children }
            </div>  
        </>
    );
}

export default connect(
    mapStateToProps,
)(AppletContainer);

