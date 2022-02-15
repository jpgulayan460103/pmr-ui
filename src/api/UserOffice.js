import axios from './axios.settings'

export default {
  getLibraries(arg){
    return axios.get(`api/user_offices/${arg}`);
  },
  all(){
    return axios.get(`api/user_offices`);
  },
}