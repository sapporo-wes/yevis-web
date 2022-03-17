import { Box } from '@mui/material'
import React from 'react'

interface Props {
  error: string
  sx?: object
}

const ErrorMsg: React.VFC<Props> = (props: Props) => {
  return (
    <Box component='p' sx={{ ...props.sx }}>
      An unexpected error occurred: {props.error}
    </Box>
  )
}

export default React.memo(ErrorMsg)
