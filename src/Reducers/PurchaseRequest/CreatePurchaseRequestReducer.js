import customDayJs from "./../../customDayJs";

const initialState = () => {
    return {
      formData: {
        items: [],
        updater: "end_user",
        requestedBy: "OARDA",
        approvedBy: "ORD",
        fund_cluster: "",
        purchase_request_number: "",
        center_code: "",
        end_user_id: null,
        pr_date: customDayJs().format('YYYY-MM-DD')
      },
      formErrors: {},
      requestedBySignatory: {},
      approvedBySignatory: {},
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
      case 'SET_PURCHASE_REQUEST_CREATE_REQUESTED_BY_SIGNATORY':
        return {
          ...state,
          requestedBySignatory: action.data,
        };
      case 'SET_PURCHASE_REQUEST_CREATE_APPROVED_BY_SIGNATORY':
        return {
          ...state,
          approvedBySignatory: action.data,
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