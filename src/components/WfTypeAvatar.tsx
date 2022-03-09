import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded'
import { Avatar } from '@mui/material'
import React from 'react'

import cwlIcon from '@/assets/cwl-icon.png'
import nflIcon from '@/assets/nfl-icon.png'
import smkIcon from '@/assets/smk-icon.png'
import wdlIcon from '@/assets/wdl-icon.png'
import { WfType } from '@/store/filter'

const wfTypeToSrc = (wfType: WfType): string => {
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

interface Props {
  sx?: object
  wfType: WfType
}
const WfTypeAvatar: React.VFC<Props> = (props: Props) => {
  return props.wfType ? (
    <Avatar
      src={wfTypeToSrc(props.wfType)}
      sx={{ ...props.sx }}
      variant='square'
    />
  ) : (
    <Avatar
      children={<QuestionMarkRoundedIcon />}
      sx={{ ...props.sx }}
      variant='square'
    />
  )
}

export default WfTypeAvatar
