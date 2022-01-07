import axios from './axios.settings'

export default {
  getLibraries(arg){
    return axios.get(`api/signatories/${arg}`);
  },
  all(){
    return axios.get(`api/signatories`);
  },
}