const initialState = () => {
    return {
      items: [],
      unit_of_measures: [],
      item_categories: [],
      user_sections: [],
      user_divisions: [],
      divisions_sections_tree: [],
      user_positions: [],
      user_area_of_assignments: [],
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
          user_sections: action.data,
        };
      case 'SET_LIBRARY_ITEM_CATEGORIES':
        return {
          ...state,
          item_categories: action.data,
        };
      case 'SET_LIBRARY_USER_DIVISIONS':
        return {
          ...state,
          user_divisions: action.data,
        };
      case 'SET_LIBRARY_USER_POSITIONS':
        return {
          ...state,
          user_positions: action.data,
        };
      case 'SET_LIBRARY_USER_AREA_OF_ASSIGNMENTS':
        return {
          ...state,
          user_area_of_assignments: action.data,
        };
      case 'SET_LIBRARY_DIVISION_SECTION_TREE':
        return {
          ...state,
          divisions_sections_tree: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }