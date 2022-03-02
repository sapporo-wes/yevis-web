import { Box, Theme } from '@mui/material'
import React from 'react'

import PublishStatusFilter from '@/components/home/PublishStatusFilter'
import SortBy from '@/components/home/SortBy'
import WfNameFilter from '@/components/home/WfNameFilter'
import WfTypeFilter from '@/components/home/WfTypeFilter'

interface Props {
  sx?: object
}

const Filters: React.VFC<Props> = (props: Props) => {
  return (
    <Box
      sx={{
        columnGap: 2,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 2,
        ...props.sx,
      }}>
      <Box
        sx={{
          columnGap: 2,
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          flexWrap: 'nowrap',
          minWidth: (theme: Theme) =>
            `calc((${theme.breakpoints.values.lg}px - ${theme.spacing(
              4 * 2 + 2
            )}) / 2)`,
        }}>
        <WfNameFilter
          sx={{
            flexGrow: 1,
          }}
        />
        <PublishStatusFilter
          sx={{
            minWidth: '260px',
          }}
        />
      </Box>
      <Box
        sx={{
          columnGap: 2,
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          flexWrap: 'nowrap',
          minWidth: (theme: Theme) =>
            `calc((${theme.breakpoints.values.lg}px - ${theme.spacing(
              10
            )}) / 2)`,
        }}>
        <WfTypeFilter
          sx={{
            flexGrow: 1,
            minWidth: '440px',
          }}
        />
        <SortBy
          sx={{
            maxWidth: '80px',
            minWidth: '80px',
          }}
        />
      </Box>
    </Box>
  )
}

export default Filters
