import axios from './axios.settings'

export default {
  login(formdata){
    return axios.post(`api/login`,formdata);
  },
  save(formdata, formType){
    if(formType != "create"){
      return axios.put(`api/users/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/users`,formdata);
    }
  },
  loginAd(formdata){
    return axios.post(`api/active-directory/login`,formdata);
  },
  registerAd(formdata){
    return axios.post(`api/register`,formdata);
  },
  all(){
    return axios.get(`api/users`);
  },
  auth(){
    return axios.get(`api/user`);
  },
  get(id){
    return axios.get(`api/users/${id}`);
  },
  logout(){
    return axios.post(`api/logout`);
  },
  refresh(refresh_token){
    return axios.post(`api/auth/refresh`, {
      'refresh_token': refresh_token
    });
  },
  toggleStatusUser(user){
    return axios.post(`api/users/active-status/${user.id}`);
  },
  toggleRoleUser(user){
    return axios.post(`api/users/role-status/${user.id}`);
  },
  updatePermission(formData){
    return axios.post(`api/users/${formData.user_id}/permissions`, formData);
  },

  saveFirebaseToken(formData){
    return axios.post(`api/tokens/firebase`, formData);
  },

  getNotifications(){
    return axios.get(`api/notifications`);
  },
  readNotifications(id){
    return axios.put(`api/notifications/${id}`);
  },
  deleteNotification(id){
    return axios.delete(`api/notifications/${id}`);
  },
  clearNotifications(){
    return axios.delete(`api/notifications`);
  },
}