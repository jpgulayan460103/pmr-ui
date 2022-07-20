import React from 'react';
import { Timeline  } from 'antd';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    QuestionCircleOutlined,
    LoadingOutlined,
    FileZipFilled,
} from '@ant-design/icons';
import helpers from '../Utilities/helpers';


function FormRouting({timelines}) {
    const timelineContent = (timeline) => {
        let created;
        let tat_text;
        let status;
        let remarks;
        let office;
        let remarksUser;
        let forwardedUser;
        let color =""
        let logo =""
        created = <span>Created on <i>{ timeline.created_at }</i><br /></span>;
        status = <span>{timeline.status_str} on <i>{ timeline.updated_at }</i><br /></span>;
        tat_text = <span>Turnaround Time: <i>{ helpers.turnAroundTime(timeline.updated_at_raw, timeline.created_at_raw) }</i><br /></span>;
        office = <span><b>{timeline.to_office?.name}</b> <br /></span>;
        remarks = <span>Remarks: {timeline.remarks}<br /></span>;
        forwardedUser = <span>From: {timeline.forwarded_by?.user_information?.fullname}<br /></span>;
        remarksUser = <span>{timeline.status_str} by {timeline.processed_by?.user_information?.fullname}<br /></span>;
        switch (timeline.status) {
            case "approved":
                color = "green";
                logo = <CheckCircleOutlined />;
                break;
            case "rejected":
                color = "red";
                logo = <ExclamationCircleOutlined />;
                break;
            case "with_issues":
                color = "blue";
                logo = <QuestionCircleOutlined />;
                break;
            case "resolved":
                color = "blue";
                logo = <CheckCircleOutlined />;
                break;
            case "archived":
                // color = "red";
                logo = <FileZipFilled />;
                break;
            default:
                tat_text = "";
                color = "gray";
                logo = <LoadingOutlined />
                break;
        }
        if(timeline.action_taken == null){
            color = "gray";
            logo = <LoadingOutlined />
            tat_text = "";
            remarks = "";
            forwardedUser = "";
            remarksUser = "";
        }
        let label = (<>
            { office }
            { created }
            { status }
            { tat_text }
            { remarks }
            { forwardedUser }
            { remarksUser }
        </>)
        return { label, color, logo }
    }
    return (
        <div className='pt-4'>
            <Timeline>
                { timelines.map((timeline, index) => {
                    return <Timeline.Item dot={timelineContent(timeline).logo} color={timelineContent(timeline).color} key={index}>{timelineContent(timeline).label}</Timeline.Item>
                }) }
            </Timeline>
        </div>
    );
}

export default FormRouting;