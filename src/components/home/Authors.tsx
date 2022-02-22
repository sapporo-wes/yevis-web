import { Box, Typography } from '@mui/material'
import React from 'react'

import AuthorChip from '@/components/home/AuthorChip'

interface Props {
  authors: string[]
}

const Authors: React.VFC<Props> = (props: Props) => {
  return props.authors.length ? (
    <Box sx={{ display: 'flex', flexDirection: 'raw' }}>
      <Box>
        <Typography
          sx={{ fontWeight: 'light', fontSize: '0.8rem', pt: '0.1rem', pr: 1 }}>
          By:
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          rowGap: 0.5,
          columnGap: 1,
        }}>
        {props.authors.map((author) => (
          <AuthorChip author={author} key={author} />
        ))}
      </Box>
    </Box>
  ) : null
}

export default Authors
