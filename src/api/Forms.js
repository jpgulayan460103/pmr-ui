import axios from './axios.settings'

export default {
  getForApproval(){
    return axios.get(`api/form/routes/requests/pending`);
  },
  approve(id){
    return axios.post(`api/form/routes/requests/pending/${id}/approve`);
  },
  reject(id, formData){
    return axios.post(`api/form/routes/requests/pending/${id}/reject`, formData);
  },
  resolve(id, formData){
    return axios.post(`api/form/routes/requests/pending/${id}/approve`, formData);
  }
}