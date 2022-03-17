import { Box } from '@mui/material'
import React from 'react'

interface Props {
  id: string
  sx?: object
  version: string
}

const InfoBox: React.VFC<Props> = (props: Props) => {
  return <Box sx={{ ...props.sx }}>info</Box>
}

export default React.memo(InfoBox)
