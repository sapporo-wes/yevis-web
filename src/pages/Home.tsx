import { Stack } from '@mui/material'
import React, { useEffect } from 'react'

import Footer from '@/components/Footer'
import Hero from '@/components/home/Hero'
import WfList from '@/components/home/WfList'
import { useAppDispatch } from '@/store'
import { fetchDraftWorkflows, fetchPublishedWorkflows } from '@/store/workflows'

const Home: React.VFC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    Promise.all([
      dispatch(fetchPublishedWorkflows()),
      dispatch(fetchDraftWorkflows()),
    ])
  }, [dispatch])

  return (
    <React.Fragment>
      <main>
        <Stack spacing={4} sx={{ mb: 8, minHeight: 'calc(100vh - 35px)' }}>
          <Hero />
          <WfList />
        </Stack>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Home
