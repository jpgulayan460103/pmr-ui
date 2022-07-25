const initialState = () => {

    return {
        form: {},
        route: {},
        attachments: [],
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_FORM_PREVIEW_FORM':
        return {
          ...state,
          form: action.data,
        };    
      case 'SET_FORM_PREVIEW_ROUTE':
        return {
          ...state,
          route: action.data,
        };    
      case 'SET_FORM_PREVIEW_ATTACHMENTS':
        return {
          ...state,
          attachments: action.data,
        };    
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }