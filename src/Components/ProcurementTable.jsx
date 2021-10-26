import React, { useEffect, useState } from 'react';
import { Table, Tag, Input, Image  } from 'antd';

import Lightbox from 'react-image-lightbox';

const { Search } = Input;

const ProcurementTable = ({sampleData, setFormData, setIsModalVisible, setFormType}) => {
    const [sampleDataFiltered, setSampleDataFiltered] = useState([]);
    const [openImage, setOpenImage] = useState(false);
    const [openedImage, setOpenedImage] = useState("");
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
        // {
        //     title: "Scanned PR",
        //     key: "pr_scanned",
        //     render: item => (
        //         <>
        //             <img style={{cursor:"pointer"}} src="https://guillaumejaume.github.io/FUNSD/img/form_example.png" alt="" srcset="" onClick={() => { setOpenedImage("https://guillaumejaume.github.io/FUNSD/img/form_example.png"); setOpenImage(true); }} />
        //         </>
        //     )
        // },
        // {
        //     title: "PMO/End-User",
        //     dataIndex: "end_user",
        //     key: "end_user"
        // },
        // {
        //     title: "Types",
        //     dataIndex: "types",
        //     key: "types"
        // },
        // {
        //     title: "Mode of Procurement",
        //     dataIndex: "mode_of_procurement",
        //     key: "mode_of_procurement"
        // },
        // {
        //     title: "Pre-Proc Conference",
        //     dataIndex: "preproc_conference",
        //     key: "preproc_conference"
        // },
        // {
        //     title: "Ads/Post of IB",
        //     dataIndex: "post_of_ib",
        //     key: "post_of_ib"
        // },
        {
            title: "",
            key: "action",
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
        { openImage && (
            <Lightbox
            mainSrc={openedImage}
            onCloseRequest={() => {  setOpenImage(false) }}
          />
        ) }
            <Table dataSource={[...dataSource]} columns={columns} />
        </div>
    );

    /* 
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