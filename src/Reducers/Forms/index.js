import { combineReducers } from 'redux'
import approvedForm from './ApprovedFormReducer'
import disapprovedForm from './DisapprovedFormReducer'
import pendingForm from './PendingFormReducer'
import referencePurchaseRequest from './ReferencePurchaseRequest'

const rootReducer = combineReducers({
  approvedForm,
  disapprovedForm,
  pendingForm,
  referencePurchaseRequest,
})

export default rootReducer