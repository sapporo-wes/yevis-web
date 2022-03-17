import { Box } from '@mui/material'
import React from 'react'

interface Props {
  sx?: object
}

const LoadingMsg: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ maxWidth: '100vw', ...props.sx }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', pt: 4, px: 4 }}>
        <Box
          children='Loading workflow...'
          sx={{
            fontSize: '1.2rem',
          }}
        />
      </Box>
    </Box>
  )
}

export default React.memo(LoadingMsg)
