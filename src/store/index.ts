import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import FilterReducer from '@/store/filter'
import WorkflowReducer from '@/store/workflow'
import WorkflowsReducer from '@/store/workflows'

export const store = configureStore({
  reducer: {
    workflows: WorkflowsReducer,
    filter: FilterReducer,
    workflow: WorkflowReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
