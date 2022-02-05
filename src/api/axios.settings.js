import axios from 'axios'


// baseURL: (process.env.NODE_ENV == "development" ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL)
const customAxios = axios.create({
  baseURL: "https://pmr-api.kantobogs.com"
});
if(sessionStorage.getItem("session")){
  let token = JSON.parse(sessionStorage.getItem("session"));
  let access_token = token.access_token;
  customAxios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
}
export default customAxios;