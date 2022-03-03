/// Store for Home Page

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getDraftWorkflows, getPublishedWorkflows } from '@/api/trs'
import { Config } from '@/types/ghTrs'
import { Tool, ToolVersion } from '@/types/trs'

export interface PublishedWorkflow {
  tool: Tool
  version: string
  toolVersion: ToolVersion
  config: Config
  modifiedDate: string
}

export const isPublishedWorkflow = (
  wf: PublishedWorkflow | DraftWorkflow
): wf is PublishedWorkflow => {
  return (wf as PublishedWorkflow).tool !== undefined
}

export interface PublishedWorkflows {
  [id: string]: PublishedWorkflow
}

export interface DraftWorkflow {
  config: Config
  version: string
  createdDate: string
  prId: number
}

export const isDraftWorkflow = (
  wf: PublishedWorkflow | DraftWorkflow
): wf is DraftWorkflow => {
  return (wf as DraftWorkflow).config !== undefined
}

export interface DraftWorkflows {
  [id: string]: DraftWorkflow
}

interface WorkflowsState {
  published: {
    [id: string]: {
      tool: Tool
      toolVersion: ToolVersion
      config: Config
      version: string
      modifiedDate: string
    }
  }
  publishedLoading: boolean
  publishedError: string | null
  draft: {
    [id: string]: {
      config: Config
      configUrl: string
      version: string
      createdDate: string
      prId: number
    }
  }
  draftLoading: boolean
  draftError: string | null
}

const initialState: WorkflowsState = {
  draft: {},
  draftError: null,
  draftLoading: true,
  published: {},
  publishedError: null,
  publishedLoading: true,
}

export const fetchPublishedWorkflows = createAsyncThunk(
  'workflows/fetchPublishedWorkflows',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const wfs = await getPublishedWorkflows()
      return fulfillWithValue(wfs)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchDraftWorkflows = createAsyncThunk(
  'workflows/fetchDraftWorkflows',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const wfs = await getDraftWorkflows()
      return fulfillWithValue(wfs)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const workflowsSlice = createSlice({
  extraReducers: {
    [fetchPublishedWorkflows.pending.type]: (state) => {
      state.publishedLoading = true
      state.publishedError = null
    },
    [fetchPublishedWorkflows.fulfilled.type]: (
      state,
      action: PayloadAction<WorkflowsState['published']>
    ) => {
      state.publishedLoading = false
      state.publishedError = null
      state.published = action.payload || {}
    },
    [fetchPublishedWorkflows.rejected.type]: (
      state,
      action: PayloadAction<WorkflowsState['publishedError']>
    ) => {
      state.publishedLoading = false
      state.publishedError = action.payload
    },

    [fetchDraftWorkflows.pending.type]: (state) => {
      state.draftLoading = true
      state.draftError = null
    },
    [fetchDraftWorkflows.fulfilled.type]: (
      state,
      action: PayloadAction<WorkflowsState['draft']>
    ) => {
      state.draftLoading = false
      state.draftError = null
      state.draft = action.payload || {}
    },
    [fetchDraftWorkflows.rejected.type]: (
      state,
      action: PayloadAction<WorkflowsState['draftError']>
    ) => {
      state.draftLoading = false
      state.draftError = action.payload
    },
  },
  initialState,
  name: 'workflows',
  reducers: {},
})

export default workflowsSlice.reducer
