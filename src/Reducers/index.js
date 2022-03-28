import { combineReducers } from 'redux'
import user from './UserReducer'
import library from './LibrariesReducer'
import purchaseRequest from './PurchaseRequest'
import procurement from './Procurement'
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