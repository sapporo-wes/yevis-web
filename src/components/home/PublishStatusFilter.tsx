import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { PublishStatus, setPublishStatus } from '@/store/filter'
import { publishStatusCounts } from '@/store/workflowsGetters'

interface Props {
  disabled: boolean
  sx?: object
}

const PublishStatusFilter: React.VFC<Props> = (props: Props) => {
  const wfs = useAppSelector((state: RootState) => state.workflows.wfs)
  const selectedStatus = useAppSelector(
    (state: RootState) => state.filter.publishStatus
  )
  const dispatch = useAppDispatch()
  const counts = publishStatusCounts(wfs)

  return (
    <ToggleButtonGroup
      disabled={props.disabled}
      exclusive
      onChange={(_, value) =>
        dispatch(setPublishStatus(value as PublishStatus))
      }
      size='small'
      sx={{ ...props.sx }}
      value={selectedStatus}>
      <ToggleButton
        sx={{ textTransform: 'none', width: '50%' }}
        value='published'>
        <CheckRoundedIcon
          sx={{
            height: '1.2rem',
            mr: 1,
            width: '1.2rem',
          }}
        />
        <Box children={`Published (${counts.published})`} component='span' />
      </ToggleButton>
      <ToggleButton
        sx={{
          textColor: 'secondary.main',
          textTransform: 'none',
          width: '50%',
        }}
        value='draft'>
        <BuildRoundedIcon sx={{ height: '1rem', mr: 1, width: '1rem' }} />
        <Box children={`Draft (${counts.draft})`} component='span' />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default PublishStatusFilter
