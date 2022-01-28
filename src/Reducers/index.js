import { combineReducers } from 'redux'
import user from './UserReducer'
import library from './LibrariesReducer'
import purchaseRequest from './PurchaseRequestReducer'
import procurement from './ProcurementReducer'

const rootReducer = combineReducers({
  user,
  library,
  purchaseRequest,
  procurement,
})

export default rootReducer