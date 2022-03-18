// Store for Home Page
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getDraftWorkflows, getPublishedWorkflows, isGhTrs } from '@/api/trs'
import { RootState } from '@/store'
import { Config } from '@/types/ghTrs'
import { ToolVersion } from '@/types/trs'

export interface PublishedWorkflow {
  config: Config
  date: string
  toolVersion: ToolVersion
  version: string
}

export interface PublishedWorkflows {
  [id: string]: PublishedWorkflow
}

export const isPublishedWorkflow = (
  wf: PublishedWorkflow | DraftWorkflow
): wf is PublishedWorkflow => {
  return typeof (wf as PublishedWorkflow).toolVersion !== 'undefined'
}

export interface DraftWorkflow {
  config: Config
  date: string
  prId: number
  version: string
}

export interface DraftWorkflows {
  [id: string]: DraftWorkflow
}

export const isDraftWorkflow = (
  wf: PublishedWorkflow | DraftWorkflow
): wf is DraftWorkflow => {
  return typeof (wf as PublishedWorkflow).toolVersion === 'undefined'
}

export interface WorkflowsState {
  error: string | null
  loading: boolean
  requestId: string | null
  wfs: {
    [id: string]: PublishedWorkflow | DraftWorkflow
  }
}

const initialState: WorkflowsState = {
  error: null,
  loading: false,
  requestId: null,
  wfs: {},
}

export const fetchWfs = createAsyncThunk(
  'workflows/fetchWfs',
  async (_, { fulfillWithValue, rejectWithValue, getState, requestId }) => {
    const wfsState = (getState() as RootState).workflows as WorkflowsState
    if (wfsState.requestId !== requestId) {
      return rejectWithValue('Already fetched')
    }

    try {
      await isGhTrs()
      const [published, draft] = await Promise.all([
        getPublishedWorkflows(),
        getDraftWorkflows(),
      ])
      const idSet = new Set<string>([
        ...Object.keys(published),
        ...Object.keys(draft),
      ])
      const wfs: WorkflowsState['wfs'] = {}
      idSet.forEach((id) => {
        if (id in published) {
          wfs[id] = published[id]
        } else if (id in draft) {
          wfs[id] = draft[id]
        }
      })
      return fulfillWithValue(wfs)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

interface FetchWfsMeta {
  requestId: string
}

export const workflowsSlice = createSlice({
  extraReducers: {
    [fetchWfs.pending.type]: (
      state: WorkflowsState,
      action: PayloadAction<undefined, string, FetchWfsMeta>
    ) => {
      if (state.requestId === null) {
        state.loading = true
        state.requestId = action.meta.requestId
      }
    },
    [fetchWfs.fulfilled.type]: (
      state: WorkflowsState,
      action: PayloadAction<WorkflowsState['wfs']>
    ) => {
      state.loading = false
      state.wfs = action.payload
    },
    [fetchWfs.rejected.type]: (
      state: WorkflowsState,
      action: PayloadAction<WorkflowsState['error']>
    ) => {
      if (action.payload !== 'Already fetched') {
        state.loading = false
        state.error = action.payload
      }
    },
  },
  initialState,
  name: 'workflows',
  reducers: {},
})

export default workflowsSlice.reducer
