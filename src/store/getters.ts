import dayjs from 'dayjs'

import { RootState } from '@/store'
import {
  DraftWorkflow,
  isPublishedWorkflow,
  PublishedWorkflow,
} from '@/store/workflows'
import { Config } from '@/types/ghTrs'

export const extractConfig = (
  wf: PublishedWorkflow | DraftWorkflow
): Config => {
  if (isPublishedWorkflow(wf)) {
    return wf.latest.config
  } else {
    return wf.config
  }
}

export const extractAuthors = (
  wf: PublishedWorkflow | DraftWorkflow
): string[] => {
  if (isPublishedWorkflow(wf)) {
    return (
      wf.latest.toolVersion?.author ||
      wf.latest.config.authors.map((a) => a.github_account)
    )
  } else {
    return wf.config.authors.map((a) => a.github_account)
  }
}

export const allAuthors = (state: RootState): string[] => {
  const authors = new Set<string>()
  Object.values(state.workflows.published).forEach((wf) => {
    extractAuthors(wf).forEach((a) => authors.add(a))
  })
  Object.values(state.workflows.draft).forEach((wf) => {
    extractAuthors(wf).forEach((a) => authors.add(a))
  })
  return Array.from(authors)
}

export const extractWfName = (
  wf: PublishedWorkflow | DraftWorkflow
): string => {
  if (isPublishedWorkflow(wf)) {
    return wf.latest.toolVersion?.name || wf.latest.config.workflow.name
  } else {
    return wf.config.workflow.name
  }
}

export const allWfNames = (state: RootState): string[] => {
  const wfNames = new Set<string>()
  Object.values(state.workflows.published).forEach((wf) => {
    wfNames.add(extractWfName(wf))
  })
  Object.values(state.workflows.draft).forEach((wf) => {
    wfNames.add(extractWfName(wf))
  })
  return Array.from(wfNames)
}

export const extractPublishStatus = (
  wf: PublishedWorkflow | DraftWorkflow
): 'published' | 'draft' => {
  if (isPublishedWorkflow(wf)) {
    return 'published'
  } else {
    return 'draft'
  }
}

export interface PublishStatusCounts {
  published: number
  draft: number
}

export const publishStatusCounts = (state: RootState): PublishStatusCounts => {
  const allIds = new Set([
    ...Object.keys(state.workflows.published),
    ...Object.keys(state.workflows.draft),
  ])
  const allIdsLength = allIds.size
  const publishedLength = Object.keys(state.workflows.published).length
  return {
    published: publishedLength,
    draft: allIdsLength - publishedLength,
  }
}

export type WfType = 'CWL' | 'WDL' | 'NFL' | 'SMK'

export const extractWfType = (
  wf: PublishedWorkflow | DraftWorkflow
): WfType => {
  if (isPublishedWorkflow(wf)) {
    return (
      (wf.latest.toolVersion?.descriptor_type?.[0] as WfType) ||
      wf.latest.config.workflow.language?.type ||
      'CWL'
    )
  } else {
    return wf.config.workflow.language?.type || 'CWL'
  }
}

export interface WfTypeCounts {
  CWL: number
  WDL: number
  NFL: number
  SMK: number
}

export const wfTypeCounts = (state: RootState): WfTypeCounts => {
  const wfTypeCounts = {
    CWL: 0,
    WDL: 0,
    NFL: 0,
    SMK: 0,
  }
  const allIds = new Set([
    ...Object.keys(state.workflows.published),
    ...Object.keys(state.workflows.draft),
  ])
  for (const id of allIds) {
    const wf = state.workflows.published[id] || state.workflows.draft[id]
    const type = extractWfType(wf)
    if (type === 'CWL') {
      wfTypeCounts.CWL += 1
    } else if (type === 'WDL') {
      wfTypeCounts.WDL += 1
    } else if (type === 'NFL') {
      wfTypeCounts.NFL += 1
    } else if (type === 'SMK') {
      wfTypeCounts.SMK += 1
    }
  }
  return wfTypeCounts
}

