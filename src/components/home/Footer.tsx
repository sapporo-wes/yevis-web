import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

const Footer: React.VFC = () => {
  return (
    <Box component='footer' sx={{ pb: 2 }}>
      <Typography
        align='center'
        sx={{
          fontWeight: 'light',
          fontSize: '0.8rem',
          color: 'primary.main',
          fontFamily: 'Quicksand',
        }}>
        © {dayjs().format('YYYY')} - {__APP_NAME__}: {__APP_VERSION__}
      </Typography>
    </Box>
  )
}

export default Footer
