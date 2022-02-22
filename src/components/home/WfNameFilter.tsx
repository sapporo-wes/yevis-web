import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setWfName } from '@/store/filter'
import { allWfNames } from '@/store/getters'

const WfNameFilter: React.VFC = () => {
  const rootState = useAppSelector((state: RootState) => state)
  const wfNames = allWfNames(rootState)
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
