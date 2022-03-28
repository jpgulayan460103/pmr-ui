import { combineReducers } from 'redux'
import approvedForm from './ApprovedFormReducer'
import disapprovedForm from './DisapprovedFormReducer'
import forwardedForm from './ForwardedFormReducer'

const rootReducer = combineReducers({
  approvedForm,
  disapprovedForm,
  forwardedForm,
})

export default rootReducer