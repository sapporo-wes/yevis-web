import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded'
import { Avatar } from '@mui/material'
import React from 'react'

import cwlIcon from '@/assets/cwl-icon.png'
import nflIcon from '@/assets/nfl-icon.png'
import smkIcon from '@/assets/smk-icon.png'
import wdlIcon from '@/assets/wdl-icon.png'
import { DescriptorType } from '@/types/trs'

interface Props {
  wfType: DescriptorType | null
}

const wfTypeToSrc = (wfType: DescriptorType): string => {
  if (wfType === 'CWL') {
    return cwlIcon
  } else if (wfType === 'NFL') {
    return nflIcon
  } else if (wfType === 'SMK') {
    return smkIcon
  } else if (wfType === 'WDL') {
    return wdlIcon
  } else {
    return ''
  }
}

const WfTypeAvatar: React.VFC<Props> = (props: Props) => {
  return props.wfType ? (
    <Avatar
      variant='square'
      src={wfTypeToSrc(props.wfType)}
      sx={{ width: '1.4rem', height: '1.4rem' }}
    />
  ) : (
    <Avatar variant='square' sx={{ width: '1.4rem', height: '1.4rem' }}>
      <QuestionMarkRoundedIcon />
    </Avatar>
  )
}

export default WfTypeAvatar
