import axios from './axios.settings'

export default {
  getLibraries(arg){
    return axios.get(`api/libraries/${arg}`);
  },
}