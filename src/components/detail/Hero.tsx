import BuildRoundedIcon from '@mui/icons-material/BuildRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Chip, Stack } from '@mui/material'
import React from 'react'

import BackToHome from '@/components/BackToHome'
import WfTypeAvatar from '@/components/WfTypeAvatar'
import { useAppSelector } from '@/store'
import {
  extractWfType,
  isVerified,
  isPublished,
} from '@/store/workflowsGetters'

interface Props {
  id: string
  sx?: object
  version: string
}

const Hero: React.VFC<Props> = (props: Props) => {
  const wf = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]?.wf
  )
  if (typeof wf === 'undefined' || wf === null) {
    return null
  }

  const wfType = extractWfType(wf)
  const wfName = wf.config.workflow.name
  const verified = isVerified(wf)
  const published = isPublished(wf)

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
          <BackToHome />
          <Stack
            direction='row'
            spacing={2}
            sx={{ alignItems: 'center', ...props.sx }}>
            <WfTypeAvatar
              sx={{ height: '3rem', width: '3rem' }}
              wfType={wfType}
            />
            <Box
              children={wfName}
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

export default React.memo(Hero)
