import React, { useState } from 'react';

import logo from './../Images/logo.png'
import logoCropped from './../Images/logo-cropped-1.png'
import { Layout, Divider   } from 'antd';
import Headers from './Headers'
import SideMenu from './SideMenu'
import Footers from './Footers';

const { Content, Footer, Sider } = Layout;

const Main = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };
    return (
      <div>
      <Layout>
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="80"
          collapsible
          onBreakpoint={broken => {
          console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
          onCollapse(collapsed);
          }}
        >
        <div className="logo bg-origin-padding">
          { !collapsed ? <img src={logo} alt="" className='px-3 pt-2' /> : <img src={logoCropped} alt="" className='px-3 pt-2' /> }
        </div>
        <Divider />
        <SideMenu />
        </Sider>
      <Layout>
        <Headers />
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: "83vh" }}>
          { props.children }
          </div>
        </Content>
        <Footers/>
        </Layout>
      </Layout>
      </div>
    );
}

export default Main;
