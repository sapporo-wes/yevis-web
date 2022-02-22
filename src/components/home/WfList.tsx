import { Box, Stack, Theme } from '@mui/material'
import React from 'react'

// import AuthorsFilter from '@/components/home/AuthorsFilter'
import PublishStatusFilter from '@/components/home/PublishStatusFilter'
import SortBy from '@/components/home/SortBy'
import WfCard from '@/components/home/WfCard'
import WfNameFilter from '@/components/home/WfNameFilter'
import WfTypeFilter from '@/components/home/WfTypeFilter'
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
          minWidth: 'lg',
          mx: 'auto',
          px: 8,
        }}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              rowGap: 2,
              columnGap: 2,
            }}>
            <WfNameFilter
              sx={{
                minWidth: '200px',
                flexGrow: 4,
              }}
            />
            {/* <AuthorsFilter
              sx={{
                minWidth: '200px',
              }}
            /> */}
            <PublishStatusFilter
              sx={{
                // maxWidth: '260px',
                minWidth: '260px',
                flexGrow: 1,
              }}
            />
            <WfTypeFilter
              sx={{
                flexGrow: 1,
                // maxWidth: '432px',
                minWidth: '432px',
              }}
            />
            <SortBy
              sx={{
                maxWidth: '80px',
                minWidth: '80px',
              }}
            />
          </Box>
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
