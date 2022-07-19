const initialState = () => {
    let paginationMeta = {
      current_page: 1,
      total: 1,
      per_page: 1,
    };
    return {
        purchaseRequests: [],
        purchaseRequestPagination: paginationMeta,
        procurementPlans: [],
        procurementPlanPagination: paginationMeta,
        requisitionIssues: [],
        requisitionIssuesPagination: paginationMeta,
        loading: false,
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_FORM_ALL_FORM_PURCHASE_REQUESTS':
        return {
          ...state,
          purchaseRequests: action.data,
        };
      case 'SET_FORM_ALL_FORM_PROCUREMENT_PLANS':
        return {
          ...state,
          procurementPlans: action.data,
        };
      case 'SET_FORM_ALL_FORM_REQUISITION_ISSUES':
        return {
          ...state,
          requisitionIssues: action.data,
        };
      case 'SET_FORM_ALL_FORM_PURCHASE_REQUEST_PAGINATION':
        return {
          ...state,
          purchaseRequestPagination: action.data,
        };
      case 'SET_FORM_ALL_FORM_PROCUREMENT_PLAN_PAGINATION':
        return {
          ...state,
          procurementPlanPagination: action.data,
        };
      case 'SET_FORM_ALL_FORM_REQUISITION_ISSUE_PAGINATION':
        return {
          ...state,
          requisitionIssuesPagination: action.data,
        };
      case 'SET_FORM_ALL_FORM_LOADING':
        return {
          ...state,
          loading: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }