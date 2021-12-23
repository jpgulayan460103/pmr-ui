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
  getUsers(){
    return axios.get(`api/users`);
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