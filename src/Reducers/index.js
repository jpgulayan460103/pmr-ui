import { combineReducers } from 'redux'
import user from './UserReducer'
import libraries from './LibrariesReducer'
import purchaseRequests from './PurchaseRequest'
import procurementPlan from './ProcurementPlan'
import procurements from './Procurement'
import quotations from './QuotationReducer'
import suppliers from './SupplierReducer'
import activtyLogs from './ActivityLogReducer'
import reports from './ReportReducer'
import forms from './Forms'

const rootReducer = combineReducers({
  user,
  libraries,
  purchaseRequests,
  procurements,
  procurementPlan,
  quotations,
  suppliers,
  activtyLogs,
  forms,
  reports,
})

export default rootReducer