import { Box, Stack } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

interface Props {
  error: string
  sx?: object
}

const ErrorMsg: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ maxWidth: '100vw', ...props.sx }}>
      <Stack spacing={2} sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
        <Box
          children={`An unexpected error occurred while loading workflow: ${props.error}`}
          sx={{
            fontSize: '1.2rem',
          }}
        />
        <RouterLink to='/'>
          <Box
            children='Back to home'
            sx={{
              fontSize: '1.2rem',
            }}
          />
        </RouterLink>
      </Stack>
    </Box>
  )
}

export default ErrorMsg
