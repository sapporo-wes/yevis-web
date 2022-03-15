import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Button, Box } from '@mui/material'
import React from 'react'
import { Prism } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { detectPrismType } from '@/utils/codeType'

interface DownloadButtonProps {
  disabled: boolean
  fileName: string
  url: string
}

const DownloadButton: React.VFC<DownloadButtonProps> = (
  props: DownloadButtonProps
) => {
  return (
    <Button
      children={'Download'}
      color='secondary'
      disabled={props.url === '' || props.disabled}
      onClick={() => {
        const link = document.createElement('a')
        link.href = props.url
        link.download = props.fileName
        document.body.appendChild(link)
        link.click()
        link.remove()
      }}
      startIcon={<FileDownloadOutlinedIcon />}
      sx={{
        textTransform: 'none',
        width: '120px',
      }}
      variant='outlined'
    />
  )
}

interface CopyButtonProps {
  content: string
  disabled: boolean
}

const CopyButton: React.VFC<CopyButtonProps> = (props: CopyButtonProps) => {
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
        width: '120px',
      }}
      variant='outlined'
    />
  )
}

interface Props {
  buttonDisabled: boolean
  content: string
  sx?: object
  target: string
  url: string
}

const FileContent: React.VFC<Props> = (props: Props) => {
  return (
    <Box
      sx={{
        ...props.sx,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box
        sx={{
          columnGap: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          mb: () => (!props.buttonDisabled ? -5.5 : -1),
          mr: 2,
        }}>
        {!props.buttonDisabled && (
          <React.Fragment>
            <DownloadButton
              disabled={props.buttonDisabled}
              fileName={
                props.target.split('/').pop() || 'yevis-web-download-file'
              }
              url={props.url}
            />
            <CopyButton
              content={props.content}
              disabled={props.buttonDisabled}
            />
          </React.Fragment>
        )}
      </Box>
      <Prism
        children={props.content}
        customStyle={{
          '.token': {
            background: '#f5f5f5',
          },
          backgroundColor: '#f5f5f5',
          borderRadius: '0.25rem',
          fontSize: '0.875rem',
          margin: '0',
          padding: '1rem',
        }}
        language={detectPrismType(props.target)}
        style={prism}
      />
    </Box>
  )
}

export default FileContent
