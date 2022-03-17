import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Button } from '@mui/material'
import React from 'react'

interface Props {
  disabled: boolean
  sx?: object
  target: string
  url: string
}

const DownloadButton: React.VFC<Props> = (props: Props) => {
  const fileName = props.target.split('/').pop() || 'yevis-web-download-file'
  return (
    <Button
      children={'Download'}
      color='secondary'
      disabled={props.url === '' || props.disabled}
      onClick={() => {
        const link = document.createElement('a')
        link.href = props.url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        link.remove()
      }}
      startIcon={<FileDownloadOutlinedIcon />}
      sx={{
        textTransform: 'none',
        ...props.sx,
      }}
      variant='outlined'
    />
  )
}

export default React.memo(DownloadButton)
