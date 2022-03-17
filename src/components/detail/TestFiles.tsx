import { Select, Box, MenuItem, FormControl, InputLabel } from '@mui/material'
import React from 'react'

import FileDialog from '@/components/detail/FileDialog'
import FileTree from '@/components/detail/FileTree'
import { WfVersion } from '@/store/workflow'
import {
  extractItems,
  FileItem,
  findFileItem,
  contentLoading,
  contentError,
  contentDisplay,
} from '@/store/workflowGetters'
import { Testing } from '@/types/ghTrs'

interface Props {
  contents: WfVersion['contents']
  sx?: object
  testing: Testing[]
}

const TestFiles: React.VFC<Props> = (props: Props) => {
  const testIds = props.testing.map((test) => test.id)
  const [testId, setTestId] = React.useState(testIds[0])
  const [items, setItems] = React.useState<FileItem[]>(
    extractItems(props.testing[0].files, '')
  )
  const [selectedItem, setSelectedItem] = React.useState<FileItem | ''>('')
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)

  const selectTestIdHandler = React.useCallback((testId: string) => {
    setTestId(testId)
    setItems(
      extractItems(
        props.testing.find((test) => test.id === testId)?.files || [],
        ''
      )
    )
    setSelectedItem('')
  }, [])
  const treeNodeSelectHandler = React.useCallback((nodeId: string) => {
    const item = findFileItem(items, nodeId)
    if (item !== '' && item.itemType === 'file') {
      setSelectedItem(item)
      setDialogOpen(true)
    }
  }, [])

  return (
    <React.Fragment>
      <Box
        sx={{
          ...props.sx,
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}>
        <FormControl sx={{ width: '120px' }} variant='standard'>
          <InputLabel children='Test Id' />
          <Select
            color='secondary'
            label='Test ID'
            onChange={(event) => selectTestIdHandler(event.target.value)}
            value={testId}
            variant='standard'>
            {testIds.map((id) => (
              <MenuItem children={id} key={id} value={id} />
            ))}
          </Select>
        </FormControl>
        <FileTree
          items={items}
          selectHandler={treeNodeSelectHandler}
          selectedItem={selectedItem}
        />
      </Box>
      {selectedItem !== '' && selectedItem.itemType === 'file' && (
        <FileDialog
          buttonDisabled={
            contentLoading(props.contents, selectedItem.id) ||
            contentError(props.contents, selectedItem.id) !== null
          }
          content={contentDisplay(props.contents, selectedItem.id)}
          dialogOpen={dialogOpen}
          openHandler={setDialogOpen}
          target={selectedItem.id}
          url={selectedItem.url || ''}
        />
      )}
    </React.Fragment>
  )
}

export default React.memo(TestFiles)
