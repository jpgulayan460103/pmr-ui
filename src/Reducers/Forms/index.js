import { combineReducers } from 'redux'
import approvedForm from './ApprovedFormReducer'
import disapprovedForm from './DisapprovedFormReducer'
import pendingForm from './PendingFormReducer'
import allForm from './AllFormReducer'
import preview from './PreviewFormReducer'

const rootReducer = combineReducers({
  approvedForm,
  disapprovedForm,
  pendingForm,
  allForm,
  preview,
})

export default rootReducer