const initialState = () => {
    return {
      purchaseRequest: {},
      tableFilter: {
        end_user_id: null,
        month: "",
      }
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_REPORT_PURCHASE_REQUEST':
        return {
          ...state,
          purchaseRequest: action.data,
        };
      case 'SET_REPORT_TABLE_FILTER':
        return {
          ...state,
          tableFilter: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }