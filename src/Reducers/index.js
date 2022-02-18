import { combineReducers } from 'redux'
import user from './UserReducer'
import library from './LibrariesReducer'
import purchaseRequest from './PurchaseRequestReducer'
import procurement from './ProcurementReducer'
import quotation from './QuotationReducer'
import supplier from './SupplierReducer'

const rootReducer = combineReducers({
  user,
  library,
  purchaseRequest,
  procurement,
  quotation,
  supplier,
})

export default rootReducer