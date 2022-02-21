import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Authors from '@/components/main/Authors'
import WfTypeAvatar from '@/components/main/WfTypeAvatar'
import { extractVersion, latestWfVersion } from '@/store/workflows'
import { Config } from '@/types/ghTrs'
import { Tool } from '@/types/trs'

interface Props {
  wf: Tool
  config: Config | null
  modifiedDate: string | null
}

const daySeconds = 60 * 60 * 24

const timeSince = (date: string) => {
  const prev = dayjs(date)
  const now = dayjs()
  const seconds = now.diff(prev, 'seconds')
  if (seconds < daySeconds) {
    return 'today'
  } else if (seconds < daySeconds * 2) {
    return 'yesterday'
  } else if (seconds < daySeconds * 7) {
    const dayDiff = now.diff(prev, 'day')
    return `${dayDiff} days ago`
  } else if (seconds < daySeconds * 30) {
    const weekDiff = now.diff(prev, 'week')
    return `${weekDiff} weeks ago`
  } else if (seconds < daySeconds * 365) {
    const monthDiff = now.diff(prev, 'month')
    return `${monthDiff} months ago`
  } else {
    const yearDiff = now.diff(prev, 'year')
    return `${yearDiff} years ago`
  }
}

const WfCard: React.VFC<Props> = (props: Props) => {
  const wfVersion = latestWfVersion(props.wf)
  const wfVersionString = extractVersion(wfVersion).raw
  const wfType = wfVersion?.descriptor_type?.[0] || null
  const verified = wfVersion?.verified || false
  const authors = wfVersion?.author || []

  return (
    <Card
      sx={{
        flexGrow: 1,
        flexBasis: 0,
      }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <WfTypeAvatar wfType={wfType} />
            <Link
              component={RouterLink}
              sx={{
                color: 'primary.main',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
              underline='none'
              to={`workflows/${props.wf.id}`}>
              {props.wf.name}
            </Link>
            {verified ? (
              <CheckRoundedIcon
                sx={{ width: '1.4rem', height: '1.4rem' }}
                color='success'
              />
            ) : null}
          </Stack>
          <Box sx={{ px: 2 }}>
            <Stack spacing={2}>
              <Authors authors={authors} />
              <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
                <Button
                  color='secondary'
                  size='small'
                  variant='outlined'
                  sx={{ textTransform: 'none' }}
                  component={RouterLink}
                  to={`workflows/${props.wf.id}/versions/${wfVersionString}`}>
                  Version {wfVersionString}
                </Button>
                {props.modifiedDate && (
                  <Typography sx={{ fontSize: '1rem', fontWeight: 'light' }}>
                    Published {timeSince(props.modifiedDate)}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default WfCard
