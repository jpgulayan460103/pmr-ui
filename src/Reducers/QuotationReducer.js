const initialState = () => {
    return {
      formData: {},
      formErrors: {},
      formType: "create",
      selectedSupplier: {},
      selectedSuppliers: [],
      selectedSupplierContact: {},
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_QUOTATION_FORM_DATA':
        return {
          ...state,
          formData: action.data,
        };
      case 'SET_QUOTATION_FORM_ERRORS':
        return {
          ...state,
          formErrors: action.data,
        };
      case 'SET_QUOTATION_FORM_TYPE':
        return {
          ...state,
          formType: action.data,
        };
      case 'RESET_QUOTATION_FORM_DATA':
        return {
          ...state,
          formData: {...initialState().formData, ...action.data},
        };
      case 'SET_QUOTATION_SELECTED_SUPPLIER':
        return {
          ...state,
          selectedSupplier: action.data,
        };
      case 'SET_QUOTATION_SELECTED_SUPPLIERS':
        return {
          ...state,
          selectedSuppliers: action.data,
        };
      case 'SET_QUOTATION_SELECTED_SUPPLIER_CONTACT':
        return {
          ...state,
          selectedSupplierContact: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }