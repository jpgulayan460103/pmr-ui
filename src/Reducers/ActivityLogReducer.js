const initialState = () => {
    return {
        tableFilter: {},
        selectedLogger: {},
        activityLogs: [],
        paginationMeta: [],
        loading: false,
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_ACTIVITY_LOG_TABLE_FILTER':
        return {
          ...state,
          tableFilter: action.data,
        };
      case 'SET_ACTIVITY_LOG_SELECTED_LOGGER':
        return {
          ...state,
          selectedLogger: action.data,
        };
      case 'SET_ACTIVITY_LOG_ACTIVITY_LOGS':
        return {
          ...state,
          activityLogs: action.data,
        };
      case 'SET_ACTIVITY_LOG_PAGINATION_META':
        return {
          ...state,
          paginationMeta: action.data,
        };
      case 'SET_ACTIVITY_LOG_LOADING':
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