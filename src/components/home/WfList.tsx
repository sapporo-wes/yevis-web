import { Box, Stack } from '@mui/material'
import React from 'react'

import WfCard from '@/components/home/WfCard'
import WfNameFilter from '@/components/home/WfNameFilter'
import { RootState, useAppSelector } from '@/store'
import { filteredWfs } from '@/store/getters'

const WfList: React.VFC = () => {
  const rootState = useAppSelector((state: RootState) => state)
  const wfs = filteredWfs(rootState)

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
        <Stack spacing={2}>
          <Stack direction='row'>
            <WfNameFilter />
          </Stack>
          <Stack spacing={2}>
            {[...Array(Math.ceil(wfs.length / 2)).keys()].map((rowInd) => (
              <Stack key={rowInd} direction='row' spacing={2}>
                {wfs[rowInd * 2] && <WfCard wf={wfs[rowInd * 2]} />}
                {wfs[rowInd * 2 + 1] && <WfCard wf={wfs[rowInd * 2 + 1]} />}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default WfList
