import { Box, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Hero from '@/components/detail/Hero'
import LoadingMsg from '@/components/detail/LoadingMsg'
import WfContent from '@/components/detail/WfContent'
import ErrorHero from '@/components/ErrorHero'
import Footer from '@/components/Footer'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { initializeWf, fetchWf, fetchContents } from '@/store/workflow'
import { topLoading, topError } from '@/store/workflowGetters'

const Detail: React.VFC = () => {
  const { id, version } = useParams<{
    id: string
    version: string
  }>() as { id: string; version: string } // validated by router
  const dispatch = useAppDispatch()
  useEffect(() => {
    ;(async () => {
      await dispatch(initializeWf({ id }))
      await dispatch(fetchWf({ id, version }))
      await dispatch(fetchContents({ id, version }))
    })()
  }, [dispatch])
  const wfState = useAppSelector((state: RootState) => state.workflow)
  const loading = topLoading(wfState, id, version)
  const error = topError(wfState, id, version)
  const wf = wfState[id]?.versions[version]?.wf
  const versions = wfState[id]?.versionStatus
  const wfVersion = wfState[id]?.versions[version]

  return (
    <React.Fragment>
      <main>
        <Box sx={{ minHeight: 'calc(100vh - 35px)', pb: 4 }}>
          {loading ? (
            <LoadingMsg />
          ) : error ? (
            <ErrorHero
              description={`An unexpected error occurred while loading workflow: ${error}`}
              title='Error Occurred'
            />
          ) : (
            <Stack spacing={4}>
              {wf && <Hero wf={wf} />}
              {versions && wfVersion && (
                <WfContent versions={versions} wfVersion={wfVersion} />
              )}
            </Stack>
          )}
        </Box>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Detail
