import React from 'react';

function InfoPurchaseRequest({form}) {
    return (
        <div className='p-2'>
            <p>
                <b>PR No.:</b> {form?.pr_number || ""} <br />
                <b>PR Date:</b> {form?.pr_date || ""} <br />
                <b>Procurement Description Classification:</b> {form.account?.parent?.name || ""} <br />
                <b>Procurement Description:</b> {form.account?.name || ""} <br />
                <b>Mode of Procurement:</b> {form.mode_of_procurement?.name || ""} <br />
                <b>End User:</b> {form?.end_user?.name || ""} <br />
                <b>Fund Cluster:</b> {form?.fund_cluster || ""} <br />
                <b>Responsibility Center Code:</b> {form?.center_code || ""} <br />
                <b>Total Unit Cost:</b> {form?.total_cost_formatted || ""} <br />
                <b>Purpose:</b> {form?.purpose || ""} <br />
                <b>Charge To:</b> {form?.charge_to || ""} <br />
                <b>Alloted Amount:</b> {form?.alloted_amount || ""} <br />
                <b>UACS Code:</b> {form?.uacs_code?.name || ""} <br />
                <b>SA/OR:</b> {form?.sa_or || ""} <br />
            </p>
        </div>
    );
}

export default InfoPurchaseRequest;