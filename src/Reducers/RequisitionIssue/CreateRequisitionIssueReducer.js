import dayjs from "dayjs";

const initialState = () => {
    return {
      formData: {
        items: [],
        issued_items: [],
        end_user_id: null,
        type_id: null,
        ris_date: dayjs().format('YYYY-MM-DD'),
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
      case 'RESET_REQUISITION_ISSUE_CREATE_FORM_DATA':
        return {
          ...state,
          formData: {...initialState().formData, ...action.data},
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