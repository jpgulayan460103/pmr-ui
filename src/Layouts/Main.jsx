import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import logo from './../Images/logo.png'
import logoCropped from './../Images/logo-cropped-1.png'
import { Layout, Divider, BackTop, Spin  } from 'antd';
import Headers from './Headers'
import SideMenu from './SideMenu'
import Footers from './Footers';
import Login from './../Pages/Login/Login'
import LoadLibraries from './../Components/LoadLibraries'

const { Content, Sider } = Layout;

function mapStateToProps(state) {
  return {
      notifications: state.user.notifications,
      collapsed: state.user.collapsed,
      collapsedWidth: state.user.collapsedWidth,
      mainLoading: state.user.mainLoading,
      mainLoadingMessage: state.user.mainLoadingMessage,
  };
}

const Main = (props) => {
  const handleOnCollapse = collapsed => {
    // console.log("collapsed", collapsed);
    // console.log("props", props.collapsed);
    props.dispatch({
      type: "SET_COLLAPSE",
      data: collapsed
    });
  };
  const [cw, setCw] = useState(80);
  const [loading, setLoading] = useState(true);
    return (
      <div>
      <Layout>
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth={props.collapsedWidth}
          collapsible
          onBreakpoint={broken => {
          // console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            handleOnCollapse(collapsed);
          }}
          collapsed={props.collapsed}
        >
        <div className="logo bg-origin-padding">
          { !props.collapsed ? <img src={logo} alt="" className='px-3 pt-2' /> : <img src={logoCropped} alt="" className='px-3 pt-2' /> }
        </div>
        <Divider />
        <SideMenu />
        </Sider>
      <Layout>
        <Headers />
        <LoadLibraries />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background min-h-screen">
            <Spin spinning={props.mainLoading} tip={props.mainLoadingMessage}>
              { props.children }
            </Spin>
            {/* <Login /> */}
          </div>
        </Content>
        {/* <Footers/> */}
        </Layout>
          <BackTop  className='animate-bounce' />
      </Layout>
      </div>
    );
}

export default connect(
  mapStateToProps,
)(Main);
