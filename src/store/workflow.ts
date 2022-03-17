/// Store for Detail Page
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  getAllVersions,
  isGhTrs,
  getPublishedWorkflow,
  getDraftWorkflow,
  fetchActionsResult,
} from '@/api/trs'
import { fetchConfigContents } from '@/api/zenodo'
import { RootState } from '@/store'
import { PublishStatus } from '@/store/filter'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

export interface FileContent {
  content: string | null
  error: string | null
  url: string
}

export interface VersionStatus {
  status: PublishStatus
  version: string
}

export interface RunResult {
  date: string
  status: string | null
  url: string
}

export interface WorkflowState {
  [id: string]: {
    error: string | null
    loading: boolean
    requestId: string | null
    versionStatus: VersionStatus[]
    versions: {
      [version: string]: {
        contents: {
          error: string | null
          files: { [target: string]: FileContent }
          loading: boolean
          requestId: string | null
        }
        error: string | null
        loading: boolean
        requestId: string | null
        tests: {
          error: string | null
          loading: boolean
          requestId: string | null
          results: RunResult[]
        }
        wf: PublishedWorkflow | DraftWorkflow | null
      }
    }
  }
}

export type WfVersions = WorkflowState[keyof WorkflowState]['versions']
export type WfVersion = WfVersions[keyof WfVersions]

const initialState: WorkflowState = {}

interface InitializeWfArgs {
  id: string
}

interface InitializeWfMeta {
  arg: InitializeWfArgs
  requestId: string
}

