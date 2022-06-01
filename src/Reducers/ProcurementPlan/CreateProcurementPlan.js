const initialState = () => {
    return {
      formData: {},
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'PROCUREMENT_PLAN_FORM_DATA':
        return {
          ...state,
          formData: action.data,
        }; 
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }