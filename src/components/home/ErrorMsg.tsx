import { Box } from '@mui/material'
import React from 'react'

import { RootState, useAppSelector } from '@/store'

interface Props {
  sx?: object
}

const ErrorMsg: React.VFC<Props> = (props: Props) => {
  const error = useAppSelector((state: RootState) => state.workflows.error)
  return (
    <Box
      component='p'
      sx={{
        fontSize: '1.2rem',
        ...props.sx,
      }}>
      An unexpected error occurred while loading workflows: {error}
    </Box>
  )
}

export default ErrorMsg
