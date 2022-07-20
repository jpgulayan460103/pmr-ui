import axios from './axios.settings'

export default {
  login(formdata){
    return axios.post(`api/login`,formdata);
  },
  save(formdata, formType){
    if(formType != "create"){
      return axios.put(`api/purchase-requests/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/purchase-requests`,formdata);
    }
  },

  preview(formdata, formType){
    if(formType != "create"){
      return axios.put(`api/purchase-requests/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/pdf/preview/purchase-requests`,formdata);
    }
  },
  all(formdata){
    return axios.get(`api/purchase-requests`,{
      params: formdata
    });
  },
  get(id){
    return axios.get(`api/purchase-requests/${id}`);
  },
  logout(){
    return axios.post(`api/logout`);
  },
  toggleStatusUser(user){
    return axios.post(`api/users/active-status/${user.id}`);
  },
  toggleRoleUser(user){
    return axios.post(`api/users/role-status/${user.id}`);
  },
  approve(id){
    return axios.post(`api/purchase-requests/${id}/approve`);
  },
  logger(id){
    return axios.get(`api/logger/purchase-request/${id}`);
  },
  loggerProcurement(id){
    return axios.get(`api/logger/purchase-request/${id}?type=procurement`);
  },
  loggerItems(id){
    return axios.get(`api/logger/purchase-request/${id}/items`);
  },
  getBacData(id){
    return axios.get(`api/purchase-requests/${id}/bac-tasks`);
  },
  saveBacData(formdata){
    return axios.post(`api/purchase-requests/${formdata.purchase_request_id}/bac-tasks`, formdata);
  },
  getNextNumber(){
    return axios.get(`api/next-numbers/purchase-request`);
  },

  archive(formdata){
    return axios.post(`api/purchase-requests/${formdata.id}/archive`,formdata);
  },
}