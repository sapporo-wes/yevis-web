import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setWfName } from '@/store/filter'
import { getWfNames } from '@/store/workflows'

const WfNameFilter: React.VFC = () => {
  const wfsState = useAppSelector((state: RootState) => state.workflows)
  const wfNames = getWfNames(wfsState)
  const dispatch = useAppDispatch()

  return (
    <Autocomplete
      freeSolo
      options={wfNames}
      size='small'
      autoHighlight
      sx={{
        width: '300px',
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Search'
          color='secondary'
          onChange={(event) => {
            dispatch(setWfName(event.target.value))
          }}
        />
      )}
    />
  )
}

export default WfNameFilter
