import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setWfName } from '@/store/filter'
import { allWfNames, disableFilter } from '@/store/getters'

interface Props {
  sx?: object
}

const WfNameFilter: React.VFC<Props> = (props: Props) => {
  const rootState = useAppSelector((state: RootState) => state)
  const dispatch = useAppDispatch()
  const wfNames = allWfNames(rootState)
  const disable = disableFilter(rootState)

  return (
    <Autocomplete
      autoHighlight
      disabled={disable}
      freeSolo
      onInputChange={(_, value) => dispatch(setWfName(value))}
      options={wfNames}
      renderInput={(params) => (
        <TextField
          {...params}
          color='secondary'
          label='Workflow Name'
          onChange={(event) => {
            dispatch(setWfName(event.target.value))
          }}
          placeholder='Search by name'
        />
      )}
      size='small'
      sx={{
        ...props.sx,
      }}
    />
  )
}

export default WfNameFilter
