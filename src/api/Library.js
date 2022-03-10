import axios from './axios.settings'

export default {
  getLibraries(arg){
    return axios.get(`api/libraries/${arg}`);
  },
  all(){
    return axios.get(`api/libraries`);
  },
  save(arg, formdata, formType){
    if(formType != "Create"){
      return axios.put(`api/libraries/${arg}/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/libraries/${arg}`,formdata);
    }
  },
}