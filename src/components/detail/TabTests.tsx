import { Box } from '@mui/material'
import React from 'react'

import { useAppSelector } from '@/store'

interface Props {
  id: string
  sx?: object
  version: string
}

const Tests: React.VFC<Props> = (props: Props) => {
  const tests = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]?.tests
  )
  return (
    <Box
      sx={{
        ...props.sx,
      }}>
      {JSON.stringify(tests, null, 2)}
    </Box>
  )
}

export default React.memo(Tests)
