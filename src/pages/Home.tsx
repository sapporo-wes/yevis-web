import { Box, Stack } from '@mui/material'
import React from 'react'

import Footer from '@/components/Footer'
import Hero from '@/components/home/Hero'
import WfList from '@/components/home/WfList'
import { wfRepo } from '@/envDefault'
import { useAppDispatch } from '@/store'
import { fetchWfs } from '@/store/workflows'

const Home: React.VFC = () => {
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    document.title = `Yevis Web ${wfRepo()}`
    dispatch(fetchWfs())
  }, [dispatch])

  return (
    <React.Fragment>
      <main>
        <Box sx={{ minHeight: 'calc(100vh - 35px)', pb: 4 }}>
          <Stack spacing={4}>
            <Hero />
            <WfList />
          </Stack>
        </Box>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Home
