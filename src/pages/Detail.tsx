import { Box, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import ErrorMsg from '@/components/detail/ErrorMsg'
import Hero from '@/components/detail/Hero'
import LoadingMsg from '@/components/detail/LoadingMsg'
import WfContent from '@/components/detail/WfContent'
import Footer from '@/components/Footer'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { fetchWorkflow } from '@/store/workflow'
import { DraftWorkflow, PublishedWorkflow } from '@/store/workflows'

const Detail: React.VFC = () => {
  const { id, version } = useParams<{
    id: string
    version?: string
  }>()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchWorkflow({ id, version }))
  }, [dispatch])
  const { wf, loading, error } = useAppSelector(
    (state: RootState) => state.workflow
  )

  return (
    <React.Fragment>
      <main>
        <Box sx={{ minHeight: 'calc(100vh - 35px)', pb: 4 }}>
          {loading ? (
            <LoadingMsg />
          ) : error ? (
            <ErrorMsg error={error} />
          ) : (
            <Stack spacing={4}>
              <Hero wf={wf as PublishedWorkflow | DraftWorkflow} />
              <WfContent wf={wf as PublishedWorkflow | DraftWorkflow} />
            </Stack>
          )}
        </Box>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Detail
