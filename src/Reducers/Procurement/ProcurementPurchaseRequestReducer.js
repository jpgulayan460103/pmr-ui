import helpers from "../../Utilities/helpers";

const initialState = () => {
    return {
      selectedPurchaseRequest: {},
      columns: [],
      tab: "information",
      purchaseRequests: [],
      pagination: {
        current_page: 1,
        total: 1,
        per_page: 1,
      },
      tableFilter: {
        page: 1,
        type: 'procurement',
        purchase_request_type_category: [],
        pr_date: helpers.defaultDateRange,
      },
      tableLoading: false,
      workspaceLoading: false,
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SELECT_PURCHASE_REQUEST':
        return {
          ...state,
          selectedPurchaseRequest: action.data,
        };    
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      case 'SET_PROCUREMENT_COLUMNS':
        return {
          ...state,
          columns: action.data,
        };
      case 'SET_PROCUREMENT_PURCHASE_REQUEST_TAB':
        return {
          ...state,
          tab: action.data,
        };
      case 'SET_PROCUREMENT_PURCHASE_REQUESTS_PURCHASE_REQUESTS':
        return {
          ...state,
          purchaseRequests: action.data,
        };
      case 'SET_PROCUREMENT_PURCHASE_REQUESTS_PAGINATION':
        return {
          ...state,
          pagination: action.data,
        };
      case 'SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_FILTER':
        return {
          ...state,
          tableFilter: action.data,
        };
      case 'SET_PROCUREMENT_PURCHASE_REQUESTS_TABLE_LOADING':
        return {
          ...state,
          tableLoading: action.data,
        };
      case 'SET_PROCUREMENT_PURCHASE_REQUESTS_WORKSPACE_LOADING':
        return {
          ...state,
          workspaceLoading: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }