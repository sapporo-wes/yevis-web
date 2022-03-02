import { Box, Theme } from '@mui/material'
import React from 'react'

import WfCard from '@/components/home/WfCard'
import { RootState, useAppSelector } from '@/store'
import { filteredWfs } from '@/store/getters'

interface Props {
  sx?: object
}

const WfCards: React.VFC<Props> = (props: Props) => {
  const rootState = useAppSelector((state: RootState) => state)
  const wfs = filteredWfs(rootState)

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
      {wfs.map((wf, i) => (
        <WfCard
          key={i}
          sx={{
            flexGrow: 1,
            minWidth: (theme: Theme) =>
              `calc((${theme.breakpoints.values.md}px - ${theme.spacing(
                4 * 2 + 2
              )}) / 2)`,
            width: (theme: Theme) => `calc(50% - ${theme.spacing(1)})`,
          }}
          wf={wf}
        />
      ))}
    </Box>
  )
}

export default WfCards
