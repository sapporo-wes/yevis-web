import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { Box, Chip, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import WfTypeAvatar from '@/components/WfTypeAvatar'
import { wfRepo } from '@/envDefault'
import { extractWfType, isPublished, isVerified } from '@/store/getters'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

interface Props {
  wf: PublishedWorkflow | DraftWorkflow
  sx?: object
}

const Hero: React.VFC<Props> = (props: Props) => {
  const wfName = props.wf.config.workflow.name
  const wfType = extractWfType(props.wf)
  const verified = isVerified(props.wf)
  const published = isPublished(props.wf)

  return (
    <Box
      sx={{
        maxWidth: '100vw',
        bgcolor: 'primary.main',
        ...props.sx,
      }}>
      <Box
        sx={{
          maxWidth: 'lg',
          minWidth: 'lg',
          mx: 'auto',
          py: 4,
          px: 4,
        }}>
        <Stack spacing={2}>
          <Link component={RouterLink} to='/'>
            <Stack direction='row' sx={{ alignItems: 'center' }}>
              <HomeRoundedIcon
                sx={{
                  color: 'secondary.main',
                  width: '1.2rem',
                  height: '1.2rem',
                }}
              />
              <ArrowBackIosNewRoundedIcon
                sx={{
                  color: 'secondary.main',
                  width: '1.2rem',
                  height: '1.2rem',
                }}
              />
              <Typography
                sx={{
                  color: 'secondary.main',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  fontFamily: 'Quicksand',
                  ml: 1,
                  my: 0,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}>{`${wfRepo()}`}</Typography>
            </Stack>
          </Link>

          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <WfTypeAvatar
              sx={{ width: '3rem', height: '3rem' }}
              wfType={wfType}
            />
            <Typography
              component='h1'
              sx={{
                color: 'white',
                fontSize: '3rem',
                fontWeight: 'bold',
                fontFamily: 'Quicksand',
                my: 0,
              }}>
              {wfName}
            </Typography>
            {verified ? (
              <Chip
                icon={<CheckRoundedIcon />}
                label='Verified'
                size='small'
                sx={{
                  color: 'white',
                  '.MuiChip-icon': {
                    color: 'white',
                  },
                }}
                variant='outlined'
              />
            ) : null}
            {published ? null : (
              <Chip
                icon={<BuildRoundedIcon />}
                label='Draft'
                size='small'
                sx={{
                  color: 'white',
                  '.MuiChip-icon': {
                    color: 'white',
                  },
                }}
                variant='outlined'
              />
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default Hero
