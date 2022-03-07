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
          sx={(theme: Theme) => ({
            [theme.breakpoints.down('md')]: {
              flexGrow: 1,
            },
            minWidth: `calc((${theme.breakpoints.values.md}px - ${theme.spacing(
              4 * 2 + 2
            )}) / 2)`,
            width: `calc(50% - ${theme.spacing(1)})`,
          })}
          wf={wf}
        />
      ))}
    </Box>
  )
}

export default WfCards
