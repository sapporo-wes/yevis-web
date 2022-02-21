import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FilterState {
  wfName: string
}

const initialState: FilterState = {
  wfName: '',
}
export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setWfName: (state, action: PayloadAction<FilterState['wfName']>) => {
      state.wfName = action.payload
    },
  },
})

export const { setWfName } = filterSlice.actions

export default filterSlice.reducer
