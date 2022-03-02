import { Box } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

const Footer: React.VFC = () => {
  return (
    <Box component='footer' sx={{ height: '35px', pb: 2, textAlign: 'center' }}>
      <Box
        // align='center'
        children={`© ${dayjs().format(
          'YYYY'
        )} - ${__APP_NAME__} ${__APP_VERSION__}`}
        component='span'
        sx={{
          fontFamily: 'Quicksand',
          fontSize: '0.8rem',
          fontWeight: 'light',
        }}
      />
    </Box>
  )
}

export default Footer
