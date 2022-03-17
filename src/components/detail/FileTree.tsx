import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { TreeView } from '@mui/lab'
import { Theme, Box } from '@mui/material'
import React from 'react'

import FileTreeItems from '@/components/detail/FileTreeItems'
import { FileItem } from '@/store/workflowGetters'

interface Props {
  items: FileItem[]
  selectHandler: (nodeId: string) => void
  selectedItem: FileItem | ''
  sx?: object
}

const FileTree: React.VFC<Props> = (props: Props) => {
  return (
    <Box
      sx={(theme: Theme) => ({
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: theme.spacing(0.5),
        ...props.sx,
        px: 1,
        py: 2,
      })}>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
        defaultExpandIcon={<ChevronRightIcon sx={{ fontSize: 20 }} />}
        onNodeSelect={(_event: React.SyntheticEvent, nodeId: string) =>
          props.selectHandler(nodeId)
        }
        selected={props.selectedItem === '' ? '' : props.selectedItem.id}
        sx={{
          '.MuiTreeItem-iconContainer svg': {
            color: 'primary.main',
            fontSize: 24,
          },
        }}>
        <FileTreeItems items={props.items} />
      </TreeView>
    </Box>
  )
}

export default React.memo(FileTree)
