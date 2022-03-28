import { combineReducers } from 'redux'
import create from './CreatePurchaseRequestReducer'
import list from './ListPurchaseRequestReducer'

const rootReducer = combineReducers({
  create,
  list,
})

export default rootReducer