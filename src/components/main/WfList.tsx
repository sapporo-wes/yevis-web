import Box from '@mui/material/Box'
import React, { useEffect } from 'react'

import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { fetchWorkflows } from '@/store/workflows'

const WfList: React.VFC = () => {
  const { workflows } = useAppSelector((state: RootState) => state.workflows)
  const dispatch = useAppDispatch()
  useEffect(() => {
    ;(async () => dispatch(fetchWorkflows()))()
  }, [dispatch])

  return (
    <Box
      sx={{
        maxWidth: '100vw',
      }}>
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          px: 8,
        }}>
        {JSON.stringify(workflows)}
      </Box>
    </Box>
  )
}

export default WfList
