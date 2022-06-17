import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './Reducers'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: { warnAfter: 128 },
    serializableCheck: { warnAfter: 128 },
  }),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store