const initialState = () => {
    const defaultTableFilter = {
      page: 1,
    }
    return {
      selectedSupply: {},
      items: [],
      pagination: {
        current_page: 1,
        total: 1,
        per_page: 1,
      },
      loading: false,
      tableFilter: defaultTableFilter,
      defaultTableFilter: defaultTableFilter,
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_INVENTORY_SUPPLY_SELECTED_SUPPLY':
        return {
          ...state,
          selectedSupply: action.data,
        };
      case 'SET_INVENTORY_SUPPLY_ITEMS':
        return {
          ...state,
          items: action.data,
        };
      case 'SET_INVENTORY_SUPPLY_PAGINATION':
        return {
          ...state,
          pagination: action.data,
        };
      case 'SET_INVENTORY_SUPPLY_LOADING':
        return {
          ...state,
          loading: action.data,
        };
      case 'SET_INVENTORY_SUPPLY_TABLE_FILTER':
        return {
          ...state,
          tableFilter: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }