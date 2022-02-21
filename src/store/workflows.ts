import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import semver from 'semver'

import {
  getGhTrsConfigs,
  getLastModifiedDates,
  getTools,
  isGhTrs,
} from '@/api/trs'
import { RootState } from '@/store'
import { Config } from '@/types/ghTrs'
import { Tool, ToolVersion } from '@/types/trs'

interface WorkflowsState {
  workflows: Tool[]
  workflowsLoading: boolean
  workflowsError: string | null
  ghTrsConfigs: Record<string, Config> // key: ${id}_${version}
  ghTrsConfigsLoading: boolean
  ghTrsConfigsError: string | null
  modifiedDates: Record<string, string> // key: ${id}_${version}
}

const initialState: WorkflowsState = {
  workflows: [],
  workflowsLoading: true,
  workflowsError: null,
  ghTrsConfigs: {},
  ghTrsConfigsLoading: true,
  ghTrsConfigsError: null,
  modifiedDates: {},
}

export const fetchWorkflows = createAsyncThunk(
  'workflows/fetchWorkflows',
  async (_, { rejectWithValue }) => {
    try {
      await isGhTrs()
      return await getTools()
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchGhTrsConfigs = createAsyncThunk(
  'workflows/fetchGhTrsConfigs',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState
    const wfIdVersions: [string, string][] = state.workflows.workflows.map(
      (wf) => [wf.id, extractVersion(latestWfVersion(wf)).raw]
    )
    try {
      await isGhTrs()
      return await getGhTrsConfigs(wfIdVersions)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const fetchModifiedDate = createAsyncThunk(
  'workflows/fetchModifiedDate',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as RootState
    const wfIdVersions: [string, string][] = state.workflows.workflows.map(
      (wf) => [wf.id, extractVersion(latestWfVersion(wf)).raw]
    )
    try {
      await isGhTrs()
      return await getLastModifiedDates(wfIdVersions)
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
      state.workflowsLoading = true
    },
    [fetchWorkflows.fulfilled.type]: (
      state,
      action: PayloadAction<WorkflowsState['workflows']>
    ) => {
      state.workflowsLoading = false
      state.workflows = action.payload
    },
    [fetchWorkflows.rejected.type]: (state, action: PayloadAction<string>) => {
      state.workflowsLoading = false
      state.workflowsError = action.payload
    },

    [fetchGhTrsConfigs.pending.type]: (state) => {
      state.ghTrsConfigsLoading = true
    },
    [fetchGhTrsConfigs.fulfilled.type]: (
      state,
      action: PayloadAction<WorkflowsState['ghTrsConfigs']>
    ) => {
      state.ghTrsConfigsLoading = false
      state.ghTrsConfigs = action.payload
    },
    [fetchGhTrsConfigs.rejected.type]: (
      state,
      action: PayloadAction<string>
    ) => {
      state.ghTrsConfigsLoading = false
      state.ghTrsConfigsError = action.payload
    },

    [fetchModifiedDate.fulfilled.type]: (
      state,
      action: PayloadAction<WorkflowsState['modifiedDates']>
    ) => {
      state.modifiedDates = action.payload
    },
  },
})

export default workflowsSlice.reducer

export const getWfNames = (state: WorkflowsState) =>
  state.workflows.map((wf) => wf.name)

export const extractVersion = (wfVersion: ToolVersion): semver.SemVer => {
  return (
    semver.parse(wfVersion.url.split('/').pop() || '0.0.0') ||
    new semver.SemVer('0.0.0')
  )
}

export const latestWfVersion = (wf: Tool): ToolVersion => {
  const toolVersions = wf.versions
  return toolVersions.reduce(
    (prev, current) =>
      extractVersion(prev) > extractVersion(current) ? prev : current,
    toolVersions[0]
  )
}

export const wfToKey = (wf: Tool): string => {
  const latestVersion = latestWfVersion(wf)
  return `${wf.id}_${extractVersion(latestVersion).raw}`
}
