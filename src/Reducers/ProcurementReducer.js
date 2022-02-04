const initialState = () => {
    return {
      selectedPurchaseRequest: {},
      columns: [],
      purchaseRequestTab: "edit-form",
      purchaseRequests: [],
      purchaseRequestsPagination: {
        current_page: 1,
        total: 1,
        per_page: 1,
      },
      purchaseRequestsTableFilter: {
        page: 1,
        type: 'procurement',
      },
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
      case 'SET_PROCUREMENT_SET_PURCHASE_REQUEST_TAB':
        return {
          ...state,
          purchaseRequestTab: action.data,
        };
      case 'SET_PROCUREMENT_SET_PURCHASE_REQUESTS':
        return {
          ...state,
          purchaseRequests: action.data,
        };
      case 'SET_PROCUREMENT_SET_PURCHASE_REQUESTS_PAGINATION':
        return {
          ...state,
          purchaseRequestsPagination: action.data,
        };
      case 'SET_PROCUREMENT_SET_PURCHASE_REQUESTS_TABLE_FILTER':
        return {
          ...state,
          purchaseRequestsTableFilter: action.data,
        };
      case 'SET_PROCUREMENT_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }