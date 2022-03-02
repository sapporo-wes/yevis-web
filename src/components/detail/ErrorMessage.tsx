import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

interface Props {
  error: string
  sx?: object
}

const ErrorMessage: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ maxWidth: '100vw', ...props.sx }}>
      <Stack
        spacing={2}
        sx={{ maxWidth: 'lg', minWidth: 'lg', mx: 'auto', px: 4, pt: 4 }}>
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

export default ErrorMessage
