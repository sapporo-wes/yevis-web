import { Box } from '@mui/material'
import React from 'react'

import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

interface Props {
  sx?: object
  wf: PublishedWorkflow | DraftWorkflow
}

const InfoBox: React.VFC<Props> = (props: Props) => {
  return <Box sx={{ ...props.sx }}>info</Box>
}

export default InfoBox
