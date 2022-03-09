import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setAuthors } from '@/store/filter'
import { allAuthors } from '@/store/workflowsGetters'

interface Props {
  disabled: boolean
  sx?: object
}

const AuthorsFilter: React.VFC<Props> = (props: Props) => {
  const wfs = useAppSelector((state: RootState) => state.workflows.wfs)
  const dispatch = useAppDispatch()
  const authors = allAuthors(wfs)

  return (
    <Autocomplete
      autoHighlight
      disabled={props.disabled}
      multiple
      onChange={(_, value) => dispatch(setAuthors(value))}
      options={authors}
      renderInput={(params) => (
        <TextField
          {...params}
          color='secondary'
          label='Authors'
          placeholder='Select author'
        />
      )}
      size='small'
      sx={{
        ...props.sx,
      }}
    />
  )
}

export default AuthorsFilter
