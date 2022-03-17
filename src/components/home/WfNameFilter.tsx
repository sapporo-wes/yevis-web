import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

import { useAppDispatch, useAppSelector } from '@/store'
import { setWfName } from '@/store/filter'
import { allWfNames } from '@/store/workflowsGetters'

interface Props {
  disabled: boolean
  sx?: object
}

const WfNameFilter: React.VFC<Props> = (props: Props) => {
  const wfs = useAppSelector((state) => state.workflows.wfs)
  const dispatch = useAppDispatch()
  const wfNames = allWfNames(wfs)

  return (
    <Autocomplete
      autoHighlight
      disabled={props.disabled}
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

export default React.memo(WfNameFilter)
