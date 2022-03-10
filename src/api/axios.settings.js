import axios from 'axios'
import { Modal, Button, Space } from 'antd';


const customAxios = axios.create({
  baseURL: (process.env.NODE_ENV == "development" ? process.env.REACT_APP_DEVELOPMENT_URL : process.env.REACT_APP_PRODUCTION_URL)
});
if(sessionStorage.getItem("session")){
  let token = JSON.parse(sessionStorage.getItem("session"));
  let access_token = token.access_token;
  customAxios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
}

// Add a response interceptor
customAxios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  let baseURL = (process.env.NODE_ENV == "development" ? process.env.REACT_APP_DEVELOPMENT_URL : process.env.REACT_APP_PRODUCTION_URL);
  if (error.response && error.response.status == 401) {
    if(error.request.responseURL === `${baseURL}/api/logout`){
      return false;
    }
    sessionStorage.removeItem('session');
    Modal.error({
      title: 'Session Expired',
      content: (
        <div>
          <p>Please reload the page.</p>
        </div>
      ),
      onOk() {},
    });
  } else if (error.response && error.response.status == 403) {
    Modal.error({
      title: 'Access denied',
      content: (
        <div>
          <p>You don't have permission to access or to make action to this resource.</p>
        </div>
      ),
      onOk() {},
    });
  } else if (error.response && error.response.status >= 500) {
    Modal.error({
      title: 'Server Error',
      content: (
        <div>
          <p>Please try again later.</p>
        </div>
      ),
      onOk() {},
    });
  }
  return Promise.reject(error);
});
export default customAxios;