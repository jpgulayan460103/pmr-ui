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
  all(){
    return axios.get(`api/purchase-requests`);
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
}