import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  IconButton,
} from '@mui/material'
import React from 'react'
import { Prism } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

import CopyButton from '@/components/detail/CopyButton'
import DownloadButton from '@/components/detail/DownloadButton'
import { detectPrismType } from '@/utils/codeType'

interface Props {
  buttonDisabled: boolean
  content: string
  dialogOpen: boolean
  openHandler: React.Dispatch<React.SetStateAction<boolean>>
  sx?: object
  target: string
  url: string
}

const FileDialog: React.VFC<Props> = (props: Props) => {
  const dividerColor = useTheme().palette.divider

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      onClose={() => props.openHandler(false)}
      open={props.dialogOpen}>
      <DialogTitle>
        <Box
          sx={{
            alignItems: 'center',
            columnGap: 2,
            display: 'flex',
            flexDirection: 'row',
          }}>
          <Box
            children={props.target}
            sx={{
              color: 'primary.main',
              flexGrow: 1,
              fontSize: '1.4rem',
              fontWeight: 500,
              my: 0,
              wordBreak: 'break-word',
            }}
          />
          <CopyButton
            content={props.content}
            disabled={props.buttonDisabled}
            sx={{ maxWidth: '140px', minWidth: '140px' }}
          />
          <DownloadButton
            sx={{ maxWidth: '140px', minWidth: '140px' }}
            target={props.target}
            url={props.url}
          />
          <IconButton
            children={<CloseRoundedIcon />}
            component='span'
            onClick={() => props.openHandler(false)}
            sx={{ height: '2.4rem', width: '2.4rem' }}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Prism
          children={props.content}
          customStyle={{
            '.token': {
              background: '#f5f5f5',
            },
            backgroundColor: '#f5f5f5',
            border: `1px solid ${dividerColor}`,
            borderRadius: '0.25rem',
            margin: '0',
          }}
          language={detectPrismType(props.target)}
          showLineNumbers
          style={prism}
        />
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(FileDialog)
