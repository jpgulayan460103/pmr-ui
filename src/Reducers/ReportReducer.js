const initialState = () => {
    return {
      purchaseRequest: {},
      filterData: {
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
      case 'SET_REPORT_FILTER_DATA':
        return {
          ...state,
          filterData: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }