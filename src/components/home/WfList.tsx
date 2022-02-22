import { Box, Stack, Theme } from '@mui/material'
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              rowGap: 2,
              columnGap: 2,
              justifyContent: 'stretch',
            }}>
            {wfs.map((wf, i) => (
              <WfCard
                sx={{
                  width: (theme: Theme) => `calc(50% - ${theme.spacing(1)})`,
                  // height: '3',
                }}
                key={i}
                wf={wf}
              />
            ))}
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default WfList
