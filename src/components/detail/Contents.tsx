import { Box, Card, CardContent, Theme } from '@mui/material'
import React from 'react'

import ContentBox from '@/components/detail/ContentBox'
import InfoBox from '@/components/detail/InfoBox'

interface Props {
  id: string
  sx?: object
  version: string
}

const Contents: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ maxWidth: '100vw', ...props.sx }}>
      <Box
        sx={{
          alignItems: 'start',
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
            height: '100%',
            width: (theme: Theme) => `calc(70% - ${theme.spacing(1)})`,
          }}>
          <CardContent
            children={<ContentBox id={props.id} version={props.version} />}
          />
        </Card>
        <Card
          sx={{
            flexGrow: 1,
            height: '100%',
            minWidth: (theme: Theme) =>
              `calc((${theme.breakpoints.values.md}px - ${theme.spacing(
                4 * 2 + 2
              )}) / 10 * 3)`,
            width: (theme: Theme) => `calc(30% - ${theme.spacing(1)})`,
          }}>
          <CardContent
            children={<InfoBox id={props.id} version={props.version} />}
          />
        </Card>
      </Box>
    </Box>
  )
}

export default React.memo(Contents)
