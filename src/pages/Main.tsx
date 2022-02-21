import { Stack } from '@mui/material'
import React, { useEffect } from 'react'

import Hero from '@/components/main/Hero'
import WfList from '@/components/main/WfList'
import { useAppDispatch } from '@/store'
import {
  fetchGhTrsConfigs,
  fetchModifiedDate,
  fetchWorkflows,
} from '@/store/workflows'

const Main: React.VFC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchWorkflows()).then(() => {
      Promise.allSettled([
        dispatch(fetchGhTrsConfigs()),
        dispatch(fetchModifiedDate()),
      ])
    })
  }, [dispatch])

  return (
    <Stack spacing={4}>
      <Hero />
      <WfList />
    </Stack>
  )
}

export default Main
