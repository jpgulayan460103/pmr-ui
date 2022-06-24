import axios from './axios.settings'

export default {
  save(formdata, formType){
    if(formType != "create"){
      return axios.put(`api/item-supplies/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/item-supplies`,formdata);
    }
  },
  all(formdata){
    return axios.get(`api/item-supplies`,{
      params: formdata
    });
  },
  get(id){
    return axios.get(`api/item-supplies/${id}`);
  },

  logger(id){
    return axios.get(`api/logger/procurement-plan/${id}`);
  },

  management(){
    return axios.get(`api/summaries/procurement-management`);
  }
}