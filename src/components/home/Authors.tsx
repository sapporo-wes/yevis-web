import { Box } from '@mui/material'
import React from 'react'

import AuthorChip from '@/components/home/AuthorChip'

interface Props {
  authors: string[]
  sx?: object
}

const Authors: React.VFC<Props> = (props: Props) => {
  return props.authors.length ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'raw',
        ...props.sx,
        columnGap: 1,
      }}>
      <Box
        children='By'
        sx={{
          fontSize: '0.8rem',
          fontWeight: 'light',
          pt: '0.1rem',
        }}
      />
      <Box
        sx={{
          columnGap: 1,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          rowGap: 0.5,
        }}>
        {props.authors.map((author) => (
          <AuthorChip author={author} key={author} />
        ))}
      </Box>
    </Box>
  ) : null
}

export default React.memo(Authors)
