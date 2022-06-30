import dayjs from "dayjs";

const initialState = () => {
    return {
      formData: {
        itemsA: [],
        itemsB: [],
        end_user_id: null,
        type_id: null,
        ppmp_date: dayjs().format('YYYY-MM-DD'),
        calendar_year: dayjs().format("YYYY"),
      },
      formErrors: {},
      formType: "create",
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_PROCUREMENT_PLAN_CREATE_FORM_DATA':
        return {
          ...state,
          formData: action.data,
        };
      case 'RESET_PROCUREMENT_PLAN_CREATE_FORM_DATA':
        return {
          ...state,
          formData: {...initialState().formData, ...action.data},
        };
      case 'SET_PROCUREMENT_PLAN_CREATE_FORM_ERRORS':
        return {
          ...state,
          formErrors: action.data,
        };
      case 'SET_PROCUREMENT_PLAN_CREATE_FORM_TYPE':
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