import { Box } from '@mui/material'
import React from 'react'

interface Props {
  doi: string
  sx?: object
}

const DoiBadge: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ ...props.sx, display: 'flex' }}>
      <a
        href={`https://doi.org/${props.doi}`}
        rel='noreferrer'
        style={{ display: 'inline-block' }}
        target='_blank'>
        <img
          alt='DOI'
          src={`https://img.shields.io/badge/DOI-${encodeURIComponent(
            props.doi
          )}-blue.svg`}
          style={{ display: 'block' }}
        />
      </a>
    </Box>
  )
}

export default DoiBadge
