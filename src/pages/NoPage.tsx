import { Box } from '@mui/material'
import React from 'react'

import ErrorHero from '@/components/ErrorHero'
import Footer from '@/components/Footer'

const NoPage: React.VFC = () => {
  return (
    <React.Fragment>
      <main>
        <Box sx={{ minHeight: 'calc(100vh - 35px)', pb: 4 }}>
          <ErrorHero
            description='The page you are looking for does not exist.'
            title='No Page'
          />
        </Box>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default NoPage
