import axios from './axios.settings'

export default {
  purchaseRequest(){
    return axios.get(`api/reports/purchase-request`);
  },
}