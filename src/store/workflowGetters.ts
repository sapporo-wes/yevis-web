import { WorkflowState, WfVersion } from '@/store/workflow'
import { File } from '@/types/ghTrs'

export const topLoading = (
  state: WorkflowState,
  id: string,
  version: string
): boolean => {
  const initializeLoading = state[id]?.loading
  const wfLoading = state[id]?.versions[version]?.loading
  return initializeLoading || wfLoading
}

export const topError = (
  state: WorkflowState,
  id: string,
  version: string
): string | null => {
  const initializeError = state[id]?.error
  const wfError = state[id]?.versions[version]?.error
  return initializeError || wfError
}

export const contentLoading = (
  contents: WfVersion['contents'],
  target: string
): boolean => {
  const parentLoading = contents.loading
  const fileLoading = typeof contents.files[target]?.content === 'undefined'
  return parentLoading || fileLoading
}

export const contentError = (
  contents: WfVersion['contents'],
  target: string
): string | null => {
  const parentError = contents.error
  const fileError = contents.files[target]?.error
  return parentError || fileError
}

export const content = (
  contents: WfVersion['contents'],
  target: string
): string => {
  return contents.files[target]?.content ?? ''
}

export const contentDisplay = (
  contents: WfVersion['contents'],
  target: string
): string => {
  return contentLoading(contents, target)
    ? `Loading ${target}...`
    : contentError(contents, target) ?? content(contents, target)
}

export interface FileItem {
  children?: FileItem[]
  id: string
  itemType: 'file' | 'dir'
  label: string
  type?: 'primary' | 'secondary'
  url?: string
}

export const extractItems = (files: File[], parent: string): FileItem[] => {
  const items: FileItem[] = []
  const dirs: Record<string, File[]> = {}
  files.forEach((file) => {
    const parts = (file.target || '').split('/')
    if (parts.length > 1) {
      // dir
      if (!(parts[0] in dirs)) {
        dirs[parts[0]] = []
      }
      dirs[parts[0]].push({
        target: parts.slice(1).join('/'),
        type: file.type,
        url: file.url,
      })
    } else {
      // file
      items.push({
        id: `${parent}/${file.target || ''}`.replace(/^\/+|\/$/g, ''),
        itemType: 'file',
        label: file.target || '',
        type: file.type,
        url: file.url,
      })
    }
  })
  Object.keys(dirs).forEach((dir) => {
    items.push({
      children: extractItems(
        dirs[dir],
        `${parent}/${dir}`.replace(/^\/+|\/$/g, '')
      ),
      id: `${parent}/${dir}`.replace(/^\/+|\/$/g, ''),
      itemType: 'dir',
      label: dir,
    })
  })
  return items
}

export const primaryWfTarget = (files: File[]): string => {
  const primary = files.find((file) => file.type === 'primary')
  return primary?.target || ''
}

export const findFileItem = (
  files: FileItem[],
  target: string
): FileItem | '' => {
  const file = files.find((file) => file.id === target)
  if (typeof file !== 'undefined') {
    return file
  } else {
    const children = files.flatMap((file) => file.children ?? [])
    if (children.length > 0) {
      return findFileItem(children, target)
    }
    return ''
  }
}
