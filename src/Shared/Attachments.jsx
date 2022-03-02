import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

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
} from '@ant-design/icons';


import { cloneDeep, isEmpty,  } from 'lodash';
import api from '../api';


const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Dragger } = Upload;

const { Option } = Select;


function mapStateToProps(state) {
    return {
        selectedPurchaseRequest: state.procurement.selectedPurchaseRequest,
        procurementTypes: state.library.procurement_types,
        modeOfProcurements: state.library.mode_of_procurements,
        purchaseRequestTab: state.procurement.purchaseRequestTab,
        purchaseRequests: state.procurement.purchaseRequests,
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
        for (let index = 0; index < fileList.length; index++) {
            let file = fileList[index];
            let formData = new FormData();
            formData.append('files[]', file);
            formData.append('meta[uid]', file.uid);
            formData.append('meta[description]', file.description);
            
            updateFile(index, {
                uploading: "uploading",
            });
            await uploadFile(formData, index)
        }
        setfileList(fileList.filter(i => i.status != 'done'));
    }

    const uploadProgress = (progressEvent, index) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        updateFile(index, {
            progress: percentCompleted,
        });
    }

    const uploadFile = async (formData, index) => {
        return api.Forms.upload(formData, index, uploadProgress)
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
        if(item.uploading == "done" && item.status == "error"){
            actions.push(<a key="list-loadmore-edit" onClick={() => deleteFile(index)}><DeleteOutlined /></a>)
        }
        if(item.uploading == ""){
            actions.push(<a key="list-loadmore-edit" onClick={() => deleteFile(index)}><DeleteOutlined /></a>)
        }
        return actions;
    }
    
    return (
        <div>
            <div>
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

            <List
                size="small"
                header={<div>Selected Files</div>}
                footer={<div>{ fileList.length } files</div>}
                bordered
                dataSource={fileList}
                renderItem={(item, index) => (
                    <List.Item
                        actions={uploadingAction(item, index)}
                    >
                        <div className={item.status == 'error' ? 'truncate text-red-500' : (item.status == 'done' ? 'truncate text-blue-500' : 'truncate')} style={{width: "50%"}}>
                            <Tooltip placement="top" title={item.response}>
                                <PaperClipOutlined />
                                <span className='ml-2'>{item.name}</span>
                            </Tooltip>
                        </div>
                        <div className="truncate" style={{width: "30%"}}>
                            <Input placeholder="Description" value={item.description} onChange={(e) => updateFile(index, {description: e.target.value})} />
                        </div>

                    </List.Item>
                    )
                }
            />
            <Button
                type="primary"
                onClick={() => handleUpload()}
            >
            Start Upload
            </Button>
        </div>
    );
}

export default connect(
    mapStateToProps,
)(Attachments);
