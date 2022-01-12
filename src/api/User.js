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
  toggleStatusUser(user){
    return axios.post(`api/users/active-status/${user.id}`);
  },
  toggleRoleUser(user){
    return axios.post(`api/users/role-status/${user.id}`);
  },
}