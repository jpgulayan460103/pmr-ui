import axios from './axios.settings'

export default {
  getLogs(formData){
    return axios.get(`api/logger/all`, {
      params: formData
    });
  },
  getUserLogs(formData){
    return axios.get(`api/logger/user-activities`, {
      params: formData
    });
  }
}