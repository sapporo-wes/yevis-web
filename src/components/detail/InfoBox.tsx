import { Box } from '@mui/material'
import React from 'react'

import { WfVersion, VersionStatus } from '@/store/workflow'

interface Props {
  sx?: object
  versions: VersionStatus[]
  wfVersion: WfVersion
}

const InfoBox: React.VFC<Props> = (props: Props) => {
  return <Box sx={{ ...props.sx }}>info</Box>
}

export default InfoBox
