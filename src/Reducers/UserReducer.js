const initialState = () => {
  return {
    data: {},
    notifications: 0,
    collapsed: true,
    collapsedWidth: 80,
    mainLoading: true,
    mainLoadingMessage: "",
    isInitialized: false,
  }
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications + 1,
      };    
    case 'SET_COLLAPSE':
      return {
        ...state,
        collapsed: action.data,
      };    
    case 'SET_COLLAPSE_WIDTH':
      return {
        ...state,
        collapsedWidth: action.data,
      };    
    case 'SET_MAIN_LOADING':
      return {
        ...state,
        mainLoading: action.data,
      };    
    case 'SET_MAIN_LOADING_MESSAGE':
      return {
        ...state,
        mainLoadingMessage: action.data,
      };    
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.data,
      };    
    case 'SET_USER_DATA':
      return {
        ...state,
        data: action.data,
      };    
    case 'SET_INITIAL_STATE':
      state = initialState();
      return state
    default:
      return state;
  }
}