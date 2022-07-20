import customDayJs from "./../../customDayJs";

const initialState = () => {
    const defaultTableFilter = {
      page: 1,
    }
    return {
      selectedRequisitionIssue: {},
      requisitionIssues: [],
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
      case 'SET_REQUISITION_ISSUE_LIST_SELECTED_REQUISITION_ISSUE':
        return {
          ...state,
          selectedRequisitionIssue: action.data,
        };
      case 'SET_REQUISITION_ISSUE_LIST_REQUISTION_ISSUES':
        return {
          ...state,
          requisitionIssues: action.data,
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