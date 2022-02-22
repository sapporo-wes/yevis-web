import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

import WfTypeAvatar from '@/components/home/WfTypeAvatar'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setWfType, WfType } from '@/store/filter'
import { wfTypeCounts } from '@/store/getters'

interface Props {
  sx?: object
}

const WfTypeFilter: React.VFC<Props> = (props: Props) => {
  const rootState = useAppSelector((state: RootState) => state)
  const selectedWfType = useAppSelector(
    (state: RootState) => state.filter.wfType
  )
  const dispatch = useAppDispatch()
  const counts = wfTypeCounts(rootState)

  return (
    <ToggleButtonGroup
      exclusive
      onChange={(_, value) => dispatch(setWfType(value as WfType))}
      size='small'
      sx={{ ...props.sx }}
      value={selectedWfType}>
      <ToggleButton sx={{ textTransform: 'none', width: '25%' }} value='CWL'>
        <WfTypeAvatar
          sx={{ width: '1.4rem', height: '1.4rem', mr: 1 }}
          wfType='CWL'
        />{' '}
        CWL ({counts.CWL})
      </ToggleButton>
      <ToggleButton sx={{ textTransform: 'none', width: '25%' }} value='WDL'>
        <WfTypeAvatar
          sx={{ width: '1.4rem', height: '1.4rem', mr: 1 }}
          wfType='WDL'
        />{' '}
        WDL ({counts.WDL})
      </ToggleButton>
      <ToggleButton sx={{ textTransform: 'none', width: '25%' }} value='NFL'>
        <WfTypeAvatar
          sx={{ width: '1.4rem', height: '1.4rem', mr: 1 }}
          wfType='NFL'
        />{' '}
        NFL ({counts.NFL})
      </ToggleButton>
      <ToggleButton sx={{ textTransform: 'none', width: '25%' }} value='SMK'>
        <WfTypeAvatar
          sx={{ width: '1.4rem', height: '1.4rem', mr: 1 }}
          wfType='SMK'
        />{' '}
        SMK ({counts.SMK})
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default WfTypeFilter
