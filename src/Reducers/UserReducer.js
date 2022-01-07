const initialState = () => {
  return {
    data: {
      name: "test"
    },
    notifications: 0,
  }
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications + 1,
      };
    case 'SET_INITIAL_STATE':
      state = initialState();
      return state
    default:
      return state;
  }
}