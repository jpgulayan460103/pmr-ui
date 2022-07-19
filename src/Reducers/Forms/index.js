import { combineReducers } from 'redux'
import approvedForm from './ApprovedFormReducer'
import disapprovedForm from './DisapprovedFormReducer'
import pendingForm from './PendingFormReducer'
import allForm from './AllFormReducer'

const rootReducer = combineReducers({
  approvedForm,
  disapprovedForm,
  pendingForm,
  allForm,
})

export default rootReducer