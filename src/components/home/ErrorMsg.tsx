import { Box } from '@mui/material'
import React from 'react'

import { RootState, useAppSelector } from '@/store'

interface Props {
  sx?: object
}

const ErrorMsg: React.VFC<Props> = (props: Props) => {
  const publishedError = useAppSelector(
    (state: RootState) => state.workflows.publishedError
  )
  const draftError = useAppSelector(
    (state: RootState) => state.workflows.draftError
  )
  return (
    <Box
      component='p'
      sx={{
        fontSize: '1.2rem',
        ...props.sx,
      }}>
      An unexpected error occurred while loading workflows:
      {publishedError !== null && (
        <>
          <br />- Error while loading published workflows: {publishedError}
        </>
      )}
      {draftError !== null && (
        <>
          <br />- Error while loading draft workflows: {draftError}
        </>
      )}
    </Box>
  )
}

export default ErrorMsg
