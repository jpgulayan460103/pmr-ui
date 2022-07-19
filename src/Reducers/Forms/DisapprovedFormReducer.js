import helpers from "../../Utilities/helpers";

const initialState = () => {
    const defaultTableFilter = {
      page: 1,
      // created_at: helpers.defaultDateRange
    }
    return {
      forms: [],
      selectedFormRoute: {},
      pagination: {},
      loading: false,
      tableFilter: defaultTableFilter,
      defaultTableFilter: defaultTableFilter,
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_FORM_DISAPPROVED_FORM_FORMS':
        return {
          ...state,
          forms: action.data,
        };    
      case 'SET_FORM_DISAPPROVED_FORM_SELECTED_FORM_ROUTE':
        return {
          ...state,
          selectedFormRoute: action.data,
        };    
      case 'SET_FORM_DISAPPROVED_FORM_PAGINATION':
        return {
          ...state,
          pagination: action.data,
        };    
      case 'SET_FORM_DISAPPROVED_FORM_LOADING':
        return {
          ...state,
          loading: action.data,
        };
      case 'SET_FORM_DISAPPROVED_FORM_TABLE_FILTER':
        return {
          ...state,
          tableFilter: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }