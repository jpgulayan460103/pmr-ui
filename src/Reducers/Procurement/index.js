import { combineReducers } from 'redux'
import purchaseRequest from './ProcurementPurchaseRequestReducer'

const rootReducer = combineReducers({
  purchaseRequest,
})

export default rootReducer