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
          maxWidth: 'lg',
          minWidth: 'lg',
          mx: 'auto',
          px: 4,
          display: 'flex',
          flexDirection: 'col',
          flexWrap: 'wrap-reverse',
          rowGap: 2,
          columnGap: 2,
        }}>
        <Card
          sx={{
            width: (theme: Theme) => `calc(70% - ${theme.spacing(1)})`,
            flexGrow: 1,
          }}>
          <CardContent>
            <ContentBox wf={props.wf} />
          </CardContent>
        </Card>
        <Card
          sx={{
            width: (theme: Theme) => `calc(30% - ${theme.spacing(1)})`,
            flexGrow: 1,
            minWidth: '300px',
          }}>
          <CardContent>
            <InfoBox wf={props.wf} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default WfContent
