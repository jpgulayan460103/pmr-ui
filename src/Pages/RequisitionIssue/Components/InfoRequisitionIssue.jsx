import React from 'react';

function InfoRequisitionIssue({form}) {
    return (
        <div className='p-2'>
            <p>
                <b>RIS No.:</b> {form?.ris_number || ""} <br />
                <b>RIS Date:</b> {form?.ris_date || ""} <br />
                <b>End User:</b> {form?.end_user?.name || ""} <br />
                <b>Purpose:</b> {form?.purpose || ""} <br />
            </p>
        </div>
    );
}

export default InfoRequisitionIssue;