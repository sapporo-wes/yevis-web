import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getTools } from '@/api/trs'
import { RootState } from '@/store'
import { Tool } from '@/types/trs'

interface WorkflowsState {
  workflows: Tool[]
  loading: boolean
  error: Error | null
}

const initialState: WorkflowsState = {
  workflows: [],
  loading: true,
  error: null,
}

export const fetchWorkflows = createAsyncThunk<
  Tool[],
  void,
  {
    rejectValue: Error
  }
>('workflows/fetch', async (_, { rejectWithValue }) => {
  try {
    console.log('HERE')
    return await getTools()
  } catch (err) {
    return rejectWithValue(err as Error)
  }
})

export const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchWorkflows.pending.type]: (state) => {
      state.loading = true
    },
    [fetchWorkflows.fulfilled.type]: (state, action: PayloadAction<Tool[]>) => {
      state.loading = false
      state.workflows = action.payload
    },
    [fetchWorkflows.rejected.type]: (state, action: PayloadAction<Error>) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const workflowsSelector = (state: RootState) => state.workflows.workflows
export const workflowsLoadingSelector = (state: RootState) =>
  state.workflows.loading
export const workflowsErrorSelector = (state: RootState) =>
  state.workflows.error

export default workflowsSlice.reducer
