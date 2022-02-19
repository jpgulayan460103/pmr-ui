import axios from './axios.settings'

export default {
  getForApproval(formData){
    return axios.get(`api/forms/routes/requests/pending`,{
      params: formData
    });
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
  getRoute(id){
    return axios.get(`api/forms/routes/${id}`);
  },
}