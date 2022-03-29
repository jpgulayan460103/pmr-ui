import dayjs from "dayjs";

const initialState = () => {
    return {
        forms: [],
        pagination: {},
        selectedFormRoute: {},
        routeOptions: [],
        procurementFormType: "",
        currentRoute: {},
        addOn: `BUDRP-PR-${dayjs().format("YYYY-MM-")}`,
        errorMessage: {},
        tableLoading: false,
        selectedProcurementCategory: null,
        submit: false,
        attachments: [],
        formLoading: false,
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_FORM_FORWARDED_FORMS':
        return {
          ...state,
          forms: action.data,
        };    
      case 'SET_FORM_FORWARDED_PAGINATION_META':
        return {
          ...state,
          pagination: action.data,
        };    
      case 'SET_FORM_FORWARDED_SELECTED_FORM_ROUTE':
        return {
          ...state,
          selectedFormRoute: action.data,
        };    
      case 'SET_FORM_FORWARDED_ROUTE_OPTIONS':
        return {
          ...state,
          routeOptions: action.data,
        };    
      case 'SET_FORM_FORWARDED_PROCUREMENT_FORM_TYPE':
        return {
          ...state,
          procurementFormType: action.data,
        };    
      case 'SET_FORM_FORWARDED_CURRENT_ROUTE':
        return {
          ...state,
          currentRoute: action.data,
        };    
      case 'SET_FORM_FORWARDED_ADD_ON':
        return {
          ...state,
          addOn: action.data,
        };    
      case 'SET_FORM_FORWARDED_ERROR_MESSAGE':
        return {
          ...state,
          errorMessage: action.data,
        };    
      case 'SET_FORM_FORWARDED_TABLE_LOADING':
        return {
          ...state,
          tableLoading: action.data,
        };    
      case 'SET_FORM_FORWARDED_SELECTED_PROCUREMENT_CATEGORY':
        return {
          ...state,
          selectedProcurementCategory: action.data,
        };    
      case 'SET_FORM_FORWARDED_SUBMIT':
        return {
          ...state,
          submit: action.data,
        };    
      case 'SET_FORM_FORWARDED_ATTACHMENTS':
        return {
          ...state,
          attachments: action.data,
        };    
      case 'SET_FORM_FORWARDED_FORM_LOADING':
        return {
          ...state,
          formLoading: action.data,
        };    
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }