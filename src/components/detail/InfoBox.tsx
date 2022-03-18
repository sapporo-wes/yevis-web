import { Box, Card, CardContent } from '@mui/material'
import React from 'react'

import DetailInfo from '@/components/detail/DetailInfo'
import VersionsInfo from '@/components/detail/VersionsInfo'

interface Props {
  id: string
  sx?: object
  version: string
}

const InfoBox: React.VFC<Props> = (props: Props) => {
  return (
    <Box
      sx={{ ...props.sx, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <Card
        children={
          <CardContent
            children={<DetailInfo id={props.id} version={props.version} />}
          />
        }
      />
      <Card
        children={
          <CardContent
            children={<VersionsInfo id={props.id} version={props.version} />}
          />
        }
      />
    </Box>
  )
}

export default React.memo(InfoBox)
