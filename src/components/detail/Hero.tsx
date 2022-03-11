import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { Box, Chip, Link, Stack } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import WfTypeAvatar from '@/components/WfTypeAvatar'
import { wfRepo } from '@/envDefault'
import { WfVersion } from '@/store/workflow'
import {
  extractWfType,
  isVerified,
  isPublished,
} from '@/store/workflowsGetters'

interface Props {
  sx?: object
  wfVersion: WfVersion
}

const Hero: React.VFC<Props> = (props: Props) => {
  const wfName = props.wfVersion.wf?.config?.workflow?.name ?? ''
  const wfType = props.wfVersion.wf ? extractWfType(props.wfVersion.wf) : null
  const verified = props.wfVersion.wf ? isVerified(props.wfVersion.wf) : null
  const published = props.wfVersion.wf ? isPublished(props.wfVersion.wf) : null

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        maxWidth: '100vw',
        ...props.sx,
      }}>
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          p: 4,
        }}>
        <Stack spacing={2}>
          <Link component={RouterLink} to='/' underline='hover'>
            <Stack direction='row' sx={{ alignItems: 'center' }}>
              <HomeRoundedIcon
                sx={{
                  color: 'secondary.main',
                  height: '1.2rem',
                  width: '1.2rem',
                }}
              />
              <ArrowBackIosNewRoundedIcon
                sx={{
                  color: 'secondary.main',
                  height: '1.2rem',
                  width: '1.2rem',
                }}
              />
              <Box
                children={wfRepo()}
                component='span'
                sx={{
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                  color: 'secondary.main',
                  fontFamily: 'Quicksand',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              />
            </Stack>
          </Link>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            {wfType ? (
              <WfTypeAvatar
                sx={{ height: '3rem', width: '3rem' }}
                wfType={wfType}
              />
            ) : null}
            <Box
              children={`${wfName}`}
              component='h1'
              sx={{
                color: 'common.white',
                fontFamily: 'Quicksand',
                fontSize: '2.6rem',
                fontWeight: 'bold',
                my: 0,
              }}
            />
            {verified ? (
              <Chip
                icon={<CheckRoundedIcon />}
                label='Verified'
                size='small'
                sx={{
                  '.MuiChip-icon': {
                    color: 'common.white',
                  },
                  color: 'common.white',
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
                  '.MuiChip-icon': {
                    color: 'common.white',
                  },
                  color: 'common.white',
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
