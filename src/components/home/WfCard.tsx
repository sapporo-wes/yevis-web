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
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Authors from '@/components/home/Authors'
import WfTypeAvatar from '@/components/home/WfTypeAvatar'
import {
  extractAuthors,
  extractConfig,
  extractVersion,
  extractWfType,
  generateAgoStr,
  isVerified,
} from '@/store/getters'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

interface Props {
  wf: PublishedWorkflow | DraftWorkflow
}

const WfCard: React.VFC<Props> = (props: Props) => {
  const config = extractConfig(props.wf)
  const wfType = extractWfType(props.wf)
  const verified = isVerified(props.wf)
  const authors = extractAuthors(props.wf)
  const version = extractVersion(props.wf)
  const agoStr = generateAgoStr(props.wf)

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
              to={`workflows/${config.id}`}>
              {config.workflow.name}
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
                  to={`workflows/${config.id}/versions/${version}`}>
                  Version {version}
                </Button>
                <Typography sx={{ fontSize: '1rem', fontWeight: 'light' }}>
                  {agoStr}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default WfCard
