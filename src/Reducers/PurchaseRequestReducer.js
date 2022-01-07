const initialState = () => {
    return {
      formData: {
        items: [],
        requestedBy: "OARDA",
        approvedBy: "ORD",
      },
      formErrors: {},
      formProccess: [],
      requestedBySignatory: {},
      approvedBySignatory: {},
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_PURCHASE_REQUEST_FORM_DATA':
        return {
          ...state,
          formData: action.data,
        };
      case 'SET_PURCHASE_REQUEST_FORM_ERRORS':
        return {
          ...state,
          formErrors: action.data,
        };
      case 'SET_PURCHASE_REQUEST_FORM_PROCCESS':
        return {
          ...state,
          formProccess: action.data,
        };
      case 'SET_PURCHASE_REQUEST_REQUESTED_BY_SIGNATORY':
        return {
          ...state,
          requestedBySignatory: action.data,
        };
      case 'SET_PURCHASE_REQUEST_APPROVED_BY_SIGNATORY':
        return {
          ...state,
          approvedBySignatory: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }