/// Store for Detail Page
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  getAllVersions,
  isGhTrs,
  getPublishedWorkflow,
  getDraftWorkflow,
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
  version: string
}

interface FetchWfMeta {
  arg: FetchWfArgs
  requestId: string
}

export const fetchWf = createAsyncThunk(
  'workflow/fetchWf',
  async (
    args: FetchWfArgs,
    { fulfillWithValue, rejectWithValue, getState, requestId }
  ) => {
    const wfState = (getState() as RootState).workflow as WorkflowState
    if (wfState[args.id].versions[args.version].requestId !== requestId) {
      return rejectWithValue('Already fetched')
    }
    const versionStatus = wfState[args.id].versionStatus.find(
      (v) => v.version === args.version
    )
    if (typeof versionStatus === 'undefined') {
      return rejectWithValue(`This version: ${args.version} not found`)
    }
    try {
      const wf =
        versionStatus.status === 'published'
          ? await getPublishedWorkflow(args.id, args.version)
          : await getDraftWorkflow(args.id, args.version)
      return fulfillWithValue(wf)
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

export const workflowSlice = createSlice({
  extraReducers: {
    // initializeWf -> fetchWf -> fetchContents
    [initializeWf.pending.type]: (
      state,
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
      state,
      action: PayloadAction<VersionStatus[], string, InitializeWfMeta>
    ) => {
      const { id } = action.meta.arg
      state[id].loading = false
      state[id].versionStatus = action.payload
    },
    [initializeWf.rejected.type]: (
      state,
      action: PayloadAction<string, string, InitializeWfMeta>
    ) => {
      const { id } = action.meta.arg
      if (action.payload !== 'Already initialized') {
        state[id].loading = false
        state[id].error = action.payload
      }
    },

    [fetchWf.pending.type]: (
      state,
      action: PayloadAction<undefined, string, FetchWfMeta>
    ) => {
      const { id, version } = action.meta.arg
      if (id in state) {
        if (version in state) {
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
            wf: null,
          }
        }
      }
    },
    [fetchWf.fulfilled.type]: (
      state,
      action: PayloadAction<
        PublishedWorkflow | DraftWorkflow,
        string,
        FetchWfMeta
      >
    ) => {
      const { id, version } = action.meta.arg
      if (id in state && version in state[id].versions) {
        state[id].versions[version].loading = false
        state[id].versions[version].wf = action.payload
      }
    },
    [fetchWf.rejected.type]: (
      state,
      action: PayloadAction<string, string, FetchWfMeta>
    ) => {
      const { id, version } = action.meta.arg
      if (action.payload !== 'Already fetched') {
        if (id in state && version in state[id].versions) {
          state[id].versions[version].loading = false
          state[id].versions[version].error = action.payload
        }
      }
    },

    [fetchContents.pending.type]: (
      state,
      action: PayloadAction<undefined, string, FetchContentsMeta>
    ) => {
      const { id, version } = action.meta.arg
      if (id in state && version in state[id].versions) {
        state[id].versions[version].contents.loading = true
        state[id].versions[version].contents.requestId = action.meta.requestId
      }
    },
    [fetchContents.fulfilled.type]: (
      state,
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
      state,
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
  },
  initialState,
  name: 'workflow',
  reducers: {},
})

export default workflowSlice.reducer
