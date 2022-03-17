import { Box, Theme } from '@mui/material'
import React from 'react'

import PublishStatusFilter from '@/components/home/PublishStatusFilter'
import SortBy from '@/components/home/SortBy'
import WfNameFilter from '@/components/home/WfNameFilter'
import WfTypeFilter from '@/components/home/WfTypeFilter'
import { useAppSelector } from '@/store'

interface Props {
  sx?: object
}

const Filters: React.VFC<Props> = (props: Props) => {
  const loading = useAppSelector((state) => state.workflows.loading)
  const error = useAppSelector((state) => state.workflows.error)
  const disabled = loading || error !== null

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
        sx={(theme: Theme) => ({
          columnGap: 2,
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          minWidth: (theme: Theme) =>
            `(${theme.breakpoints.values.lg}px - ${theme.spacing(
              4 * 2 + 2
            )}) / 2)`,
          width: `calc(50% - ${theme.spacing(1)})`,
        })}>
        <WfNameFilter
          disabled={disabled}
          sx={{
            flexGrow: 1,
          }}
        />
        <PublishStatusFilter
          disabled={disabled}
          sx={{
            minWidth: '260px',
          }}
        />
      </Box>
      <Box
        sx={(theme: Theme) => ({
          columnGap: 2,
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          minWidth: `calc((${theme.breakpoints.values.lg}px - ${theme.spacing(
            4 * 2 + 2
          )}) / 2)`,
          width: `calc(50% - ${theme.spacing(1)})`,
        })}>
        <WfTypeFilter
          disabled={disabled}
          sx={{
            flexGrow: 1,
          }}
        />
        <SortBy
          disabled={disabled}
          sx={{
            maxWidth: '80px',
            minWidth: '80px',
          }}
        />
      </Box>
    </Box>
  )
}

export default React.memo(Filters)
