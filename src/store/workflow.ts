/// Store for Detail Page
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import semver from 'semver'

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

export interface WorkflowState {
  [id: string]: {
    error: string | null
    loading: boolean
    requestId: string | null
    versions: {
      [version: string]: {
        contents: {
          files: { [target: string]: FileContent }
          loading: boolean
          requestId: string | null
        }
        error: string | null
        loading: boolean
        requestId: string | null
        status: PublishStatus
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
  version?: string
}

interface FetchWfMeta {
  arg: FetchWfArgs
  requestId: string
}

const latestVersion = (versions: WfVersions): [string, PublishStatus] => {
  const publishedVersions = Object.entries(versions)
    .filter(([_ver, verObj]) => verObj.status === 'published')
    .map(([ver, _verObj]) => ver)
    .sort((a, b) => semver.compare(a[0], b[0]))
  if (publishedVersions.length > 0) {
    return [publishedVersions[publishedVersions.length - 1], 'published']
  } else {
    const draftVersion = Object.entries(versions)
      .filter(([_ver, verObj]) => verObj.status === 'draft')
      .map(([ver, _verObj]) => ver)
      .sort((a, b) => semver.compare(a[0], b[0]))
    if (draftVersion.length > 0) {
      return [draftVersion[draftVersion.length - 1], 'draft']
    }
    throw new Error('No published or draft version')
  }
}

const findVersion = (
  versions: WfVersions,
  version: string
): [string, PublishStatus] => {
  const verObj = versions[version]
  if (typeof verObj === 'undefined') {
    throw new Error(`Version ${version} not found`)
  }
  return [version, verObj.status]
}

export const resolveVersion = (
  versions: WfVersions,
  version?: string
): [string, PublishStatus] => {
  return typeof version === 'undefined'
    ? latestVersion(versions)
    : findVersion(versions, version)
}

export const fetchWf = createAsyncThunk(
  'workflow/fetchWf',
  async (
    args: FetchWfArgs,
    { fulfillWithValue, rejectWithValue, getState, requestId }
  ) => {
    const wfState = (getState() as RootState).workflow as WorkflowState
    try {
      const [version, status] = resolveVersion(
        wfState[args.id].versions,
        args.version
      )
      if (wfState[args.id].versions[version].requestId !== requestId) {
        return rejectWithValue('Already fetched')
      }
      const wf =
        status === 'published'
          ? await getPublishedWorkflow(args.id, version)
          : await getDraftWorkflow(args.id, version)
      return fulfillWithValue(wf)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  }
)

interface FetchContentsArgs {
  id: string
  version?: string
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
    try {
      const version = resolveVersion(wfState[args.id].versions, args.version)[0]
      if (wfState[args.id].versions[version].contents.requestId !== requestId) {
        return rejectWithValue('Already fetched')
      }
      const wf = wfState[args.id].versions[version].wf
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
      if (action.meta.arg.id in state) {
        // already initialized
      } else {
        state[action.meta.arg.id] = {
          error: null,
          loading: true,
          requestId: action.meta.requestId,
          versions: {},
        }
      }
    },
    [initializeWf.fulfilled.type]: (
      state,
      action: PayloadAction<[string, PublishStatus][], string, InitializeWfMeta>
    ) => {
      state[action.meta.arg.id].loading = false
      action.payload.forEach(([version, status]) => {
        state[action.meta.arg.id].versions[version] = {
          contents: {
            files: {},
            loading: false,
            requestId: null,
          },
          error: null,
          loading: false,
          requestId: null,
          status,
          wf: null,
        }
      })
    },
    [initializeWf.rejected.type]: (
      state,
      action: PayloadAction<string, string, InitializeWfMeta>
    ) => {
      if (action.payload !== 'Already initialized') {
        state[action.meta.arg.id].loading = false
        state[action.meta.arg.id].error = action.payload
      }
    },

    [fetchWf.pending.type]: (
      state,
      action: PayloadAction<undefined, string, FetchWfMeta>
    ) => {
      if (action.meta.arg.id in state) {
        const version = resolveVersion(
          state[action.meta.arg.id].versions,
          action.meta.arg.version
        )[0]
        if (state[action.meta.arg.id].versions[version].requestId === null) {
          state[action.meta.arg.id].versions[version].loading = true
          state[action.meta.arg.id].versions[version].requestId =
            action.meta.requestId
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
      if (action.meta.arg.id in state) {
        const version = resolveVersion(
          state[action.meta.arg.id].versions,
          action.meta.arg.version
        )[0]
        state[action.meta.arg.id].versions[version].loading = false
        state[action.meta.arg.id].versions[version].wf = action.payload
      }
    },
    [fetchWf.rejected.type]: (
      state,
      action: PayloadAction<string, string, FetchWfMeta>
    ) => {
      if (action.payload !== 'Already fetched') {
        if (action.meta.arg.id in state) {
          const version = resolveVersion(
            state[action.meta.arg.id].versions,
            action.meta.arg.version
          )[0]
          state[action.meta.arg.id].versions[version].loading = false
          state[action.meta.arg.id].versions[version].error = action.payload
        }
      }
    },

    [fetchContents.pending.type]: (
      state,
      action: PayloadAction<undefined, string, FetchContentsMeta>
    ) => {
      const version = resolveVersion(
        state[action.meta.arg.id].versions,
        action.meta.arg.version
      )[0]
      if (
        action.meta.arg.id in state &&
        version in state[action.meta.arg.id].versions
      ) {
        if (
          state[action.meta.arg.id].versions[version].contents.requestId ===
          null
        ) {
          state[action.meta.arg.id].versions[version].contents.loading = true
          state[action.meta.arg.id].versions[version].contents.requestId =
            action.meta.requestId
        }
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
      const version = resolveVersion(
        state[action.meta.arg.id].versions,
        action.meta.arg.version
      )[0]
      if (
        action.meta.arg.id in state &&
        version in state[action.meta.arg.id].versions
      ) {
        state[action.meta.arg.id].versions[version].contents.loading = false
        state[action.meta.arg.id].versions[version].contents.files =
          action.payload
      }
    },
    [fetchContents.rejected.type]: (
      state,
      action: PayloadAction<string, string, FetchContentsMeta>
    ) => {
      if (action.payload !== 'Already fetched') {
        const version = resolveVersion(
          state[action.meta.arg.id].versions,
          action.meta.arg.version
        )[0]
        if (
          action.meta.arg.id in state &&
          version in state[action.meta.arg.id].versions
        ) {
          state[action.meta.arg.id].versions[version].contents.loading = false
        }
      }
    },
  },
  initialState,
  name: 'workflow',
  reducers: {},
})

export default workflowSlice.reducer
