import axios from './axios.settings'

export default {
  save(formdata, formType){
    if(formType != "create"){
      return axios.put(`api/suppliers/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/suppliers`,formdata);
    }
  },
  all(){
    return axios.get(`api/suppliers`);
  },
  get(id){
    return axios.get(`api/suppliers/${id}`);
  },
}