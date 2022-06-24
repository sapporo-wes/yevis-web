import { Box } from '@mui/material'
import React from 'react'

import FileDialog from '@/components/detail/FileDialog'
import FileTree from '@/components/detail/FileTree'
import ErrorMsg from '@/components/ErrorMsg'
import LoadingMsg from '@/components/LoadingMsg'
import { useAppSelector } from '@/store'
import {
  FileItem,
  extractItems,
  findFileItem,
  contentLoading,
  contentError,
  contentDisplay,
} from '@/store/workflowGetters'

interface Props {
  id: string
  sx?: object
  version: string
}

const Files: React.VFC<Props> = (props: Props) => {
  const configFiles = useAppSelector(
    (state) =>
      state.workflow[props.id]?.versions[props.version]?.wf?.config?.workflow
        ?.files
  )
  const contents = useAppSelector(
    (state) => state.workflow[props.id]?.versions[props.version]?.contents
  )
  if (typeof configFiles === 'undefined' || typeof contents === 'undefined') {
    return null
  }
  const loading = contents.loading
  const error = contents.error

  const items = extractItems(configFiles, '')
  const [selectedItem, setSelectedItem] = React.useState<FileItem | ''>('')
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
  const treeNodeSelectHandler = React.useCallback((nodeId: string) => {
    const item = findFileItem(items, nodeId)
    if (item !== '' && item.itemType === 'file') {
      setSelectedItem(item)
      setDialogOpen(true)
    }
  }, [])

  return (
    <Box
      sx={{
        ...props.sx,
      }}>
      {loading ? (
        <LoadingMsg content='Loading files content...' />
      ) : error !== null ? (
        <ErrorMsg error={error} />
      ) : (
        <React.Fragment>
          <FileTree
            items={items}
            selectHandler={treeNodeSelectHandler}
            selectedItem={selectedItem}
          />
          {selectedItem !== '' && selectedItem.itemType === 'file' && (
            <FileDialog
              buttonDisabled={
                contentLoading(contents, selectedItem.id) ||
                contentError(contents, selectedItem.id) !== null
              }
              content={contentDisplay(contents, selectedItem.id)}
              dialogOpen={dialogOpen}
              openHandler={setDialogOpen}
              target={selectedItem.id}
              url={selectedItem.url || ''}
            />
          )}
        </React.Fragment>
      )}
    </Box>
  )
}

export default React.memo(Files)
