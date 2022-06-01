import axios from './axios.settings'

export default {
  save(formdata, formType){
    if(formType != "create"){
      return axios.put(`api/procurement-plans/${formdata.id}`,formdata);
    }else{
      return axios.post(`api/procurement-plans`,formdata);
    }
  },
}