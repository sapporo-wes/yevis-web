import { Box, Stack } from '@mui/material'
import React from 'react'

import TestFiles from '@/components/detail/TestFiles'
import TestResultList from '@/components/detail/TestResultList'
import ErrorMsg from '@/components/ErrorMsg'
import LoadingMsg from '@/components/LoadingMsg'
import { useAppSelector } from '@/store'

interface Props {
  id: string
  sx?: object
  version: string
}

const TabTests: React.VFC<Props> = (props: Props) => {
  const tests = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]?.tests
  )
  const configTesting = useAppSelector(
    (state) =>
      state.workflow[props.id]?.versions[props.version]?.wf?.config?.workflow
        ?.testing
  )
  const contents = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]?.contents
  )
  if (
    typeof tests === 'undefined' ||
    typeof configTesting === 'undefined' ||
    typeof contents === 'undefined'
  ) {
    return null
  }
  const loading = contents.loading || tests.loading
  const error = contents.error || tests.error

  return (
    <Box
      sx={{
        ...props.sx,
      }}>
      {loading ? (
        <LoadingMsg content='Loading tests content...' />
      ) : error !== null ? (
        <ErrorMsg error={error} />
      ) : (
        <Stack spacing={2}>
          <TestResultList results={tests.results} />
          <TestFiles contents={contents} testing={configTesting} />
        </Stack>
      )}
    </Box>
  )
}

export default React.memo(TabTests)
