import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined'
import { Button } from '@mui/material'
import React from 'react'

interface Props {
  content: string
  disabled: boolean
  sx?: object
}

const CopyButton: React.VFC<Props> = (props: Props) => {
  const [copyText, setCopyText] = React.useState<string>('Copy')
  return (
    <Button
      children={copyText}
      color='secondary'
      disabled={props.disabled}
      onClick={() => {
        navigator.clipboard.writeText(props.content)
        setCopyText('Copied!!')
        setTimeout(() => {
          setCopyText('Copy')
        }, 2000)
      }}
      startIcon={<ContentPasteOutlinedIcon />}
      sx={{
        textTransform: 'none',
        ...props.sx,
      }}
      variant='outlined'
    />
  )
}

export default React.memo(CopyButton)
