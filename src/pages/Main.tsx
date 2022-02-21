import { Stack } from '@mui/material'
import React, { useEffect } from 'react'

import Hero from '@/components/main/Hero'
import WfList from '@/components/main/WfList'
import { useAppDispatch } from '@/store'
import { fetchWorkflows } from '@/store/workflows'

const Main: React.VFC = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    ;(async () => dispatch(fetchWorkflows()))()
  }, [dispatch])

  return (
    <Stack spacing={4}>
      <Hero />
      <WfList />
    </Stack>
  )
}

export default Main
