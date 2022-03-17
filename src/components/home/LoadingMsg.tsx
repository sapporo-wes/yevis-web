import { Box } from '@mui/material'
import React from 'react'

interface Props {
  sx?: object
}

const LoadingMsg: React.VFC<Props> = (props: Props) => {
  return (
    <Box
      children='Loading workflows...'
      component='p'
      sx={{
        fontSize: '1.2rem',
        ...props.sx,
      }}
    />
  )
}

export default React.memo(LoadingMsg)
