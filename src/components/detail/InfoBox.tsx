import { Box, Card, CardContent } from '@mui/material'
import React from 'react'

import VersionsInfo from '@/components/detail/VersionsInfo'
import { useAppSelector } from '@/store'

interface Props {
  id: string
  sx?: object
  version: string
}

const InfoBox: React.VFC<Props> = (props: Props) => {
  const wf = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]
  )
  if (typeof wf === 'undefined' || wf === null) {
    return null
  }

  return (
    <Box
      sx={{ ...props.sx, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
      <Card>
        <CardContent
          children={<VersionsInfo id={props.id} version={props.version} />}
        />
      </Card>
      <Card>
        <CardContent>card2</CardContent>
      </Card>
    </Box>
  )
}

export default React.memo(InfoBox)
