import { Box, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'

import Footer from '@/components/Footer'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { fetchWorkflow } from '@/store/workflow'

const LoadingMessage: React.VFC = () => {
  return (
    <Box sx={{ maxWidth: '100vw' }}>
      <Box sx={{ maxWidth: 'lg', minWidth: 'lg', mx: 'auto', px: 8, pt: 8 }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            color: 'primary.main',
          }}>
          Loading workflow...
        </Typography>
      </Box>
    </Box>
  )
}

const ErrorMessage: React.VFC<{ error: string }> = (props: {
  error: string
}) => {
  return (
    <Box sx={{ maxWidth: '100vw' }}>
      <Stack
        spacing={2}
        sx={{ maxWidth: 'lg', minWidth: 'lg', mx: 'auto', px: 8, pt: 8 }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            color: 'primary.main',
          }}>
          An unexpected error occurred while loading workflow: {props.error}
        </Typography>
        <RouterLink to='/'>
          <Typography
            sx={{
              fontSize: '1.2rem',
              color: 'primary.main',
            }}>
            Back to home
          </Typography>
        </RouterLink>
      </Stack>
    </Box>
  )
}

const Workflow: React.VFC = () => {
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
        <Stack spacing={4} sx={{ minHeight: 'calc(100vh - 35px)', mb: 4 }}>
          {loading ? (
            <LoadingMessage />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <div>{JSON.stringify(wf)}</div>
          )}
        </Stack>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Workflow
