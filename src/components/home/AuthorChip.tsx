import GitHubIcon from '@mui/icons-material/GitHub'
import { Chip } from '@mui/material'
import React from 'react'

interface Props {
  author: string
}

const AuthorChip: React.VFC<Props> = (props: Props) => {
  return (
    <Chip
      icon={<GitHubIcon />}
      label={`@${props.author}`}
      color='primary'
      size='small'
      component='a'
      href={`https://github.com/${props.author}`}
      clickable
      variant='outlined'
    />
  )
}

export default AuthorChip
