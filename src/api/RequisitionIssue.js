import axios from './axios.settings'

export default {
  save(formdata, formType){
    if(formType != "create"){
      return axios.put(`api/requisition-issues/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/requisition-issues`,formdata);
    }
  },
  all(formdata){
    return axios.get(`api/requisition-issues`,{
      params: formdata
    });
  },
  get(id){
    return axios.get(`api/requisition-issues/${id}`);
  },

  logger(id){
    return axios.get(`api/logger/procurement-plan/${id}`);
  },
}