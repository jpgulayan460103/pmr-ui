import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import Icon, {
    UserOutlined,
    UploadOutlined,
    FormOutlined ,
  } from '@ant-design/icons';
import { useLocation, Link  } from 'react-router-dom'

const { SubMenu } = Menu;

function mapStateToProps(state) {
    return {
        purchaseRequestFormType: state.purchaseRequest.formType,
    };
}

const LibrarySvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M485.007439 1020.801829c26.506051 0 48.021018-21.272681 48.021018-48.554047L533.028457 51.756094c0-26.845251-21.854167-48.602504-48.021018-48.602504L338.763813 3.15359C312.257762 3.202047 290.742795 24.474728 290.742795 51.756094l0 920.443231c0 26.845251 21.854167 48.554047 48.021018 48.554047L485.007439 1020.753372zM339.103013 51.853008C339.103013 51.465351 484.571325 51.756094 484.571325 51.756094c-0.436114 0-0.3392 920.491688-0.3392 920.491688 0 0.387657-145.468312 0.096914-145.468312 0.096914C339.15147 972.344697 339.103013 51.853008 339.103013 51.853008z" p-id="7980"></path>
   <path d="M860.598673 1022.400915l141.300998-37.84502c25.633823-6.880913 40.849363-32.999307 33.823078-59.359987L797.459029 36.10444c-6.92937-25.924566-33.677707-41.285477-58.97233-34.501478l-141.300998 37.84502c-25.633823 6.880913-40.849363 32.999307-33.823078 59.359987l238.215263 889.091467C808.60417 1013.824002 835.30405 1029.136456 860.598673 1022.400915zM750.649439 48.60638c-0.387657 0.096914 237.92452 889.188381 237.92452 889.188381 0.096914 0.387657-140.477227 37.748106-140.477227 37.748106 0.387657-0.096914-237.92452-889.188381-237.92452-889.188381C610.026841 86.015287 750.649439 48.60638 750.649439 48.60638z" p-id="7981"></path>
   <path d="M194.264644 1020.801829C220.770696 1020.801829 242.285662 999.480691 242.285662 972.199325L242.285662 51.756094c0-26.845251-21.854167-48.602504-48.021018-48.602504L48.021018 3.15359C21.514967 3.202047 0 24.474728 0 51.756094l0 920.443231c0 26.845251 21.854167 48.554047 48.021018 48.554047L194.264644 1020.753372zM48.360218 51.853008C48.360218 51.465351 193.82853 51.756094 193.82853 51.756094c-0.436114 0-0.3392 920.491688-0.3392 920.491688 0 0.387657-145.468312 0.096914-145.468312 0.096914C48.408675 972.344697 48.360218 51.853008 48.360218 51.853008z" p-id="7982"></path>
    </svg>
);

const SignatureSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M1834.666667 355.555556l-164.977778-164.977778-412.444445 415.288889L1422.222222 768l412.444445-412.444444z m19.911111-19.911112l91.022222-91.022222c11.377778-11.377778 11.377778-31.288889 0-42.666666l-122.311111-122.311112c-11.377778-11.377778-31.288889-11.377778-42.666667 0L1689.6 170.666667l164.977778 164.977777zM1237.333333 625.777778l-22.755555 22.755555c-2.844444 2.844444-5.688889 5.688889-5.688889 11.377778L1109.333333 918.755556l258.844445-99.555556c2.844444-2.844444 8.533333-2.844444 11.377778-5.688889l22.755555-22.755555-164.977778-164.977778zM1865.955556 39.822222l122.311111 122.311111c34.133333 34.133333 34.133333 88.177778 0 122.311111l-568.888889 566.044445c-8.533333 8.533333-19.911111 14.222222-31.288889 19.911111l-290.133333 110.933333c-22.755556 8.533333-48.355556-2.844444-56.888889-25.6-2.844444-11.377778-2.844444-19.911111 0-31.288889l110.933333-290.133333c5.688889-11.377778 11.377778-22.755556 19.911111-31.288889L1743.644444 39.822222c34.133333-34.133333 88.177778-34.133333 122.311112 0zM426.666667 796.444444c25.6-5.688889 48.355556-17.066667 108.088889-39.822222h2.844444c122.311111-45.511111 162.133333-51.2 193.422222-31.288889 36.977778 22.755556 39.822222 59.733333 31.288889 133.688889v5.688889c-5.688889 48.355556-5.688889 68.266667 0 73.955556 11.377778 14.222222 153.6-28.444444 159.288889-5.688889 5.688889 22.755556-170.666667 82.488889-204.8 42.666666-19.911111-25.6-22.755556-48.355556-11.377778-116.622222V853.333333c5.688889-51.2 8.533333-68.266667-11.377778-79.644444-19.911111-8.533333-227.555556 73.955556-253.155555 82.488889-48.355556 11.377778-79.644444 5.688889-93.866667-22.755556-14.222222-25.6-2.844444-48.355556 25.6-88.177778 8.533333-11.377778 19.911111-25.6 36.977778-45.511111 5.688889-5.688889 31.288889-39.822222 39.822222-48.355555 14.222222-17.066667 22.755556-28.444444 31.288889-42.666667 34.133333-42.666667 48.355556-79.644444 51.2-99.555555 2.844444-19.911111 2.844444-31.288889-14.222222-39.822223-48.355556-22.755556-193.422222 34.133333-457.955556 153.6-14.222222 5.688889-31.288889-5.688889-39.822222-25.6-8.533333-22.755556 0-48.355556 14.222222-54.044444 284.444444-128 443.733333-164.977778 514.844445-133.688889 48.355556 19.911111 62.577778 62.577778 51.2 110.933333-8.533333 34.133333-31.288889 73.955556-68.266667 122.311111-11.377778 14.222222-19.911111 28.444444-34.133333 42.666667-8.533333 8.533333-36.977778 42.666667-39.822222 48.355556-14.222222 17.066667-25.6 31.288889-34.133334 42.666666-14.222222 8.533333-8.533333 22.755556 2.844445 19.911111z" p-id="8923"></path>
    </svg>
);

