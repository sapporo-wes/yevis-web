import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

import WfTypeAvatar from '@/components/WfTypeAvatar'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setWfType, WfType } from '@/store/filter'
import { wfTypeCounts } from '@/store/workflowsGetters'

interface Props {
  disabled: boolean
  sx?: object
}

const WfTypeFilter: React.VFC<Props> = (props: Props) => {
  const selectedWfType = useAppSelector(
    (state: RootState) => state.filter.wfType
  )
  const wfs = useAppSelector((state: RootState) => state.workflows.wfs)
  const counts = wfTypeCounts(wfs)
  const dispatch = useAppDispatch()

  return (
    <ToggleButtonGroup
      disabled={props.disabled}
      exclusive
      onChange={(_, value) => dispatch(setWfType(value as WfType))}
      size='small'
      sx={{ ...props.sx }}
      value={selectedWfType}>
      <ToggleButton sx={{ textTransform: 'none', width: '25%' }} value='CWL'>
        <WfTypeAvatar
          sx={{ height: '1.4rem', mr: 1, width: '1.4rem' }}
          wfType='CWL'
        />
        <Box children={`CWL (${counts.CWL})`} component='span' />
      </ToggleButton>
      <ToggleButton sx={{ textTransform: 'none', width: '25%' }} value='WDL'>
        <WfTypeAvatar
          sx={{ height: '1.4rem', mr: 1, width: '1.4rem' }}
          wfType='WDL'
        />
        <Box children={`WDL (${counts.WDL})`} component='span' />
      </ToggleButton>
      <ToggleButton sx={{ textTransform: 'none', width: '25%' }} value='NFL'>
        <WfTypeAvatar
          sx={{ height: '1.4rem', mr: 1, width: '1.4rem' }}
          wfType='NFL'
        />
        <Box children={`NFL (${counts.NFL})`} component='span' />
      </ToggleButton>
      <ToggleButton sx={{ textTransform: 'none', width: '25%' }} value='SMK'>
        <WfTypeAvatar
          sx={{ height: '1.4rem', mr: 1, width: '1.4rem' }}
          wfType='SMK'
        />
        <Box children={`SMK (${counts.SMK})`} component='span' />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default WfTypeFilter
