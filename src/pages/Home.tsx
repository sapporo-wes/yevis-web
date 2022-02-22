import { Stack } from '@mui/material'
import React, { useEffect } from 'react'

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
    <Stack spacing={4}>
      <Hero />
      <WfList />
    </Stack>
  )
}

export default Home
