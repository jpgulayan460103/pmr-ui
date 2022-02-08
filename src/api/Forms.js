import axios from './axios.settings'

export default {
  getForApproval(){
    return axios.get(`api/forms/routes/requests/pending`);
  },
  approve(id){
    return axios.post(`api/forms/routes/requests/pending/${id}/approve`);
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
}