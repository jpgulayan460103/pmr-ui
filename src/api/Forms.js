import axios from './axios.settings'
import ProcurementPlan from './ProcurementPlan';
import PurchaseRequest from './PurchaseRequest';
import RequisitionIssue from './RequisitionIssue';

export default {
  getForApproval(formData){
    return axios.get(`api/forms/routes/requests/pending`,{
      params: formData
    });
  },
  getApproved(formData){
    return axios.get(`api/forms/approved`,{
      params: formData
    });
  },
  getRejected(formData){
    return axios.get(`api/forms/rejected`,{
      params: formData
    });
  },
  approve(id, formData){
    return axios.post(`api/forms/routes/requests/pending/${id}/approve`, formData);
  },
  reject(id, formData){
    return axios.post(`api/forms/routes/requests/pending/${id}/reject`, formData);
  },
  resolve(id, formData){
    return axios.post(`api/forms/routes/requests/pending/${id}/approve`, formData);
  },
  updateProcess(formData){
    return axios.put(`api/forms/process/${formData.id}`, formData);
  },
  getRoute(id){
    return axios.get(`api/forms/routes/${id}`);
  },
  get(id){
    return axios.get(`api/form-routes/${id}`);
  },
  upload(type, id, files, index, uploadProgress){
    return axios.post(`api/forms/uploads/${type}/${id}`, files, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => uploadProgress(progressEvent, index)
    });
  },
  deleteUpload(type, id){
    return axios.delete(`api/forms/uploads/${type}/${id}`);
  },

  getPurchaseRequests(formdata){
    return axios.get(`api/forms/purchase-requests`,{
      params: formdata
    });
  },
  getProcurementPlans(formdata){
    return axios.get(`api/forms/procurement-plans`,{
      params: formdata
    });
  },
  getRequisitionIssues(formdata){
    return axios.get(`api/forms/requisition-issues`,{
      params: formdata
    });
  },

  archive(formData, type){
    switch (type) {
      case 'requisition_issue':
        return RequisitionIssue.archive(formData);
        break;
      case 'purchase_request':
        return PurchaseRequest.archive(formData);
        break;
      case 'procurement_plan':
        return ProcurementPlan.archive(formData);
        break;
    
      default:
        break;
    }
  }
}