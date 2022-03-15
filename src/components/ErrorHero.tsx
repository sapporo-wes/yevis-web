import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { Box, Stack, Link } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { wfRepo } from '@/envDefault'

interface Props {
  description: string
  title: string
}

const ErrorHero: React.VFC<Props> = (props: Props) => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        maxWidth: '100vw',
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
          <Box
            children={props.title}
            component='h1'
            sx={{
              color: 'common.white',
              fontFamily: 'Quicksand',
              fontSize: '3.6rem',
              fontWeight: 'bold',
              my: 0,
            }}
          />
          <Box
            children={props.description}
            component='p'
            sx={{
              fontFamily: 'Quicksand',
              fontSize: '1.2rem',
            }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default ErrorHero
