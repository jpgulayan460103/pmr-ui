import axios from 'axios'


const customAxios = axios.create({
  baseURL: (process.env.NODE_ENV == "development" ? process.env.REACT_APP_DEVELOPMENT_URL : process.env.REACT_APP_PRODUCTION_URL)
});
if(sessionStorage.getItem("session")){
  let token = JSON.parse(sessionStorage.getItem("session"));
  let access_token = token.access_token;
  customAxios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
}
export default customAxios;