export const extractVersion = (
  wf: PublishedWorkflow | DraftWorkflow
): string => {
  if (isPublishedWorkflow(wf)) {
    return wf.latest.version
  } else {
    return wf.version
  }
}

export const extractDate = (wf: PublishedWorkflow | DraftWorkflow): string => {
  if (isPublishedWorkflow(wf)) {
    return wf.latest.modifiedDate
  } else {
    return wf.createdDate
  }
}

export const isVerified = (wf: PublishedWorkflow | DraftWorkflow): boolean => {
  if (isPublishedWorkflow(wf)) {
    return wf.latest.toolVersion.verified || false
  } else {
    return false
  }
}

export const isPublished = (wf: PublishedWorkflow | DraftWorkflow): boolean => {
  if (isPublishedWorkflow(wf)) {
    return true
  } else {
    return false
  }
}

export const compareWfName = (
  a: PublishedWorkflow | DraftWorkflow,
  b: PublishedWorkflow | DraftWorkflow
): number => {
  return extractWfName(a).localeCompare(extractWfName(b))
}

export const compareDate = (
  a: PublishedWorkflow | DraftWorkflow,
  b: PublishedWorkflow | DraftWorkflow
): number => {
  const aDate = dayjs(extractDate(a))
  const bDate = dayjs(extractDate(b))
  if (aDate.isBefore(bDate)) {
    return -1
  } else if (aDate.isAfter(bDate)) {
    return 1
  } else {
    return 0
  }
}

export const filteredWfs = (
  state: RootState
): (PublishedWorkflow | DraftWorkflow)[] => {
  const { wfName, authors, publishStatus, wfType, sortBy } = state.filter
  const { published, draft } = state.workflows
  const wfs: (PublishedWorkflow | DraftWorkflow)[] = []
  const allIds = new Set([...Object.keys(published), ...Object.keys(draft)])
  console.log(wfName)
  for (const id of allIds) {
    const wf = state.workflows.published[id] || state.workflows.draft[id]
    if (
      wfName.length &&
      !extractWfName(wf).toLowerCase().includes(wfName.toLowerCase())
    ) {
      continue
    }
    if (
      authors.length &&
      !extractAuthors(wf).some((a) => authors.includes(a))
    ) {
      continue
    }
    if (!publishStatus.includes(extractPublishStatus(wf))) {
      continue
    }
    if (extractWfType(wf) && !wfType.includes(extractWfType(wf))) {
      continue
    }
    wfs.push(wf)
  }

  wfs.sort((a, b) => {
    if (sortBy === 'name') {
      return compareWfName(a, b)
    } else if (sortBy === 'date') {
      return compareDate(a, b)
    }
    return 0
  })

  return wfs
}

export const dateToTimeSince = (date: string) => {
  const prev = dayjs(date)
  const now = dayjs()
  const seconds = now.diff(prev, 'seconds')
  const daySeconds = 60 * 60 * 24
  if (seconds < daySeconds) {
    return 'today'
  } else if (seconds < daySeconds * 2) {
    return 'yesterday'
  } else if (seconds < daySeconds * 7) {
    const dayDiff = now.diff(prev, 'day')
    return `${dayDiff} days ago`
  } else if (seconds < daySeconds * 30) {
    const weekDiff = now.diff(prev, 'week')
    return `${weekDiff} weeks ago`
  } else if (seconds < daySeconds * 365) {
    const monthDiff = now.diff(prev, 'month')
    return `${monthDiff} months ago`
  } else {
    const yearDiff = now.diff(prev, 'year')
    return `${yearDiff} years ago`
  }
}

export const generateAgoStr = (wf: PublishedWorkflow | DraftWorkflow) => {
  const date = extractDate(wf)
  const timeSince = dateToTimeSince(date)
  return `${isPublished(wf) ? 'Published' : 'Created'} ${timeSince}`
}
