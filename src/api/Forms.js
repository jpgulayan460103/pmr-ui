import axios from './axios.settings'

export default {
  getForApproval(formData){
    return axios.get(`api/forms/routes/requests/pending`,{
      params: formData
    });
  },
  getApproved(formData){
    return axios.get(`api/forms/approved`,{
      params: formData
    });
  },
  getRejected(formData){
    return axios.get(`api/forms/rejected`,{
      params: formData
    });
  },
  approve(id, formData){
    return axios.post(`api/forms/routes/requests/pending/${id}/approve`, formData);
  },
  reject(id, formData){
    return axios.post(`api/forms/routes/requests/pending/${id}/reject`, formData);
  },
  resolve(id, formData){
    return axios.post(`api/forms/routes/requests/pending/${id}/approve`, formData);
  },
  updateProcess(formData){
    return axios.put(`api/forms/process/${formData.id}`, formData);
  },
  getRoute(id){
    return axios.get(`api/forms/routes/${id}`);
  },
  upload(type, id, files, index, uploadProgress){
    return axios.post(`api/forms/uploads/${type}/${id}`, files, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => uploadProgress(progressEvent, index)
    });
  },
  deleteUpload(type, id){
    return axios.delete(`api/forms/uploads/${type}/${id}`);
  },
  getLogs(formData){
    return axios.get(`api/logger/all`, {
      params: formData
    });
  }
}