export const initializeWf = createAsyncThunk(
  'workflows/initializeWf',
  async (
    args: InitializeWfArgs,
    { fulfillWithValue, rejectWithValue, getState, requestId }
  ) => {
    const wfState = (getState() as RootState).workflow as WorkflowState
    if (wfState[args.id].requestId !== requestId) {
      return rejectWithValue('Already initialized')
    }
    try {
      await isGhTrs()
      const versions = await getAllVersions(args.id)
      return fulfillWithValue(versions)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

interface FetchWfArgs {
  id: string
}

interface FetchWfMeta {
  arg: FetchWfArgs
  requestId: string
}

export const fetchWfs = createAsyncThunk(
  'workflow/fetchWfs',
  async (
    args: FetchWfArgs,
    { fulfillWithValue, rejectWithValue, getState, requestId }
  ) => {
    const wfState = (getState() as RootState).workflow as WorkflowState
    const versions = wfState[args.id].versionStatus.map((v) => v.version)
    const requestIds = Array.from(
      new Set(versions.map((v) => wfState[args.id].versions[v].requestId))
    )
    if (!requestIds.includes(requestId)) {
      return rejectWithValue('Already fetched')
    }

    try {
      const wfs = await Promise.all(
        wfState[args.id].versionStatus.map((s) =>
          s.status === 'published'
            ? getPublishedWorkflow(args.id, s.version)
            : getDraftWorkflow(args.id, s.version)
        )
      )
      const results: Record<string, PublishedWorkflow | DraftWorkflow> = {}
      wfs.forEach((wf, i) => {
        results[wfState[args.id].versionStatus[i].version] = wf
      })
      return fulfillWithValue(results)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

interface FetchContentsArgs {
  id: string
  version: string
}

interface FetchContentsMeta {
  arg: FetchContentsArgs
  requestId: string
}

export const fetchContents = createAsyncThunk(
  'workflow/fetchContents',
  async (
    args: FetchContentsArgs,
    { fulfillWithValue, rejectWithValue, getState, requestId }
  ) => {
    const wfState = (getState() as RootState).workflow as WorkflowState
    if (
      wfState[args.id].versions[args.version].contents.requestId !== requestId
    ) {
      return rejectWithValue('Already fetched')
    }
    try {
      const wf = wfState[args.id].versions[args.version].wf
      if (wf !== null) {
        const contents = await fetchConfigContents(wf.config)
        return fulfillWithValue(contents)
      }
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

interface FetchTestsArgs {
  id: string
  version: string
}

interface FetchTestsMeta {
  arg: FetchTestsArgs
  requestId: string
}

export const fetchTests = createAsyncThunk(
  'workflow/fetchTests',
  async (
    args: FetchTestsArgs,
    { fulfillWithValue, rejectWithValue, getState, requestId }
  ) => {
    const wfState = (getState() as RootState).workflow as WorkflowState
    if (wfState[args.id].versions[args.version].tests.requestId !== requestId) {
      return rejectWithValue('Already fetched')
    }
    try {
      const wf = wfState[args.id].versions[args.version].wf
      if (wf !== null) {
        const results = await fetchActionsResult(wf)
        return fulfillWithValue(results)
      }
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

export const workflowSlice = createSlice({
  extraReducers: {
    // initializeWf -> fetchWfs -> fetchContents
    [initializeWf.pending.type]: (
      state: WorkflowState,
      action: PayloadAction<undefined, string, InitializeWfMeta>
    ) => {
      const { id } = action.meta.arg
      if (id in state) {
        // already initialized
      } else {
        state[id] = {
          error: null,
          loading: true,
          requestId: action.meta.requestId,
          versionStatus: [],
          versions: {},
        }
      }
    },
    [initializeWf.fulfilled.type]: (
      state: WorkflowState,
      action: PayloadAction<VersionStatus[], string, InitializeWfMeta>
    ) => {
      const { id } = action.meta.arg
      state[id].loading = false
      state[id].versionStatus = action.payload
    },
    [initializeWf.rejected.type]: (
      state: WorkflowState,
      action: PayloadAction<string, string, InitializeWfMeta>
    ) => {
      const { id } = action.meta.arg
      if (action.payload !== 'Already initialized') {
        state[id].loading = false
        state[id].error = action.payload
      }
    },

    [fetchWfs.pending.type]: (
      state: WorkflowState,
      action: PayloadAction<undefined, string, FetchWfMeta>
    ) => {
      const { id } = action.meta.arg
      if (id in state) {
        const versions = state[id].versionStatus.map((v) => v.version)
        versions.forEach((version) => {
          if (version in state[id].versions) {
            // already fetched
          } else {
            state[id].versions[version] = {
              contents: {
                error: null,
                files: {},
                loading: false,
                requestId: null,
              },
              error: null,
              loading: true,
              requestId: action.meta.requestId,
              tests: {
                error: null,
                loading: false,
                requestId: null,
                results: [],
              },
              wf: null,
            }
          }
        })
      }
    },
    [fetchWfs.fulfilled.type]: (
      state: WorkflowState,
      action: PayloadAction<
        Record<string, PublishedWorkflow | DraftWorkflow>,
        string,
        FetchWfMeta
      >
    ) => {
      const { id } = action.meta.arg
      if (id in state) {
        const versions = state[id].versionStatus.map((v) => v.version)
        versions.forEach((version) => {
          if (version in state[id].versions && action.payload[version]) {
            state[id].versions[version].loading = false
            state[id].versions[version].wf = action.payload[version]
          }
        })
      }
    },
    [fetchWfs.rejected.type]: (
      state: WorkflowState,
      action: PayloadAction<string, string, FetchWfMeta>
    ) => {
      const { id } = action.meta.arg
      if (action.payload !== 'Already fetched') {
        if (id in state) {
          const versions = state[id].versionStatus.map((v) => v.version)
          versions.forEach((version) => {
            if (version in state[id].versions) {
              state[id].versions[version].loading = false
              state[id].versions[version].error = action.payload
            }
          })
        }
      }
    },

    [fetchContents.pending.type]: (
      state: WorkflowState,
      action: PayloadAction<undefined, string, FetchContentsMeta>
    ) => {
      const { id, version } = action.meta.arg
      if (id in state && version in state[id].versions) {
        if (state[id].versions[version].contents.requestId === null) {
          state[id].versions[version].contents.loading = true
          state[id].versions[version].contents.requestId = action.meta.requestId
        }
      }
    },
    [fetchContents.fulfilled.type]: (
      state: WorkflowState,
      action: PayloadAction<
        { [target: string]: FileContent },
        string,
        FetchContentsMeta
      >
    ) => {
      const { id, version } = action.meta.arg
      if (id in state && version in state[id].versions) {
        state[id].versions[version].contents.loading = false
        state[id].versions[version].contents.files = action.payload
      }
    },
    [fetchContents.rejected.type]: (
      state: WorkflowState,
      action: PayloadAction<string, string, FetchContentsMeta>
    ) => {
      const { id, version } = action.meta.arg
      if (action.payload !== 'Already fetched') {
        if (id in state && version in state[id].versions) {
          state[id].versions[version].contents.loading = false
          state[id].versions[version].contents.error = action.payload
        }
      }
    },

    [fetchTests.pending.type]: (
      state: WorkflowState,
      action: PayloadAction<undefined, string, FetchTestsMeta>
    ) => {
      const { id, version } = action.meta.arg
      if (id in state && version in state[id].versions) {
        if (state[id].versions[version].tests.requestId === null) {
          state[id].versions[version].tests.loading = true
          state[id].versions[version].tests.requestId = action.meta.requestId
        }
      }
    },
    [fetchTests.fulfilled.type]: (
      state: WorkflowState,
      action: PayloadAction<RunResult[], string, FetchTestsMeta>
    ) => {
      const { id, version } = action.meta.arg
      if (id in state && version in state[id].versions) {
        state[id].versions[version].tests.loading = false
        state[id].versions[version].tests.results = action.payload
      }
    },
    [fetchTests.rejected.type]: (
      state: WorkflowState,
      action: PayloadAction<string, string, FetchTestsMeta>
    ) => {
      const { id, version } = action.meta.arg
      if (action.payload !== 'Already fetched') {
        if (id in state && version in state[id].versions) {
          state[id].versions[version].tests.loading = false
          state[id].versions[version].tests.error = action.payload
        }
      }
    },
  },
  initialState,
  name: 'workflow',
  reducers: {},
})

export default workflowSlice.reducer
