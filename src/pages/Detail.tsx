import { Box, Stack } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'

import Contents from '@/components/detail/Contents'
import Hero from '@/components/detail/Hero'
import ErrorHero from '@/components/ErrorHero'
import Footer from '@/components/Footer'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  initializeWf,
  fetchWf,
  fetchContents,
  fetchTests,
} from '@/store/workflow'
import { topLoading, topError } from '@/store/workflowGetters'

const Detail: React.VFC = () => {
  const { id, version } = useParams<{
    id: string
    version: string
  }>() as { id: string; version: string } // validated by router

  const dispatch = useAppDispatch()
  React.useEffect(() => {
    ;(async () => {
      await dispatch(initializeWf({ id }))
      await dispatch(fetchWf({ id, version }))
      await Promise.allSettled([
        dispatch(fetchContents({ id, version })),
        dispatch(fetchTests({ id, version })),
      ])
    })()
  }, [dispatch])

  const wfState = useAppSelector((state) => state.workflow)
  const loading = topLoading(wfState, id, version)
  const error = topError(wfState, id, version)

  return (
    <React.Fragment>
      <main>
        <Box sx={{ minHeight: 'calc(100vh - 35px)', pb: 4 }}>
          <Stack spacing={4}>
            {loading ? (
              <ErrorHero
                description='Please wait while we load the workflow.'
                title='Loading...'
              />
            ) : error ? (
              <ErrorHero
                description={`An unexpected error occurred while loading workflow: ${error}`}
                title='Error Occurred'
              />
            ) : (
              <Hero id={id} version={version} />
            )}
            <Contents id={id} version={version} />
          </Stack>
        </Box>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Detail
