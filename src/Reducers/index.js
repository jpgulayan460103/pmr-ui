import { combineReducers } from 'redux'
import user from './UserReducer'
import libraries from './LibrariesReducer'
import purchaseRequests from './PurchaseRequest'
import procurements from './Procurement'
import quotations from './QuotationReducer'
import suppliers from './SupplierReducer'
import activtyLogs from './ActivityLogReducer'
import forms from './Forms'

const rootReducer = combineReducers({
  user,
  libraries,
  purchaseRequests,
  procurements,
  quotations,
  suppliers,
  activtyLogs,
  forms,
})

export default rootReducer