import React from 'react';
import helpers from '../../../Utilities/helpers';

function InfoProcurementPlan({form}) {
    return (
        <div>
            <p>
                <b>PPMP Type:</b> {form?.procurement_plan_type?.name} <br />
                <b>PPMP No.:</b> {form?.ppmp_number} <br />
                <b>PPMP Date:</b> {form?.ppmp_date} <br />
                <b>PPMP CY:</b> {form?.calendar_year} <br />
                <b>End User:</b> {form?.end_user?.name} <br />
                <b>Title:</b> {form?.title} <br />
                <b>Purpose:</b> {form?.purpose} <br />
                <b>Annex A Grand Total:</b> { helpers.currencyFormat(form?.total_price_a) } <br />
                <b>Annex A Provision for Inflation:</b> { helpers.currencyFormat(form?.inflation_a) } <br />
                <b>Annex A Contingency:</b> { helpers.currencyFormat(form?.contingency_a) } <br />
                <b>Annex A Total Estimated Budget:</b> { helpers.currencyFormat(form?.total_estimated_budget_a) } <br />
                <b>Annex B Grand Total:</b> { helpers.currencyFormat(form?.total_price_b) } <br />
                <b>Annex B Provision for Inflation:</b> { helpers.currencyFormat(form?.inflation_b) } <br />
                <b>Annex B Contingency:</b> { helpers.currencyFormat(form?.contingency_b) } <br />
                <b>Annex B Total Estimated Budget:</b> { helpers.currencyFormat(form?.total_estimated_budget_b) } <br />
                <b>Grand Total:</b> { helpers.currencyFormat(form?.total_price_a + form?.total_price_b) } <br />
                <b>Provision for Inflation:</b> { helpers.currencyFormat(form?.inflation_a + form?.inflation_b) } <br />
                <b>Contingency:</b> { helpers.currencyFormat(form?.contingency_a + form?.contingency_b) } <br />
                <b>Total Estimated Budget:</b> { helpers.currencyFormat(form?.total_estimated_budget_a + form?.total_estimated_budget_b) } <br />
                <b>Prepared by Signatory:</b> {form?.prepared_by_name} <br />
                <b>Certified by Signatory:</b> {form?.certified_by_name} <br />
                <b>Approved by Signatory:</b> {form?.approved_by_name} <br />
                <b>Status:</b> {form?.status} <br />
            </p>
        </div>
    );
}

export default InfoProcurementPlan;