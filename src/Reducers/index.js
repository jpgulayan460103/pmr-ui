import { combineReducers } from 'redux'
import user from './UserReducer'
import library from './LibrariesReducer'
import purchaseRequest from './PurchaseRequestReducer'

const rootReducer = combineReducers({
  user,
  library,
  purchaseRequest,
})

export default rootReducer