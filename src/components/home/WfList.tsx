import { Box, Stack } from '@mui/material'
import React from 'react'

import ErrorMsg from '@/components/home/ErrorMsg'
import Filters from '@/components/home/Filters'
import LoadingMsg from '@/components/home/LoadingMsg'
import WfCards from '@/components/home/WfCards'
import { RootState, useAppSelector } from '@/store'
import { isError, isLoading } from '@/store/getters'

interface Props {
  sx?: object
}

const WfList: React.VFC<Props> = (props: Props) => {
  const rootState = useAppSelector((state: RootState) => state)
  const loading = isLoading(rootState)
  const error = isError(rootState)

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
          {loading ? <LoadingMsg /> : error ? <ErrorMsg /> : <WfCards />}
        </Stack>
      </Box>
    </Box>
  )
}

export default WfList
