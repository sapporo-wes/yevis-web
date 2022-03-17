import { Box, Stack } from '@mui/material'
import React from 'react'

import ErrorMsg from '@/components/ErrorMsg'
import Filters from '@/components/home/Filters'
import WfCards from '@/components/home/WfCards'
import LoadingMsg from '@/components/LoadingMsg'
import { useAppSelector } from '@/store'

interface Props {
  sx?: object
}

const WfList: React.VFC<Props> = (props: Props) => {
  const loading = useAppSelector((state) => state.workflows.loading)
  const error = useAppSelector((state) => state.workflows.error)

  return (
    <Box
      sx={{
        maxWidth: '100vw',
        ...props.sx,
      }}>
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          px: 4,
        }}>
        <Stack spacing={2}>
          <Filters />
          {loading ? (
            <LoadingMsg content='Loading workflows...' />
          ) : error !== null ? (
            <ErrorMsg error={error} />
          ) : (
            <WfCards />
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default React.memo(WfList)
