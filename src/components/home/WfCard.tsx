import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Button, Card, CardContent, Link, Stack } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Authors from '@/components/home/Authors'
import DoiBadge from '@/components/home/DoiBadge'
import WfTypeAvatar from '@/components/WfTypeAvatar'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'
import {
  extractAuthors,
  extractWfType,
  generateAgoStr,
  isPublished,
  isVerified,
} from '@/store/workflowsGetters'

interface Props {
  sx?: object
  wf: PublishedWorkflow | DraftWorkflow
}

const WfCard: React.VFC<Props> = (props: Props) => {
  const config = props.wf.config
  const wfType = extractWfType(props.wf)
  const verified = isVerified(props.wf)
  const published = isPublished(props.wf)
  const authors = extractAuthors(props.wf)
  const agoStr = generateAgoStr(props.wf)
  const doi = config.zenodo?.concept_doi

  return (
    <Card sx={props.sx}>
      <CardContent sx={{ height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            rowGap: 2,
          }}>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <WfTypeAvatar
              sx={{ height: '1.4rem', width: '1.4rem' }}
              wfType={wfType}
            />
            <Link
              children={config.workflow.name}
              component={RouterLink}
              sx={{
                color: 'primary.main',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
              to={`workflows/${config.id}/versions/${config.version}`}
              underline='hover'
            />
            {verified ? (
              <CheckRoundedIcon
                sx={{
                  color: 'success.light',
                  height: '1.4rem',
                  width: '1.4rem',
                }}
              />
            ) : null}
            {published ? null : (
              <BuildRoundedIcon
                sx={{ color: 'error.light', height: '1.2rem', width: '1.2rem' }}
              />
            )}
          </Stack>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              px: 2,
              rowGap: 2,
            }}>
            <Authors authors={authors} sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                alignItems: 'center',
                columnGap: 2,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                rowGap: 2,
              }}>
              <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
                <Button
                  children={`Version ${config.version}`}
                  color='secondary'
                  component={RouterLink}
                  size='small'
                  sx={{ textTransform: 'none' }}
                  to={`workflows/${config.id}/versions/${config.version}`}
                  variant='outlined'
                />
                <Box
                  children={agoStr}
                  component='p'
                  sx={{ fontSize: '0.9rem', fontWeight: 'light' }}
                />
              </Stack>
              {doi ? <DoiBadge doi={doi} /> : null}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default React.memo(WfCard)
