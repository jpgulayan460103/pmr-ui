import React, { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Form, Input, message  } from 'antd';

const { TabPane } = Tabs;

const ProcurementForm = ({setSampleData, sampleData, formData, setFormData, isModalVisible, setIsModalVisible}) => {
    const [form] = Form.useForm();
    const formRef = React.useRef();
    useEffect(() => {
        form.setFieldsValue({
            ...formData
        });
    }, [formData]);
  
    const handleOk = () => {
      setIsModalVisible(false);
      let sample = sampleData;
      setSampleData([formData,...sample]);
      message.success('Successfuly saved.');
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        console.log(formData);
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onValuesChange = (errorInfo) => {
        let form = {...formData, ...errorInfo};
        setFormData(form);
    };

    
  
    return (
      <>
        <Modal title="Procurement Monitoring" visible={isModalVisible} onOk={handleOk} okText="Submit" onCancel={handleCancel} width={"70%"} getContainer={false} >
            <Tabs defaultActiveKey="1" tabPosition="top" type="line">
                <TabPane tab="Annex A" key="1" style={{height: "50vh", overflowY: "scroll", paddingRight: 20}}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onValuesChange={onValuesChange}
                        autoComplete="off"
                        layout="vertical"
                        
                    >

                        <Form.Item
                            label="Code (UACS/PAP)"
                            name="code_uacs"
                        >
                            <Input />
                        </Form.Item>
                        
                        <Form.Item
                            label="PR number"
                            name="pr_number"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Particulars"
                            name="particulars"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="PR Scanned Copy"
                            name="pr_scanned_file"
                        >
                            <Input type="file" />
                        </Form.Item>
                        <Form.Item
                            label="Schedule for Each Procurement Activity"
                            name="schedule_procurement"
                        >
                            <Input />
                        </Form.Item><Form.Item
                            label="Source of Funds"
                            name="source_of_funds"
                        >
                            <Input />
                        </Form.Item><Form.Item
                            label="ABC (PhP)"
                            name="abc_php"
                        >
                            <Input />
                        </Form.Item><Form.Item
                            label="Remarks (Brief description of Program/Project)"
                            name="remarks_brief_description"
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="Annex B" key="2" style={{height: "50vh", overflowY: "scroll", paddingRight: 20}}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        
                        <Form.Item
                            label="PMO/End-User"
                            name="end_user"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Types (Infra, Goods, Services - catering, tranpo, consultancy)"
                            name="types"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Mode of Procurement"
                            name="mode_of_procurement"
                        >
                            <Input />
                        </Form.Item>
                        
                    </Form>
                </TabPane>
                <TabPane tab="Actual Procurement Activity" key="3" style={{height: "50vh", overflowY: "scroll", paddingRight: 20}}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onValuesChange={onValuesChange}
                        onValuesChange={onValuesChange}
                        autoComplete="off"
                        layout="vertical"
                    >
                        
                        <Form.Item
                            label="Pre-Proc Conference"
                            name="preproc_conference"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Ads/Post of IB"
                            name="post_of_ib"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Pre-bid Conf"
                            name="prebid_conf"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Eligibility Check"
                            name="eligibility_check"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Sub/Open of Bids"
                            name="open_of_bids"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Bid Evaluation"
                            name="bid_evaluation"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Post Qual"
                            name="post_qual"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Notice of Award"
                            name="notice_of_award"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Contract Signing"
                            name="contract_signing"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Notice to Proceed"
                            name="notice_to_proceed"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Estimated LDD"
                            name="estimated_ldd"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Abstract of Quotations"
                            name="abstract_of_qoutations"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="PO Number"
                            name="po_number_1"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="PO (Scanned Copy)"
                            name="po_scanned_1_file"
                        >
                            <Input type="file" />
                        </Form.Item>
                        <Form.Item
                            label="PO Number"
                            name="po_number_2"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="PO (Scanned Copy)"
                            name="po_scanned_2_file"
                        >
                            <Input type="file"/>
                        </Form.Item>
                        <Form.Item
                            label="Contract (Scanned Copy)"
                            name="contract_scanned"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Name of Supplier 1"
                            name="name_of_supplier_1"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Name of Supplier 2"
                            name="name_of_supplier_2"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Date of Delivery"
                            name="date_of_delivery"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Delivery Completion"
                            name="delivery_completion"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Inspection & Acceptance Report (Scanned Copy) and Receipt"
                            name="iar_scanned"
                        >
                            <Input />
                        </Form.Item>
                        

                    </Form>
                </TabPane>
                <TabPane tab="Issuance" key="4" style={{height: "50vh", overflowY: "scroll", paddingRight: 20}}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onValuesChange={onValuesChange}
                        autoComplete="off"
                        layout="vertical"
                    >
                       <Form.Item
                            label="Receipt (Scanned Copy)"
                            name="receipt_scanned_file"
                        >
                            <Input type="file" />
                        </Form.Item>
                        <Form.Item
                            label="Receipt No."
                            name="receipt_number"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Type of Equipment"
                            name="type_of_equipment"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Attendance"
                            name="attendance"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Certificate of Acceptance"
                            name="certificate_of_acceptance"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Certificate of Occupancy"
                            name="certificate_of_occupancy"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Certificate of Completion"
                            name="certificate_of_completion"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Voucher No."
                            name="voucher_number"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Voucher (Scanned Copy)"
                            name="voucher_scanned_file"
                        >
                            <Input type="file" />
                        </Form.Item>

                    </Form>
                </TabPane>
            </Tabs>
        </Modal>
      </>
    );
}
 
export default ProcurementForm;