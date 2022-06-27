import { combineReducers } from 'redux'
import supplies from './SupplyInventoryReducer'

const rootReducer = combineReducers({
  supplies,
})

export default rootReducer