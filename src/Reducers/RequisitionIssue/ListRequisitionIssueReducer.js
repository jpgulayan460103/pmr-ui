import customDayJs from "./../../customDayJs";

const initialState = () => {
    const defaultTableFilter = {
      page: 1,
    }
    return {
      selectedProcurementPlan: {},
      procurementPlans: [],
      paginationMeta: {
        current_page: 1,
        total: 1,
        per_page: 1,
      },
      loading: false,
      timelines: [],
      logger: [],
      tableFilter: defaultTableFilter,
      defaultTableFilter: defaultTableFilter,
      tab: "information",
    }
  }
  
  export default function reducer(state = initialState(), action) {
    switch (action.type) {
      case 'SET_REQUISITION_ISSUE_LIST_SELECTED_PURCHASE_REQUEST':
        return {
          ...state,
          selectedProcurementPlan: action.data,
        };
      case 'SET_REQUISITION_ISSUE_LIST_PURCHASE_REQUESTS':
        return {
          ...state,
          procurementPlans: action.data,
        };
      case 'SET_REQUISITION_ISSUE_LIST_PAGINATION_META':
        return {
          ...state,
          paginationMeta: action.data,
        };
      case 'SET_REQUISITION_ISSUE_LIST_LOADING':
        return {
          ...state,
          loading: action.data,
        };
      case 'SET_REQUISITION_ISSUE_LIST_TIMELINES':
        return {
          ...state,
          timelines: action.data,
        };
      case 'SET_REQUISITION_ISSUE_LIST_LOGGER':
        return {
          ...state,
          logger: action.data,
        };
      case 'SET_REQUISITION_ISSUE_TABLE_FILTER':
        return {
          ...state,
          tableFilter: action.data,
        };
      case 'SET_REQUISITION_ISSUE_TAB':
        return {
          ...state,
          tab: action.data,
        };
      case 'SET_INITIAL_STATE':
        state = initialState();
        return state
      default:
        return state;
    }
  }