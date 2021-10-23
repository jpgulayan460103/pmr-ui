import React, { useEffect, useState } from 'react';
import { Table, Tag, Space } from 'antd';
const ProcurementTable = ({sampleData}) => {
    const [formData, setFormData] = useState([]);
    const columns = [
        {
            title: "Code (UACS/PAP)",
            dataIndex: "code_uacs",
            key: "code_uacs"
        },
        {
            title: "PR number",
            dataIndex: "pr_number",
            key: "pr_number"
        },
        {
            title: "Particulars",
            dataIndex: "particulars",
            key: "particulars"
        },
        {
            title: "PR Link",
            dataIndex: "pr_scanned",
            key: "pr_scanned"
        },
        {
            title: "PMO/End-User",
            dataIndex: "schedule_procurement",
            key: "schedule_procurement"
        },
        {
            title: "Types (Infra, Goods, Services - catering, tranpo, consultancy)",
            dataIndex: "source_of_funds",
            key: "source_of_funds"
        },
        {
            title: "Mode of Procurement",
            dataIndex: "abc_php",
            key: "abc_php"
        },

    ];
    const dataSource = [
        {code_uacs: "123123123"},
        {code_uacs: "asdasdasd"}
      ];
    const add = () => {
        let test = [
            {
                code_uacs: "code_uacs"
            }
        ];
        let d = [...formData, ...test]
        console.log(d);
        setFormData(d);
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} />;
            <button onClick={ () => { add() } }>asdasd</button>
        </div>
    );

    /* 
            {
            title: "Pre-Proc Conference",
            dataIndex: "remarks_brief_description",
            key: "remarks_brief_description"
        },
        {
            title: "Ads/Post of IB",
            dataIndex: "end_user",
            key: "end_user"
        },
        {
            title: "Pre-bid Conf",
            dataIndex: "types",
            key: "types"
        },
        {
            title: "Eligibility Check",
            dataIndex: "mode_of_procurement",
            key: "mode_of_procurement"
        },
        {
            title: "Sub/Open of Bids",
            dataIndex: "preproc_conference",
            key: "preproc_conference"
        },
        {
            title: "Bid Evaluation",
            dataIndex: "post_of_ib",
            key: "post_of_ib"
        },
        {
            title: "Post Qual",
            dataIndex: "prebid_conf",
            key: "prebid_conf"
        },
        {
            title: "Notice of Award",
            dataIndex: "eligibility_check",
            key: "eligibility_check"
        },
        {
            title: "Contract Signing",
            dataIndex: "open_of_bids",
            key: "open_of_bids"
        },
        {
            title: "Notice to Proceed",
            dataIndex: "bid_evaluation",
            key: "bid_evaluation"
        },
        {
            title: "Estimated LDD",
            dataIndex: "post_qual",
            key: "post_qual"
        },
        {
            title: "Abstract of Quotations",
            dataIndex: "notice_of_award",
            key: "notice_of_award"
        },
        {
            title: "PO Number",
            dataIndex: "contract_signing",
            key: "contract_signing"
        },
        {
            title: "PO (Link)",
            dataIndex: "notice_to_proceed",
            key: "notice_to_proceed"
        },
        {
            title: "Schedule for Each Procurement Activity",
            dataIndex: "estimated_ldd",
            key: "estimated_ldd"
        },
        {
            title: "Source of Funds",
            dataIndex: "abstract_of_qoutations",
            key: "abstract_of_qoutations"
        },
        {
            title: "ABC (PhP)",
            dataIndex: "po_number_1",
            key: "po_number_1"
        },
        {
            title: "Remarks (Brief description of Program/Project)",
            dataIndex: "po_scanned_1",
            key: "po_scanned_1"
        },
        {
            title: "PO Number",
            dataIndex: "po_number_2",
            key: "po_number_2"
        },
        {
            title: "PO (Link)",
            dataIndex: "po_scanned_2",
            key: "po_scanned_2"
        },
        {
            title: "Contract (Link)",
            dataIndex: "contract_scanned",
            key: "contract_scanned"
        },
        {
            title: "Name of Supplier 1",
            dataIndex: "name_of_supplier_1",
            key: "name_of_supplier_1"
        },
        {
            title: "Name of Supplier 2",
            dataIndex: "name_of_supplier_2",
            key: "name_of_supplier_2"
        },
        {
            title: "Date of Delivery",
            dataIndex: "date_of_delivery",
            key: "date_of_delivery"
        },
        {
            title: "Delivery Completion",
            dataIndex: "delivery_completion",
            key: "delivery_completion"
        },
        {
            title: "Inspection & Acceptance Report (Scanned Copy) and Receipt",
            dataIndex: "iar_scanned",
            key: "iar_scanned"
        },
        {
            title: "Receipt (Scanned Copy)",
            dataIndex: "receipt_scanned",
            key: "receipt_scanned"
        },
        {
            title: "Receipt No.",
            dataIndex: "receipt_number",
            key: "receipt_number"
        },
        {
            title: "Type of Equipment",
            dataIndex: "type_of_equipment",
            key: "type_of_equipment"
        },
        {
            title: "Attendance",
            dataIndex: "attendance",
            key: "attendance"
        },
        {
            title: "Certificate of Acceptance",
            dataIndex: "certificate_of_acceptance",
            key: "certificate_of_acceptance"
        },
        {
            title: "Certificate of Occupancy",
            dataIndex: "certificate_of_occupancy",
            key: "certificate_of_occupancy"
        },
        {
            title: "Certificate of Completion",
            dataIndex: "certificate_of_completion",
            key: "certificate_of_completion"
        },
        {
            title: "Voucher No.",
            dataIndex: "voucher_number",
            key: "voucher_number"
        },
        {
            title: "Voucher (Link)",
            dataIndex: "voucher_scanned",
            key: "voucher_scanned"
        },


    */
   
}
 
export default ProcurementTable;