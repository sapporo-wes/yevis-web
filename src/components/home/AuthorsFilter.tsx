import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setAuthors } from '@/store/filter'
import { allAuthors } from '@/store/getters'

interface Props {
  sx?: object
}

const AuthorsFilter: React.VFC<Props> = (props: Props) => {
  const rootState = useAppSelector((state: RootState) => state)
  const dispatch = useAppDispatch()
  const authors = allAuthors(rootState)

  return (
    <Autocomplete
      autoHighlight
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
