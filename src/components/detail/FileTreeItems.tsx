import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { TreeItem } from '@mui/lab'
import { Box, Chip } from '@mui/material'
import React from 'react'

import { FileItem } from '@/store/workflowGetters'

interface Props {
  items: FileItem[]
}

const FileTreeItems: React.VFC<Props> = (props: Props) => {
  return (
    <React.Fragment>
      {props.items.map((item) => {
        return (
          <TreeItem
            children={
              item.children ? <FileTreeItems items={item.children} /> : null
            }
            key={item.id}
            label={
              <Box sx={{ alignItems: 'center', display: 'flex', my: 0.5 }}>
                {item.itemType === 'file' ? (
                  <InsertDriveFileOutlinedIcon
                    sx={{
                      color: 'primary.main',
                      fontSize: 18,
                    }}
                  />
                ) : (
                  <FolderOutlinedIcon
                    sx={{
                      color: 'primary.main',
                      fontSize: 18,
                    }}
                  />
                )}
                <Box children={item.label} sx={{ ml: 2 }} />
                {typeof item.type !== 'undefined' &&
                ['primary', 'wf_params', 'wf_engine_params'].includes(
                  item.type
                ) ? (
                  <Chip
                    color='primary'
                    label={
                      item.type === 'primary'
                        ? 'Primary Workflow'
                        : item.type === 'wf_params'
                        ? 'Workflow Parameters'
                        : 'Workflow Engine Parameters'
                    }
                    size='small'
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      ml: 2,
                    }}
                  />
                ) : null}
              </Box>
            }
            nodeId={item.id}
          />
        )
      })}
    </React.Fragment>
  )
}

export default React.memo(FileTreeItems)
