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
      user_offices: [],
      accounts: [],
      account_classifications: [],
      mode_of_procurements: [],
      technical_working_groups: [],
      user_signatory_designations: [],
      user_signatory_names: [],
      uacs_codes: [],
      procurement_types: [],
      users: [],
      isLibrariesLoaded: false,
    }
  }
  
  export default function reducer(state = initialState(), action) {
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
      case 'SET_LIBRARY_SIGNATORIES':
        return {
          ...state,
          user_offices: action.data,
        };
      case 'SET_LIBRARY_ACCOUNTS':
        return {
          ...state,
          accounts: action.data,
        };
      case 'SET_LIBRARY_ACCOUNT_CLASSIFICATIONS':
        return {
          ...state,
          account_classifications: action.data,
        };
      case 'SET_LIBRARY_MODE_OF_PROCUREMENT_TYPES':
        return {
          ...state,
          mode_of_procurements: action.data,
        };
      case 'SET_LIBRARY_TECHNICAL_WORKING_GROUPS':
        return {
          ...state,
          technical_working_groups: action.data,
        };
      case 'SET_LIBRARY_SIGNATORY_DESIGNATION':
        return {
          ...state,
          user_signatory_designations: action.data,
        };
      case 'SET_LIBRARY_SIGNATORY_NAME':
        return {
          ...state,
          user_signatory_names: action.data,
        };
      case 'SET_LIBRARY_UACS_CODE':
        return {
          ...state,
          uacs_codes: action.data,
        };
      case 'SET_LIBRARY_PROCUREMENT_TYPE':
        return {
          ...state,
          procurement_types: action.data,
        };
      case 'SET_LIBRARY_USERS':
        return {
          ...state,
          users: action.data,
        };
      case 'LOAD_LIBRARIES':
        return {
          ...state,
          isLibrariesLoaded: true,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }