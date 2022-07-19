import React from 'react';
import helpers from '../../../Utilities/helpers';

function InfoPurchaseRequest({form}) {
    return (
        <div>
            <p>
                <b>PR No.:</b> {form?.pr_number} <br />
                <b>PR Date:</b> {form?.pr_date} <br />
                <b>End User:</b> {form?.end_user?.name} <br />
                <b>Title:</b> {form?.title} <br />
                <b>Purpose:</b> {form?.purpose} <br />
                <b>From PPMP:</b> {form ? (form?.from_ppmp == 1 ? "Yes" : "No") : ""} <br />
                {/* <b>Responsibility Center Code:</b> {form?.center_code} <br /> */}
                {/* <b>Fund Cluster:</b> {form?.fund_cluster} <br /> */}
                <b>Total Unit Cost:</b> { helpers.currencyFormat(form?.total_cost) } <br />
                <b>Charge To:</b> {form?.charge_to} <br />
                <b>Alloted Amount:</b> { helpers.currencyFormat(form?.alloted_amount) } <br />
                <b>UACS Code:</b> {form?.uacs_code?.name} <br />
                <b>SA/OR:</b> {form?.sa_or} <br />
                <b>Mode of Procurement:</b> {form.mode_of_procurement?.name} <br />
                <b>Account:</b> {form.account?.parent?.name} {form.account?.name} <br />
                <b>Requested by Signatory:</b> {form?.requested_by_name} <br />
                <b>Approved by Signatory:</b> {form?.approved_by_name} <br />
                <b>Status:</b> {form?.status} <br />
            </p>
        </div>
    );
}

export default InfoPurchaseRequest;