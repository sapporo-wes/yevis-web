import { Box, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import ErrorMsg from '@/components/detail/ErrorMsg'
import Hero from '@/components/detail/Hero'
import LoadingMsg from '@/components/detail/LoadingMsg'
import WfContent from '@/components/detail/WfContent'
import Footer from '@/components/Footer'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import {
  initializeWf,
  fetchWf,
  fetchContents,
  WfVersions,
  WfVersion,
  resolveVersion,
} from '@/store/workflow'

const Detail: React.VFC = () => {
  const { id, version } = useParams<{
    id: string
    version?: string
  }>() as { id: string; version?: string }
  const dispatch = useAppDispatch()
  useEffect(() => {
    ;(async () => {
      await dispatch(initializeWf({ id }))
      await dispatch(fetchWf({ id, version }))
      await dispatch(fetchContents({ id, version }))
    })()
  }, [dispatch])
  const state = useAppSelector((state: RootState) => state.workflow)
  const loading = state[id]?.loading ?? false
  const error = state[id]?.error ?? false
  const wfVersions: WfVersions = state[id]?.versions ?? {}
  const latestVersion = resolveVersion(wfVersions, version)[0]
  const wfVersion: WfVersion = wfVersions[latestVersion] ?? {}

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
              <Hero wfVersion={wfVersion} />
              <WfContent wfVersion={wfVersion} wfVersions={wfVersions} />
            </Stack>
          )}
        </Box>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Detail
