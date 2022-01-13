import axios from './axios.settings'

export default {
  getForApproval(){
    return axios.get(`api/form-routes`);
  },
}