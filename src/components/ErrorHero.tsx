import { Box, Stack } from '@mui/material'
import React from 'react'

import BackToHome from '@/components/BackToHome'

interface Props {
  description: string
  sx?: object
  title: string
}

const ErrorHero: React.VFC<Props> = (props: Props) => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        maxWidth: '100vw',
        ...props.sx,
      }}>
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          p: 4,
        }}>
        <Stack spacing={2}>
          <BackToHome />
          <Box
            children={props.title}
            component='h1'
            sx={{
              color: 'common.white',
              fontFamily: 'Quicksand',
              fontSize: '3.6rem',
              fontWeight: 'bold',
              my: 0,
            }}
          />
          <Box
            children={props.description}
            component='p'
            sx={{
              fontFamily: 'Quicksand',
              fontSize: '1.2rem',
              my: 0,
            }}
          />
        </Stack>
      </Box>
    </Box>
  )
}

export default React.memo(ErrorHero)
