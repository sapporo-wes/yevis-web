import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getTools, isGhTrs } from '@/api/trs'
import { Tool } from '@/types/trs'

interface WorkflowsState {
  workflows: Tool[]
  loading: boolean
  error: string | null
}

const initialState: WorkflowsState = {
  workflows: [],
  loading: true,
  error: null,
}

export const fetchWorkflows = createAsyncThunk(
  'workflows/fetch',
  async (_, { rejectWithValue }) => {
    try {
      await isGhTrs()
      return await getTools()
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

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
    [fetchWorkflows.rejected.type]: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const getWfNames = (state: WorkflowsState) =>
  state.workflows.map((wf) => wf.name)

export default workflowsSlice.reducer
