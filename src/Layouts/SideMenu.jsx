import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import Icon, {
    UserOutlined,
    UploadOutlined,
    FormOutlined,
    MessageOutlined,
    ShoppingCartOutlined ,
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
const ProcurementSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M820.8384 328.0896c1.2288-0.8192 2.048-1.6384 2.8672-2.4576h149.0944c16.7936 0 30.72-13.9264 30.72-30.72V139.264c0-16.7936-13.9264-30.72-30.72-30.72h-212.992c-16.7936 0-30.72 13.9264-30.72 30.72v47.104H294.912V139.264c0-16.7936-13.9264-30.72-30.72-30.72h-212.992C34.4064 108.544 20.48 122.4704 20.48 139.264v155.648c0 16.7936 13.9264 30.72 30.72 30.72h144.9984c0.8192 0.8192 2.048 1.6384 2.8672 2.4576l258.4576 185.9584-256 184.32H51.2c-16.7936 0-30.72 13.9264-30.72 30.72v155.648c0 16.7936 13.9264 30.72 30.72 30.72h212.992c16.7936 0 30.72-13.9264 30.72-30.72v-47.104h434.176V884.736c0 16.7936 13.9264 30.72 30.72 30.72h212.992c16.7936 0 30.72-13.9264 30.72-30.72v-155.648c0-16.7936-13.9264-30.72-30.72-30.72h-154.4192l-256-184.32 258.4576-185.9584zM790.528 169.984h151.552v94.208h-151.552v-94.208z m-708.608 0h151.552v94.208H81.92v-94.208zM286.72 315.392c4.9152-5.3248 8.192-12.6976 8.192-20.48V247.808h434.176V294.912c0 6.9632 2.4576 13.5168 6.5536 18.8416l-225.6896 162.6112L286.72 315.392zM233.472 854.016H81.92v-94.208h151.552v94.208z m708.608 0h-151.552v-94.208h151.552v94.208z m-208.4864-140.9024c-2.8672 4.5056-4.5056 10.24-4.5056 15.9744v47.104H294.912V729.088c0-6.5536-2.048-13.1072-5.7344-18.0224l220.7744-159.3344 223.6416 161.3824z" fill="#231815" p-id="13305"></path>
    </svg>
);
const FormsSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M835.55027 48.761905C876.805122 48.761905 910.222223 81.441158 910.222223 121.753604L910.222223 834.966428 917.178886 818.05911 755.401109 982.711731 773.333333 975.238095 188.412988 975.238095C147.247907 975.238095 113.777778 942.409011 113.777778 902.094615L113.777778 24.380952 88.888889 48.761905 835.55027 48.761905ZM64 0 64 24.380952 64 902.094615C64 969.325498 119.742117 1024 188.412988 1024L773.333333 1024 783.922411 1024 791.265557 1016.526364 953.043334 851.873745 960 844.793457 960 834.966428 960 121.753604C960 54.49204 904.277615 0 835.55027 0L88.888889 0 64 0Z" p-id="21268"></path>
        <path d="M736.080945 707.047618C694.76038 707.047618 661.333333 739.619379 661.333333 780.144186L661.333333 926.47619C661.333333 939.941419 672.476469 950.857143 686.222223 950.857143 699.967977 950.857143 711.11111 939.941419 711.11111 926.47619L711.11111 780.144186C711.11111 766.607861 722.192996 755.809523 736.080945 755.809523L848 755.809523C861.745754 755.809523 872.88889 744.893801 872.88889 731.428572 872.88889 717.963343 861.745754 707.047618 848 707.047618L736.080945 707.047618Z" p-id="21269"></path>
        <path d="M775.164361 219.428572C788.910114 219.428572 800.05325 208.512847 800.05325 195.047619 800.05325 181.582391 788.910114 170.666667 775.164361 170.666667L263.111111 170.666667C249.365357 170.666667 238.222222 181.582391 238.222222 195.047619 238.222222 208.512847 249.365357 219.428572 263.111111 219.428572L775.164361 219.428572Z" p-id="21270"></path>
        <path d="M775.164361 365.714285C788.910114 365.714285 800.05325 354.798562 800.05325 341.333333 800.05325 327.868105 788.910114 316.952382 775.164361 316.952382L263.111111 316.952382C249.365357 316.952382 238.222222 327.868105 238.222222 341.333333 238.222222 354.798562 249.365357 365.714285 263.111111 365.714285L775.164361 365.714285Z" p-id="21271"></path>
        <path d="M775.164361 536.380951C788.910114 536.380951 800.05325 525.465229 800.05325 512 800.05325 498.534771 788.910114 487.619049 775.164361 487.619049L263.111111 487.619049C249.365357 487.619049 238.222222 498.534771 238.222222 512 238.222222 525.465229 249.365357 536.380951 263.111111 536.380951L775.164361 536.380951Z" p-id="21272"></path>
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
                <SubMenu key="submenu-procurement" icon={<Icon component={ProcurementSvg} />} title="Procurement">
                    <Menu.Item key="/procurement">
                        <Link to="/procurement"></Link>
                        Procurement
                    </Menu.Item>
                    <SubMenu key="submenu-quotation" title="Quotations">
                        <Menu.Item key="/procurement/quotations/form">
                            <Link to="/procurement/quotations/form"></Link>
                            Create Quotation Form
                        </Menu.Item>
                        <Menu.Item key="/procurement/quotations">
                            <Link to="/procurement/quotations"></Link>
                            View Quotation Forms
                        </Menu.Item>
                        <Menu.Item key="/procurement/quotations/suppliers">
                            <Link to="/procurement/quotations/suppliers"></Link>
                            Suppliers
                        </Menu.Item>
                    </SubMenu>
                </SubMenu>
                <SubMenu key="submenu-form-monitoring" icon={<Icon component={FormsSvg} />} title="Forms">
                    <Menu.Item key="/forms/requests">
                        <Link to="/forms/requests"></Link>
                        Requests
                    </Menu.Item>
                    <Menu.Item key="/forms/approved">
                        <Link to="/forms/approved"></Link>
                        Approved
                    </Menu.Item>
                    <Menu.Item key="/forms/disapproved">
                        <Link to="/forms/disapproved"></Link>
                        Disapproved
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="submenu-purchase-request" icon={<ShoppingCartOutlined />} title="Purchase Requests">
                    <Menu.Item key="/purchase-requests/form">
                        <Link to="/purchase-requests/form"></Link>
                        { props.purchaseRequestFormType == "create" ? "Create" : "Edit" } Purchase Request
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