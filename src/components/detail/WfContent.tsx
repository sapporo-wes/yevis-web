import { Box, Card, CardContent, Theme } from '@mui/material'
import React from 'react'

import ContentBox from '@/components/detail/ContentBox'
import InfoBox from '@/components/detail/InfoBox'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

interface Props {
  wf: PublishedWorkflow | DraftWorkflow
  sx?: object
}

const WfContent: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ maxWidth: '100vw', ...props.sx }}>
      <Box
        sx={{
          columnGap: 2,
          display: 'flex',
          flexDirection: 'col',
          flexWrap: 'wrap-reverse',
          maxWidth: 'lg',
          mx: 'auto',
          px: 4,
          rowGap: 2,
        }}>
        <Card
          sx={{
            flexGrow: 1,
            width: (theme: Theme) => `calc(70% - ${theme.spacing(1)})`,
          }}>
          <CardContent children={<ContentBox wf={props.wf} />} />
        </Card>
        <Card
          sx={{
            flexGrow: 1,
            minWidth: (theme: Theme) =>
              `calc((${theme.breakpoints.values.md}px - ${theme.spacing(
                4 * 2 + 2
              )}) / 10 * 3)`,
            width: (theme: Theme) => `calc(30% - ${theme.spacing(1)})`,
          }}>
          <CardContent children={<InfoBox wf={props.wf} />} />
        </Card>
      </Box>
    </Box>
  )
}

export default WfContent
