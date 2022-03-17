import { Box } from '@mui/material'
import React from 'react'

interface Props {
  content: string
  sx?: object
}

const LoadingMsg: React.VFC<Props> = (props: Props) => {
  return <Box children={props.content} component='p' sx={{ ...props.sx }} />
}

export default React.memo(LoadingMsg)
