const initialState = () => {
    return {
      formData: {},
      formErrors: {},
      formType: "create",
      suppliers: [],
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_SUPPLIER_FORM_DATA':
        return {
          ...state,
          formData: action.data,
        };
      case 'SET_SUPPLIER_FORM_ERRORS':
        return {
          ...state,
          formErrors: action.data,
        };
      case 'SET_SUPPLIER_FORM_TYPE':
        return {
          ...state,
          formType: action.data,
        };
      case 'RESET_SUPPLIER_FORM_DATA':
        return {
          ...state,
          formData: {...initialState().formData, ...action.data},
        };
      case 'SET_SUPPLIERS':
        return {
          ...state,
          suppliers: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }