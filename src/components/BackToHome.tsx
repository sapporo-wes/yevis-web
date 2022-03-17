import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { Stack, Box, Link } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { wfRepo } from '@/envDefault'

interface Props {
  sx?: object
}

const HeroBackToHome: React.VFC<Props> = (props: Props) => {
  return (
    <Link component={RouterLink} sx={{ ...props.sx }} to='/' underline='hover'>
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
  )
}

export default React.memo(HeroBackToHome)
