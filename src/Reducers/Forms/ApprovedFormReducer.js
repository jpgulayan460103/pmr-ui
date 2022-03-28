const initialState = () => {
    return {
      forms: [],
      selectedFormRoute: {},
      pagination: {},
      loading: false,
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_FORM_APPROVED_FORM_FORMS':
        return {
          ...state,
          forms: action.data,
        };    
      case 'SET_FORM_APPROVED_FORM_SELECTED_FORM_ROUTE':
        return {
          ...state,
          selectedFormRoute: action.data,
        };    
      case 'SET_FORM_APPROVED_FORM_PAGINATION':
        return {
          ...state,
          pagination: action.data,
        };    
      case 'SET_FORM_APPROVED_FORM_LOADING':
        return {
          ...state,
          loading: action.data,
        };    
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }