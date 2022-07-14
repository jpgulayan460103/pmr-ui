const initialState = () => {
  return {
    data: {},
    notifications: [
      // {
      //   notification_title: 'For Approval Purchase Request',
      //   notification_type: 'approved_form',
      //   notification_message: 'Resolved123',
      //   notification_data: {
      //     status: 'Disapproved',
      //     user: 'ict',
      //     remarks: 'Resolved123',
      //     datetime: 'datetime',
      //     form: 'Blanditiis dolore enim in reprehenderit qui officiis est. Dolor sit minus maxime voluptate sit corporis mollitia. Aliquam consequatur corporis nesciunt ratione corrupti.'
      //   }
      // },
      // {
      //   notification_title: 'Disapproved Purchase Request',
      //   notification_type: 'rejected_form',
      //   notification_message: 'Reject123',
      //   notification_data: {
      //     status: 'Disapproved',
      //     user: 'bacs',
      //     remarks: 'Reject123',
      //     datetime: "datetime",
      //     form: 'Blanditiis dolore enim in reprehenderit qui officiis est. Dolor sit minus maxime voluptate sit corporis mollitia. Aliquam consequatur corporis nesciunt ratione corrupti.'
      //   }
      // }
    ],
    collapsed: true,
    collapsedWidth: 50,
    mainLoading: true,
    mainLoadingMessage: "",
    isInitialized: false,
    uploadingFiles: false,
    profile: {
      loading: false,
      activity_logs: [],
      paginationMeta: {},
    },
  }
}

export default function reducer(state = initialState(), action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: action.data,
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
    case 'SET_UPLOADING_FILES':
      return {
        ...state,
        uploadingFiles: action.data,
      };    
    case 'SET_USER_PROFILE_DATA':
      return {
        ...state,
        profile: action.data,
      };    
    case 'SET_INITIAL_STATE':
      state = initialState();
      return state
    default:
      return state;
  }
}