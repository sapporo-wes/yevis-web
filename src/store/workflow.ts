/// Store for Workflow Page

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getDraftWorkflow, getPublishedWorkflow } from '@/api/trs'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

interface WorkflowState {
  wf: PublishedWorkflow | DraftWorkflow | null
  loading: boolean
  error: string | null
}

const initialState: WorkflowState = {
  wf: null,
  loading: true,
  error: null,
}

export const fetchWorkflow = createAsyncThunk(
  'workflow/fetchWorkflow',
  async (args: { id?: string; version?: string }, { rejectWithValue }) => {
    if (typeof args.id === 'undefined') {
      return rejectWithValue(new Error('No id provided'))
    }
    try {
      const publishedWf = await getPublishedWorkflow(args.id, args.version)
      return publishedWf
    } catch (publishErr) {
      try {
        const draftWf = await getDraftWorkflow(args.id, args.version)
        return draftWf
      } catch (draftErr) {
        console.log(draftErr)
        return rejectWithValue((publishErr as Error).message)
      }
    }
  }
)

export const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchWorkflow.pending.type]: (state) => {
      state.loading = true
      state.error = null
    },
    [fetchWorkflow.fulfilled.type]: (
      state,
      action: PayloadAction<WorkflowState['wf']>
    ) => {
      state.loading = false
      state.error = null
      state.wf = action.payload || null
    },
    [fetchWorkflow.rejected.type]: (
      state,
      action: PayloadAction<WorkflowState['error']>
    ) => {
      state.loading = false
      state.error = action.payload || null
    },
  },
})

export default workflowSlice.reducer
