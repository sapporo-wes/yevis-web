import GitHubIcon from '@mui/icons-material/GitHub'
import { Chip } from '@mui/material'
import React from 'react'

interface Props {
  author: string
  sx?: object
}

const AuthorChip: React.VFC<Props> = (props: Props) => {
  return (
    <Chip
      clickable
      color='primary'
      component='a'
      href={`https://github.com/${props.author}`}
      icon={<GitHubIcon />}
      label={`@${props.author}`}
      size='small'
      sx={{ ...props.sx }}
      variant='outlined'
    />
  )
}

export default React.memo(AuthorChip)
