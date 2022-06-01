import { combineReducers } from 'redux'
import create from './CreateProcurementPlanReducer'

const rootReducer = combineReducers({
  create,
})

export default rootReducer