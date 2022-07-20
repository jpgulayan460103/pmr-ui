import axios from './axios.settings'

export default {
  save(formdata, formType){
    if(formType != "create"){
      return axios.put(`api/procurement-plans/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/procurement-plans`,formdata);
    }
  },
  all(formdata){
    return axios.get(`api/procurement-plans`,{
      params: formdata
    });
  },
  get(id){
    return axios.get(`api/procurement-plans/${id}`);
  },

  logger(id){
    return axios.get(`api/logger/procurement-plan/${id}`);
  },

  management(){
    return axios.get(`api/summaries/procurement-management`);
  },

  archive(formdata){
    return axios.post(`api/procurement-plans/${formdata.id}/archive`,formdata);
  },
}