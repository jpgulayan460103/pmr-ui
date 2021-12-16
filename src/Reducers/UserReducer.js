const initialState = () => {
  return {
    data: {
        name: "test"
    }
  }
}

export default function hheadReducer(state = initialState(), action) {
  switch (action.type) {
    case 'HHEAD_FORM_ERROR':
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