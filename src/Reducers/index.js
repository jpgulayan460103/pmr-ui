import { combineReducers } from 'redux'
import user from './UserReducer'
import library from './LibrariesReducer'
import purchaseRequest from './PurchaseRequestReducer'
import procurement from './ProcurementReducer'
import quotation from './QuotationReducer'
import supplier from './SupplierReducer'
import activtyLog from './ActivityLog'

const rootReducer = combineReducers({
  user,
  library,
  purchaseRequest,
  procurement,
  quotation,
  supplier,
  activtyLog,
})

export default rootReducer