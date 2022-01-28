const initialState = () => {
    return {
      selectedPurchaseRequest: {},
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SELECT_PURCHASE_REQUEST':
        return {
          ...state,
          selectedPurchaseRequest: action.data,
        };    
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      case 'SET_PROCUREMENT_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }