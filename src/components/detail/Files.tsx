import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { TreeView, TreeItem, treeItemClasses } from '@mui/lab'
import { Chip, Box, Theme } from '@mui/material'
import React from 'react'

import FileContent from '@/components/detail/FileContent'
import { WfVersion } from '@/store/workflow'
import {
  FileItem,
  extractItems,
  primaryWfTarget,
  findFileItem,
  contentDisplay,
  contentLoading,
  contentError,
} from '@/store/workflowGetters'

interface TreeItemsProps {
  items: FileItem[]
}

const TreeItems: React.VFC<TreeItemsProps> = (props: TreeItemsProps) => {
  return (
    <React.Fragment>
      {props.items.map((item) => {
        return (
          <TreeItem
            children={
              item.children ? <TreeItems items={item.children} /> : null
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
                {item.type === 'primary' ? (
                  <Chip
                    color='primary'
                    label='Primary Workflow'
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
            sx={(theme: Theme) => ({
              my: 0.5,
              [`.${treeItemClasses.content}`]: {
                '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
                  bgcolor:
                    item.itemType === 'file'
                      ? theme.palette.secondary.light
                      : null,
                  [`.${treeItemClasses.label}`]: {
                    fontWeight: 600,
                  },
                },
                borderRadius: theme.spacing(0.5),
              },
            })}
          />
        )
      })}
    </React.Fragment>
  )
}

interface Props {
  sx?: object
  wfVersion: WfVersion
}

const Files: React.VFC<Props> = (props: Props) => {
  const items = React.useMemo(
    () => extractItems(props.wfVersion.wf?.config?.workflow?.files || [], ''),
    [props.wfVersion.wf]
  )
  const [selectedItem, setSelectedItem] = React.useState<FileItem | ''>('') // empty string is used for TreeView
  React.useEffect(() => {
    const primaryWf = findFileItem(
      items,
      primaryWfTarget(props.wfVersion.wf?.config?.workflow?.files || [])
    )
    setSelectedItem(primaryWf)
  }, [items])

  return (
    <Box
      sx={{
        ...props.sx,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box
        sx={(theme: Theme) => ({
          border: '1px solid',
          borderColor: theme.palette.grey[500],
          borderRadius: theme.spacing(0.5),
          p: 2,
        })}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
          defaultExpandIcon={<ChevronRightIcon sx={{ fontSize: 20 }} />}
          onNodeSelect={(_event: React.SyntheticEvent, nodeId: string) => {
            const item = findFileItem(items, nodeId)
            if (item !== '' && item.itemType === 'file') {
              setSelectedItem(item)
            }
          }}
          selected={selectedItem === '' ? '' : selectedItem.id}
          sx={{
            '.MuiTreeItem-iconContainer svg': {
              color: 'primary.main',
              fontSize: 24,
            },
          }}>
          <TreeItems items={items} />
        </TreeView>
      </Box>
      {selectedItem !== '' && selectedItem.itemType === 'file' && (
        <FileContent
          buttonDisabled={
            contentLoading(props.wfVersion.contents, selectedItem.id) ||
            contentError(props.wfVersion.contents, selectedItem.id) !== null
          }
          content={contentDisplay(props.wfVersion.contents, selectedItem.id)}
          sx={{ mt: 3 }}
          target={selectedItem.id}
          url={selectedItem.url || ''}
        />
      )}
    </Box>
  )
}

export default Files
