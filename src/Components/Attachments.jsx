import React, { useEffect, useState } from 'react';
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
    Input,
    Tooltip,
} from 'antd';

import {
    UploadOutlined,
    DeleteOutlined,
    InboxOutlined,
    PaperClipOutlined,
    WarningOutlined,
} from '@ant-design/icons';


import { cloneDeep, isEmpty,  } from 'lodash';
import api from '../api';
import { RouterPrompt } from './RouterPrompt';


const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Dragger } = Upload;

const { Option } = Select;


function mapStateToProps(state) {
    return {
        uploadingFiles: state.user.uploadingFiles,
    };
}

const Attachments = (props) => {


    const [fileList, setfileList] = useState([]);

    const uploadProps = {
        multiple: true,
        onRemove: file => {
            setfileList(prev => {
              const index = prev.indexOf(file);
              const newFileList = prev.slice();
              newFileList.splice(index, 1);
              return newFileList;
            });
        },
        beforeUpload: file => {
            console.log(file);
            file['description'] = "";
            file['uploading'] = "";
            setfileList(prev => [...prev, file]);
            return false;
        },
    };

    const deleteFile = (index) => {
        setfileList(prev => {
            const newFileList = prev.slice();
            newFileList.splice(index, 1);
            return newFileList;
        });
    }
    const handleUpload = async () => {
        props.dispatch({
            type: "SET_UPLOADING_FILES",
            data: true,
        });
        setfileList(prev => {
            return prev.map(i => {
                i.status = "";
                i.uploading = "";
                return i;
            })
        });
        for (let index = 0; index < fileList.length; index++) {
            let file = fileList[index];
            let formData = new FormData();
            formData.append('files[]', file);
            formData.append('meta[uid]', file.uid);
            formData.append('meta[description]', file.description);
            
            updateFile(index, {
                uploading: "uploading",
                status: "",
            });
            await uploadFile(formData, index)
        }
        setfileList(fileList.filter(i => i.status != 'done'));
        props.dispatch({
            type: "SET_UPLOADING_FILES",
            data: false,
        });
    }

    const uploadProgress = (progressEvent, index) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        updateFile(index, {
            progress: percentCompleted,
        });
    }

    const uploadFile = async (formData, index) => {
        return api.Forms.upload(props['form-type'], props['form-id'], formData, index, uploadProgress)
        .then(res => {
            updateFile(index, {
                status: "done",
                response: "Uploaded",
                uploading: "done",
            });
        })
        .catch(error => {
            if (error.response) {
                switch (error.response.status) {
                    case 422:
                        updateFile(index, {
                            status: "error",
                            response: error.response.data.message,
                            uploading: "done",
                        });
                        break;
                    case 500:
                        updateFile(index, {
                            status: "error",
                            response: "Upload error",
                            uploading: "done",
                        });
                        break;
                
                    default:
                        break;
                }
            }
        })
        .then(res => {})
        ;
    }

    const updateFile = (index, data) => {
        let clonedFileList = cloneDeep(fileList);
        if(data.status){
            clonedFileList[index].status = data.status
        }
        if(data.response){
            clonedFileList[index].response = data.response
        }
        if(data.progress){
            clonedFileList[index].progress = data.progress
        }
        if(data.description){
            clonedFileList[index].description = data.description
        }
        if(data.uploading){
            clonedFileList[index].uploading = data.uploading
        }
        setfileList(clonedFileList);
    }

    const uploadingAction = (item, index) => {
        let actions = [];
        if(item.uploading == "uploading"){
            actions.push(<Progress type="circle" width={20} percent={item.progress} />)
        }
        if(item.uploading == "done" && item.status == "done"){
            actions.push(<Progress type="circle" width={20} percent={item.progress} />)
        }
        if(item.uploading == "done" && item.status == "error" && !props.uploadingFiles){
            actions.push(<a key="list-loadmore-edit" onClick={() => deleteFile(index)}><DeleteOutlined /></a>)
        }
        if(item.uploading == "done"  && item.status == "error" && props.uploadingFiles ){
            actions.push(<span className='text-red-500'><WarningOutlined /></span>)
        }
        if(item.uploading == "" && !props.uploadingFiles){
            actions.push(<a key="list-loadmore-edit" onClick={() => deleteFile(index)}><DeleteOutlined /></a>)
        }
        if(item.uploading == "" && props.uploadingFiles){
            actions.push(<Progress type="circle" width={20} percent={0} />)
        }
        return actions;
    }
    
    return (
        <div>

        <RouterPrompt
            when={props.uploadingFiles}
            title="Uploading your files"
            content="Please wait for the system to finish uploading."
            cancelText="Cancel"
            okText="Confirm"
            onOK={() => true}
            onCancel={() => false}
            hasConfirm={false}
        />
            <div className='mb-2'>
                <Dragger
                    {...uploadProps}
                    maxCount={20}
                    itemRender={(originNode, file, currFileList) => (
                        <></>
                    )}
                >
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        
                </Dragger>
            </div>

            <div className='mb-2'>
                <List
                    size="small"
                    header={<div>Selected Files</div>}
                    footer={<div>{ fileList.length } files</div>}
                    bordered
                    dataSource={fileList}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={uploadingAction(item, index)}
                            className="form-upload-selected-files"
                        >
                            <div className={item.status == 'error' ? 'truncate text-red-500' : (item.status == 'done' ? 'truncate text-blue-500' : 'truncate')} style={{width: "50%"}}>
                                <Tooltip placement="top" title={item.response}>
                                    <PaperClipOutlined />
                                    <span className='ml-2'>{item.name}</span>
                                </Tooltip>
                            </div>
                            <div className="truncate" style={{width: "30%"}}>
                                { props.uploadingFiles ? (<>{item.description}</>) : (<Input placeholder="Description" value={item.description} onChange={(e) => updateFile(index, {description: e.target.value})} size="small" />) }
                            </div>

                        </List.Item>
                        )
                    }
                />
                </div>
            <Button
                type="primary"
                onClick={() => handleUpload()}
                disabled={props.uploadingFiles}
                loading={props.uploadingFiles}
            >
            Start Upload
            </Button>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Attachments);
