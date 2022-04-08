import axios from './axios.settings'

export default {
  purchaseRequest(formData = {}){
    return axios.get(`api/reports/purchase-request`, {
      params: formData
    });
  },
}