import { Box, Stack, Theme } from '@mui/material'
import React from 'react'

import AuthorsFilter from '@/components/home/AuthorsFilter'
import WfCard from '@/components/home/WfCard'
import WfNameFilter from '@/components/home/WfNameFilter'
import { RootState, useAppSelector } from '@/store'
import { filteredWfs } from '@/store/getters'

interface Props {
  sx?: object
}

const WfList: React.VFC<Props> = (props: Props) => {
  const rootState = useAppSelector((state: RootState) => state)
  const wfs = filteredWfs(rootState)

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
          px: 8,
        }}>
        <Stack spacing={2}>
          <Stack direction='row' spacing={2}>
            <WfNameFilter sx={{ width: '300px' }} />
            <AuthorsFilter sx={{ width: '300px' }} />
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
                key={i}
                sx={{
                  width: (theme: Theme) => `calc(50% - ${theme.spacing(1)})`,
                }}
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
