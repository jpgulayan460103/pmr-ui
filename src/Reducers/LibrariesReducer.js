const initialState = () => {
    return {
      unit_of_measures:[],
      items: [],
      sections: [],
    }
  }
  
  export default function hheadReducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_LIBRARY_UNIT_OF_MEASURES':
        return {
          ...state,
          unit_of_measures: action.data,
        };
      case 'SET_LIBRARY_ITEMS':
        return {
          ...state,
          items: action.data,
        };
      case 'SET_LIBRARY_USER_SECTION':
        return {
          ...state,
          sections: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }