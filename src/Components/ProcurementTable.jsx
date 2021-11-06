import React, { useEffect, useState } from 'react';
import { Table, Tag, Input, Image  } from 'antd';

const { Search } = Input;

const ProcurementTable = ({
    sampleData,
    setFormData,
    setIsModalVisible,
    setFormType,
    setOpenedImage,
    setOpenImage
}) => {
    const [sampleDataFiltered, setSampleDataFiltered] = useState([]);
    useEffect(() => {
        setSampleDataFiltered(sampleData);
    }, [sampleData]);
    const editTable = (item) => {
        setFormData(item);
        setIsModalVisible(true);
        setFormType("update");
    };
    const columns = [
        
        {
            title: "Code (UACS/PAP)",
            dataIndex: "code_uacs",
            key: "code_uacs",
            width: 150,
        },
        {
            title: "PR number",
            dataIndex: "pr_number",
            key: "pr_number",
            width: 150,
        },
        {
            title: "Particulars",
            dataIndex: "particulars",
            key: "particulars",
            width: 150,
        },
        {
            title: "PMO/End-User",
            dataIndex: "end_user",
            key: "end_user",
            width: 150,
        },
        {
            title: "Types",
            dataIndex: "types",
            key: "types",
            width: 150,
        },
        {
            title: "Mode of Procurement",
            dataIndex: "mode_of_procurement",
            key: "mode_of_procurement",
            width: 150,
        },
        {
            title: "Pre-Proc Conference",
            dataIndex: "preproc_conference",
            key: "preproc_conference",
            width: 150,
        },
        {
            title: "Ads/Post of IB",
            dataIndex: "post_of_ib",
            key: "post_of_ib",
            width: 150,
        },
        {
            title: "Pre-bid Conf",
            dataIndex: "types",
            key: "types",
            width: 150,
        },
        {
            title: "Eligibility Check",
            dataIndex: "mode_of_procurement",
            key: "mode_of_procurement",
            width: 150,
        },
        {
            title: "Sub/Open of Bids",
            dataIndex: "preproc_conference",
            key: "preproc_conference",
            width: 150,
        },
        {
            title: "Bid Evaluation",
            dataIndex: "post_of_ib",
            key: "post_of_ib",
            width: 150,
        },
        {
            title: "Post Qual",
            dataIndex: "prebid_conf",
            key: "prebid_conf",
            width: 150,
        },
        {
            title: "Notice of Award",
            dataIndex: "eligibility_check",
            key: "eligibility_check",
            width: 150,
        },
        {
            title: "Contract Signing",
            dataIndex: "open_of_bids",
            key: "open_of_bids",
            width: 150,
        },
        {
            title: "Notice to Proceed",
            dataIndex: "bid_evaluation",
            key: "bid_evaluation",
            width: 150,
        },
        {
            title: "Estimated LDD",
            dataIndex: "post_qual",
            key: "post_qual",
            width: 150,
        },
        {
            title: "Abstract of Quotations",
            dataIndex: "notice_of_award",
            key: "notice_of_award",
            width: 150,
        },
        {
            title: "Actions",
            key: "action",
            fixed: 'right',
            width: 100,
            render: tags => (
                <>
                  <Tag color="blue" style={{width:60, textAlign: "center", cursor: "pointer", margin: 2}} onClick={() => { editTable(tags) }}>EDIT</Tag>
                  <Tag color="red" style={{width:60, textAlign: "center", cursor: "pointer", margin: 2}} onClick={() => { editTable(tags) }}>DELETE</Tag>
                </>
              )
        },

    ];
    const dataSource = sampleDataFiltered;


    const filter = (array, value, key)  => {
        return array.filter(key? a => a[key].toLowerCase() === value : a => Object.keys(a).some(k => a[k] === value))
    }
    const search = (str) => {
        // let result = filter(sampleData, str);
        let result = sampleData.filter(object => Object.values(object).some(i => i.includes(str)));
        console.log(str);;
        setSampleDataFiltered(result);
    }

    return (
        <div>
            <Table dataSource={[...dataSource]} columns={columns}  scroll={{ y: "32vh" }}
                onRow={(record, rowIndex) => {
                    return {
                      onClick: event => {
                        setOpenedImage("https://guillaumejaume.github.io/FUNSD/img/form_example.png");
                      }, // click row
                      onDoubleClick: event => {}, // double click row
                      onContextMenu: event => {}, // right button click row
                      onMouseEnter: event => {}, // mouse enter row
                      onMouseLeave: event => {}, // mouse leave row
                    };
                  }}
                  bordered={true}
                  size={"small"}
            />
        </div>
    );
    /* 

        {
            title: "PO Number",
            dataIndex: "contract_signing",
            key: "contract_signing",
            width: 150,
        },
        {
            title: "PO (Link)",
            dataIndex: "notice_to_proceed",
            key: "notice_to_proceed",
            width: 150,
        },
        {
            title: "Schedule for Each Procurement Activity",
            dataIndex: "estimated_ldd",
            key: "estimated_ldd",
            width: 150,
        },
        {
            title: "Source of Funds",
            dataIndex: "abstract_of_qoutations",
            key: "abstract_of_qoutations",
            width: 150,
        },
        {
            title: "ABC (PhP)",
            dataIndex: "po_number_1",
            key: "po_number_1",
            width: 150,
        },
        {
            title: "Remarks (Brief description of Program/Project)",
            dataIndex: "po_scanned_1",
            key: "po_scanned_1",
            width: 150,
        },
        {
            title: "PO Number",
            dataIndex: "po_number_2",
            key: "po_number_2",
            width: 150,
        },
        {
            title: "PO (Link)",
            dataIndex: "po_scanned_2",
            key: "po_scanned_2",
            width: 150,
        },
        {
            title: "Contract (Link)",
            dataIndex: "contract_scanned",
            key: "contract_scanned",
            width: 150,
        },
        {
            title: "Name of Supplier 1",
            dataIndex: "name_of_supplier_1",
            key: "name_of_supplier_1",
            width: 150,
        },
        {
            title: "Name of Supplier 2",
            dataIndex: "name_of_supplier_2",
            key: "name_of_supplier_2",
            width: 150,
        },
        {
            title: "Date of Delivery",
            dataIndex: "date_of_delivery",
            key: "date_of_delivery",
            width: 150,
        },
        {
            title: "Delivery Completion",
            dataIndex: "delivery_completion",
            key: "delivery_completion",
            width: 150,
        },
        {
            title: "Inspection & Acceptance Report (Scanned Copy) and Receipt",
            dataIndex: "iar_scanned",
            key: "iar_scanned",
            width: 150,
        },
        {
            title: "Receipt (Scanned Copy)",
            dataIndex: "receipt_scanned",
            key: "receipt_scanned",
            width: 150,
        },
        {
            title: "Receipt No.",
            dataIndex: "receipt_number",
            key: "receipt_number",
            width: 150,
        },
        {
            title: "Type of Equipment",
            dataIndex: "type_of_equipment",
            key: "type_of_equipment",
            width: 150,
        },
        {
            title: "Attendance",
            dataIndex: "attendance",
            key: "attendance",
            width: 150,
        },
        {
            title: "Certificate of Acceptance",
            dataIndex: "certificate_of_acceptance",
            key: "certificate_of_acceptance",
            width: 150,
        },
        {
            title: "Certificate of Occupancy",
            dataIndex: "certificate_of_occupancy",
            key: "certificate_of_occupancy",
            width: 150,
        },
        {
            title: "Certificate of Completion",
            dataIndex: "certificate_of_completion",
            key: "certificate_of_completion",
            width: 150,
        },
        {
            title: "Voucher No.",
            dataIndex: "voucher_number",
            key: "voucher_number",
            width: 150,
        },
        {
            title: "Voucher (Link)",
            dataIndex: "voucher_scanned",
            key: "voucher_scanned",
            width: 150,
        },


    */
   
}
 
export default ProcurementTable;