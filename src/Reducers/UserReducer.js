const initialState = () => {
  return {
    data: {},
    notifications: 0,
    collapsed: true,
    collapsedWidth: 80,
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