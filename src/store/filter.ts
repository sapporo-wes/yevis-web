import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FilterState {
  wfName: string
  authors: string[]
  publishStatus: ('published' | 'draft')[]
  wfType: ('CWL' | 'WDL' | 'NFL' | 'SMK')[]
  sortBy: 'date' | 'name'
}

const initialState: FilterState = {
  wfName: '',
  authors: [],
  publishStatus: ['published', 'draft'],
  wfType: ['CWL', 'WDL', 'NFL', 'SMK'],
  sortBy: 'date',
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setWfName: (state, action: PayloadAction<FilterState['wfName']>) => {
      state.wfName = action.payload
    },

    setAuthors: (state, action: PayloadAction<FilterState['authors']>) => {
      state.authors = action.payload
    },

    setPublishStatus: (
      state,
      action: PayloadAction<FilterState['publishStatus']>
    ) => {
      state.publishStatus = action.payload
    },

    setWfType: (state, action: PayloadAction<FilterState['wfType']>) => {
      state.wfType = action.payload
    },

    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload
    },
  },
})

export const { setWfName, setAuthors, setPublishStatus, setWfType, setSortBy } =
  filterSlice.actions

export default filterSlice.reducer
