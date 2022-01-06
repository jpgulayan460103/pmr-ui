const initialState = () => {
    return {
      formData: {
        items: [],
      },
      formErrors: {},
      formProccess: []
    }
  }
  
  export default function hheadReducer(state = initialState(), action) {
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
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }