import { combineReducers } from 'redux'
import create from './CreateRequisitionIssueReducer'
import list from './ListRequisitionIssueReducer'

const rootReducer = combineReducers({
  create,
  list,
})

export default rootReducer