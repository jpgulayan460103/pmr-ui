import { combineReducers } from 'redux'
import user from './UserReducer'
import libraries from './LibrariesReducer'
import purchaseRequests from './PurchaseRequest'
import procurementPlans from './ProcurementPlan'
import requisitionIssues from './RequisitionIssue'
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
  procurementPlans,
  requisitionIssues,
  quotations,
  suppliers,
  activtyLogs,
  forms,
  reports,
})

export default rootReducer