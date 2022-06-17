const initialState = () => {
    return {
      formData: {
        items: [],
        end_user_id: null,
        type_id: null,
      },
      formErrors: {},
      formType: "create",
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_REQUISITION_ISSUE_CREATE_FORM_DATA':
        return {
          ...state,
          formData: action.data,
        };
      case 'SET_REQUISITION_ISSUE_CREATE_FORM_ERRORS':
        return {
          ...state,
          formErrors: action.data,
        };
      case 'SET_REQUISITION_ISSUE_CREATE_FORM_TYPE':
        return {
          ...state,
          formType: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }