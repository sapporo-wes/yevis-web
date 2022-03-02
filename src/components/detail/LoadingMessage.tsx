import { Box, Typography } from '@mui/material'
import React from 'react'

interface Props {
  sx?: object
}

const LoadingMessage: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ maxWidth: '100vw', ...props.sx }}>
      <Box sx={{ maxWidth: 'lg', minWidth: 'lg', mx: 'auto', px: 4, pt: 4 }}>
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

export default LoadingMessage
