import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import { Box, Stack, Link } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Footer from '@/components/Footer'
import { wfRepo } from '@/envDefault'

const NoPage: React.VFC = () => {
  return (
    <React.Fragment>
      <main>
        <Box sx={{ minHeight: 'calc(100vh - 35px)', pb: 4 }}>
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
                  children={'No Page'}
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
                  children={'This page does not exist.'}
                  component='p'
                  sx={{
                    fontFamily: 'Quicksand',
                    fontSize: '1.2rem',
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default NoPage
