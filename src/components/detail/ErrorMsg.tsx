import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

interface Props {
  error: string
  sx?: object
}

const ErrorMsg: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ maxWidth: '100vw', ...props.sx }}>
      <Stack
        spacing={2}
        sx={{ maxWidth: 'lg', minWidth: 'lg', mx: 'auto', pt: 4, px: 4 }}>
        <Typography
          sx={{
            color: 'primary.main',
            fontSize: '1.2rem',
          }}>
          An unexpected error occurred while loading workflow: {props.error}
        </Typography>
        <RouterLink to='/'>
          <Typography
            sx={{
              color: 'primary.main',
              fontSize: '1.2rem',
            }}>
            Back to home
          </Typography>
        </RouterLink>
      </Stack>
    </Box>
  )
}

export default ErrorMsg
