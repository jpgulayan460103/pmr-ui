import React, { useState, useEffect  } from 'react';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Prompt
  } from "react-router-dom";

import {
    notification,
    Tabs,
    Skeleton,
    Collapse,
    message,
    Upload,
    Button,
    List,
    Progress,
    Select,
    Popconfirm,
    Tooltip,
    Popover,
} from 'antd';

import {
    UploadOutlined,
    DeleteOutlined,
    InboxOutlined,
    DownloadOutlined,
    CloudUploadOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';


import { cloneDeep, isEmpty,  } from 'lodash';
import api from '../api';
import { RouterPrompt } from './RouterPrompt';
import helpers from '../Utilities/helpers';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Dragger } = Upload;

const { Option } = Select;
function mapStateToProps(state) {
    return {
        user: state.user.data
    };
}

const handleDownload = (item) => {
    window.open(item.file_directory); 
}

const Attachments = (props) => {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        setFiles(props.fileList);
    }, [props.fileList]);
    const handleConfirm = (item) => {
        console.log(item);
        api.Forms.deleteUpload(item.upload_type, item.id)
        .then(res => {
            setFiles(prev => prev.filter(i => i.id != item.id));
        })
        .catch(err => {})
        .then(res => {})
    }

    const attachmentActions = (item, index) => {
        let actions = [];
        actions.push(<Tooltip placement="top" title="Download">
        <Button size='small' icon={<DownloadOutlined />} type="link" onClick={()=> handleDownload(item)} />
    </Tooltip>);
        if(props.user.id === item.user_id){
            actions.push(
                <Popconfirm
                    title="Are you sure to delete this attachment?"
                    onConfirm={() => handleConfirm(item) }
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                    placement='left'
                >
                    <Tooltip placement="top" title="Delete">
                        <Button size='small' icon={<DeleteOutlined />} type="link" />
                    </Tooltip>
                </Popconfirm>
            );
        }
        return actions;
    }


    const popOverContent = (item) => {
        return (
            <div>
                <p>
                    <b>Size:</b> <span>{helpers.bytesToSize(item.filesize)}</span><br />
                    <b>Uploaded by:</b> <span>{item.uploader?.user_information?.fullname}</span><br />
                    <b>Uploaded on:</b> <span>{item.created_at}</span><br />
                </p>
            </div>
        )
    }
    return (
        <div>
            <List
                    size="small"
                    header={<div className='flex justify-between'>
                        <div>Attached Files</div>
                        <div>
                            <span className='custom-pointer' onClick={() => props.setShowUpload(true)}>
                                <CloudUploadOutlined /> Upload Files
                            </span>
                        </div>
                    </div>}
                    footer={<div>{ files?.length } files</div>}
                    bordered
                    dataSource={files}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={attachmentActions(item, index)}
                            className="form-upload-selected-files"
                        >
                            <div className="truncate" style={{width: "60%"}}>
                                <Popover placement="left" title={item.title} content={popOverContent(item)} trigger="hover">
                                    <Button size='small' icon={<QuestionCircleOutlined />} type="link" />
                                </Popover>
                                <span className='ml-2'>{item.title}</span>
                            </div>
                            <div className="truncate" style={{width: "30%"}}>

                            </div>

                        </List.Item>
                        )
                    }
                />
        </div>
    );
}
export default connect(
    mapStateToProps,
)(Attachments);

