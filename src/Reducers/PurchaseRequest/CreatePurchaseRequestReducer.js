import customDayJs from "./../../customDayJs";

const initialState = () => {
    return {
      formData: {
        items: [],
        end_user_id: null,
        pr_date: customDayJs().format('YYYY-MM-DD')
      },
      formErrors: {},
      formType: "create",
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_PURCHASE_REQUEST_CREATE_FORM_DATA':
        return {
          ...state,
          formData: action.data,
        };
      case 'SET_PURCHASE_REQUEST_CREATE_FORM_ERRORS':
        return {
          ...state,
          formErrors: action.data,
        };
      case 'SET_PURCHASE_REQUEST_CREATE_FORM_TYPE':
        return {
          ...state,
          formType: action.data,
        };
      case 'RESET_PURCHASE_REQUEST_CREATE_FORM_DATA':
        return {
          ...state,
          formData: {...initialState().formData, ...action.data},
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }