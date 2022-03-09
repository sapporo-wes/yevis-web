import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import SortByAlphaOutlinedIcon from '@mui/icons-material/SortByAlphaOutlined'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setSortBy, SortType } from '@/store/filter'

interface Props {
  disabled: boolean
  sx?: object
}

const SortBy: React.VFC<Props> = (props: Props) => {
  const sortBy = useAppSelector((state: RootState) => state.filter.sortBy)
  const dispatch = useAppDispatch()

  return (
    <ToggleButtonGroup
      disabled={props.disabled}
      exclusive
      onChange={(_, value) => dispatch(setSortBy(value as SortType))}
      size='small'
      sx={{ ...props.sx }}
      value={sortBy}>
      <ToggleButton
        children={<AccessTimeOutlinedIcon />}
        sx={{ textTransform: 'none', width: '50%' }}
        value='date'
      />
      <ToggleButton
        children={<SortByAlphaOutlinedIcon />}
        sx={{ textTransform: 'none', width: '50%' }}
        value='name'
      />
    </ToggleButtonGroup>
  )
}

export default SortBy
