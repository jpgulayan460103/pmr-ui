import axios from 'axios'
import { Modal, Button, Space } from 'antd';


const customAxios = axios.create({
  baseURL: (process.env.NODE_ENV == "development" ? process.env.REACT_APP_DEVELOPMENT_URL : process.env.REACT_APP_PRODUCTION_URL)
});
if(localStorage.getItem("auth_token")){
  let token = JSON.parse(localStorage.getItem("auth_token"));
  let access_token = token.access_token;
  customAxios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
}

// Add a response interceptor
customAxios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  let baseURL = (process.env.NODE_ENV == "development" ? process.env.REACT_APP_DEVELOPMENT_URL : process.env.REACT_APP_PRODUCTION_URL);

  if(error.response){
    switch (error.response.status) {
      case 401:
        if(error.request.responseURL === `${baseURL}/api/logout`){
          return false;
        }
        localStorage.removeItem("auth_token");
        Modal.error({
          title: 'Session Expired',
          content: (
            <div>
              <p>Please reload the page.</p>
            </div>
          ),
          onOk() {
            Modal.destroyAll();
          },
        });
        break;
      case 403:
        Modal.error({
          title: 'Access denied',
          content: (
            <div>
              <p>You don't have permission to access or to make action to this resource.</p>
            </div>
          ),
          onOk() {
            Modal.destroyAll();
          },
        });
        break;
      case 404:
        Modal.error({
          title: 'Resource not found',
          content: (
            <div>
              <p>This resource has been removed or not existed.</p>
            </div>
          ),
          onOk() {
            Modal.destroyAll();
          },
        });
        break;
      case 429:
        Modal.error({
          title: 'Too many request',
          content: (
            <div>
              <p>Please try again in a minute.</p>
            </div>
          ),
          onOk() {
            Modal.destroyAll();
          },
        });
        break;
      default:
        break;
    }

    if (error.response.status >= 500) {
      Modal.error({
        title: 'Server Error',
        content: (
          <div>
            <p>Please try again later.</p>
          </div>
        ),
        onOk() {
          Modal.destroyAll();
        },
      });
    }
  }


  return Promise.reject(error);
});
export default customAxios;