const Sidemenu = (props) => {
    const location = useLocation();
    const [defaultKey, setDefaultKey] = useState('/');
    useEffect(() => {
        setDefaultKey(location.pathname);
    }, [location.pathname]);
    return (
        <React.Fragment>
            <Menu theme="light" mode="inline" selectedKeys={[defaultKey]} >
                <Menu.Item key="/" icon={<UserOutlined />}>
                    <Link to="/"></Link>
                    Home
                </Menu.Item>
                <SubMenu key="submenu-purchase-request" icon={<FormOutlined />} title="Purchase Requests">
                    <Menu.Item key="/purchase-requests/form">
                        <Link to="/purchase-requests/form"></Link>
                        { props.purchaseRequestFormType == "create" ? "Create" : "Edit" } Purchase Requests
                    </Menu.Item>
                    <Menu.Item key="/purchase-requests">
                        <Link to="/purchase-requests"></Link>
                        View Purchase Requests
                    </Menu.Item>
                    <Menu.Item key="7">Option 7</Menu.Item>
                    <Menu.Item key="8">Option 8</Menu.Item>
                </SubMenu>
                <Menu.Item key="/users" icon={<UserOutlined />}>
                    <Link to="/users"></Link>
                    Users
                </Menu.Item>
                <SubMenu key="submenu-libraries" icon={<Icon component={LibrarySvg} />} title="Libraries">
                    <Menu.Item key="/libraries/items">
                        <Link to="/libraries/items"></Link>
                        Items
                    </Menu.Item>
                    <Menu.Item key="/libraries/items/categories">
                        <Link to="/libraries/items/categories"></Link>
                        Item Categories
                    </Menu.Item>
                    <Menu.Item key="/libraries/items/measures">
                        <Link to="/libraries/items/measures"></Link>
                        Unit of Measures
                    </Menu.Item>
                    <Menu.Item key="/libraries/offices/divisions">
                        <Link to="/libraries/offices/divisions"></Link>
                        Office Divisions
                    </Menu.Item>
                    <Menu.Item key="/libraries/offices/sections">
                        <Link to="/libraries/offices/sections"></Link>
                        Office Sections
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="submenu-signatories" icon={<Icon component={SignatureSvg} />} title="Signatories">
                    <Menu.Item key="/libraries/signatories/administrators">
                        <Link to="/libraries/signatories/administrators"></Link>
                        Admininstrators
                    </Menu.Item>
                    <Menu.Item key="/libraries/signatories/purchase-requests">
                        <Link to="/libraries/signatories/purchase-requests"></Link>
                        Purchase Request
                    </Menu.Item>
                </SubMenu>
                {/* <Menu.Item key="4" icon={<UserOutlined />}>
                    nav 4
                </Menu.Item> */}
            </Menu>
        </React.Fragment>
    );
}

export default connect(
    mapStateToProps,
  )(Sidemenu);