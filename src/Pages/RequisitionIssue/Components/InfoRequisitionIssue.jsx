import React from 'react';

function InfoRequisitionIssue({form}) {
    return (
        <div>
            <p>
                <b>RIS No.:</b> {form?.ris_number} <br />
                <b>RIS Date:</b> {form?.ris_date} <br />
                <b>End User:</b> {form?.end_user?.name} <br />
                <b>Title:</b> {form?.title} <br />
                <b>Purpose:</b> {form?.purpose} <br />
                <b>From PPMP:</b> {form ? (form?.from_ppmp == 1 ? "Yes" : "No") : ""} <br />
                <b>Requested by Signatory:</b> {form?.requested_by_name} <br />
                <b>Approved by Signatory:</b> {form?.approved_by_name} <br />
                <b>Issued by Signatory:</b> {form?.issued_by_name} <br />
                <b>Received by Signatory:</b> {form?.received_by_name} <br />
                <b>Status:</b> {form?.status} <br />
            </p>
        </div>
    );
}

export default InfoRequisitionIssue;