/// Store for Workflow Page

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getDraftWorkflow, getPublishedWorkflow } from '@/api/trs'
import { RootState } from '@/store'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

export interface FileContent {
  content: string
  requestId: string
  loading: boolean
  error: string | null
}

interface WorkflowState {
  wf: PublishedWorkflow | DraftWorkflow | null
  loading: boolean
  error: string | null
  contents: {
    [fileName: string]: FileContent
  }
}

const initialState: WorkflowState = {
  contents: {},
  error: null,
  loading: true,
  wf: null,
}

export const fetchWorkflow = createAsyncThunk(
  'workflow/fetchWorkflow',
  async (
    args: { id?: string; version?: string },
    { fulfillWithValue, rejectWithValue }
  ) => {
    if (typeof args.id === 'undefined') {
      // unreachable
      return rejectWithValue('No id provided')
    } else {
      try {
        const publishedWf = await getPublishedWorkflow(args.id, args.version)
        return fulfillWithValue(publishedWf)
      } catch (publishErr) {
        try {
          const draftWf = await getDraftWorkflow(args.id, args.version)
          return fulfillWithValue(draftWf)
        } catch (draftErr) {
          return rejectWithValue((publishErr as Error).message)
        }
      }
    }
  }
)

export interface FetchContentArgs {
  name: string
  url: string
}

export const isFetchableFileExt = (url: string): boolean => {
  const fileExts = ['yaml', 'yml', 'json', 'md', 'txt']
  const ext = url.split('.').pop() || ''
  return fileExts.includes(ext)
}

export const fetchText = async (url: string): Promise<string> => {
  const res = await fetch(url, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch content from ${url}`)
  }
  return res.text()
}

export const fetchContent = createAsyncThunk(
  'workflow/fetchContent',
  async (
    args: FetchContentArgs,
    { fulfillWithValue, rejectWithValue, getState, requestId }
  ) => {
    const contents = (getState() as RootState).workflow.contents
    if (contents[args.name]) {
      if (contents[args.name].requestId !== requestId) {
        return rejectWithValue('Already fetching')
      }

      if (!isFetchableFileExt(args.url)) {
        return rejectWithValue('File type not supported')
      }
      try {
        const content = await fetchText(args.url)
        return fulfillWithValue(content)
      } catch (err) {
        console.log(err)
        return rejectWithValue((err as Error).message)
      }
    } else {
      return rejectWithValue('File not found')
    }
  }
)

interface FetchContentMeta {
  arg: FetchContentArgs
  requestId: string
  requestStatue: 'pending' | 'fulfilled' | 'rejected'
}

export const workflowSlice = createSlice({
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

    [fetchContent.pending.type]: (
      state,
      action: PayloadAction<undefined, string, FetchContentMeta>
    ) => {
      if (action.meta.arg.name in state.contents) {
        // do nothing
      } else {
        // initialize
        state.contents[action.meta.arg.name] = {
          content: '',
          error: null,
          loading: true,
          requestId: action.meta.requestId,
        }
      }
    },
    [fetchContent.fulfilled.type]: (
      state,
      action: PayloadAction<FileContent['content'], string, FetchContentMeta>
    ) => {
      if (action.meta.arg.name in state.contents) {
        state.contents[action.meta.arg.name].content = action.payload
        state.contents[action.meta.arg.name].loading = false
      } else {
        // unreachable
      }
    },
    [fetchContent.rejected.type]: (
      state,
      action: PayloadAction<FileContent['error'], string, FetchContentMeta>
    ) => {
      if (
        action.payload === 'Already fetched' ||
        action.payload === 'File not found'
      ) {
        // do nothing
      } else {
        if (action.meta.arg.name in state.contents) {
          state.contents[action.meta.arg.name].loading = false
          state.contents[action.meta.arg.name].error = action.payload
        } else {
          // unreachable
        }
      }
    },
  },
  initialState,
  name: 'workflow',
  reducers: {},
})

export default workflowSlice.reducer
