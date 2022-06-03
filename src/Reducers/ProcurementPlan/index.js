import { combineReducers } from 'redux'
import create from './CreateProcurementPlanReducer'
import list from './ListProcurementPlanReducer'

const rootReducer = combineReducers({
  create,
  list,
})

export default rootReducer