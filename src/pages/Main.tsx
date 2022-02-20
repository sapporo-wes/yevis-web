import Stack from '@mui/material/Stack'
import React from 'react'

import Hero from '@/components/main/Hero'
import WfList from '@/components/main/WfList'

const Main: React.VFC = () => {
  return (
    <Stack spacing={4}>
      <Hero />
      <WfList />
    </Stack>
  )
}

export default Main
