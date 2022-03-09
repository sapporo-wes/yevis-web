import dayjs from 'dayjs'

import { RootState } from '@/store'
import {
  DraftWorkflow,
  isPublishedWorkflow,
  PublishedWorkflow,
} from '@/store/workflows'

export const extractAuthors = (
  wf: PublishedWorkflow | DraftWorkflow
): string[] => {
  return wf.config.authors.map((a) => a.github_account)
}

export const allAuthors = (wfs: RootState['workflows']['wfs']): string[] => {
  return Array.from(
    new Set(Object.values(wfs).flatMap((wf) => extractAuthors(wf)))
  )
}

export const allWfNames = (wfs: RootState['workflows']['wfs']): string[] => {
  return Array.from(
    new Set(Object.values(wfs).flatMap((wf) => wf.config.workflow.name))
  )
}

export interface PublishStatusCounts {
  draft: number
  published: number
}

export const publishStatusCounts = (
  wfs: RootState['workflows']['wfs']
): PublishStatusCounts => {
  const publishedLength = Object.values(wfs).filter((wf) =>
    isPublishedWorkflow(wf)
  ).length
  return {
    draft: Object.keys(wfs).length - publishedLength,
    published: publishedLength,
  }
}

export type WfType = 'CWL' | 'WDL' | 'NFL' | 'SMK'

export const extractWfType = (
  wf: PublishedWorkflow | DraftWorkflow
): WfType => {
  return wf.config.workflow.language?.type || 'CWL'
}

export interface WfTypeCounts {
  CWL: number
  NFL: number
  SMK: number
  WDL: number
}

export const wfTypeCounts = (
  wfs: RootState['workflows']['wfs']
): WfTypeCounts => {
  const wfTypeCounts = {
    CWL: 0,
    NFL: 0,
    SMK: 0,
    WDL: 0,
  }
  Object.values(wfs).forEach((wf) => {
    wfTypeCounts[extractWfType(wf)] += 1
  })
  return wfTypeCounts
}

export const isVerified = (wf: PublishedWorkflow | DraftWorkflow): boolean => {
  if (isPublishedWorkflow(wf)) {
    return wf.toolVersion.verified || false
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
  const aWfName = a.config.workflow.name
  const bWfName = b.config.workflow.name
  return aWfName.localeCompare(bWfName)
}

export const compareDate = (
  a: PublishedWorkflow | DraftWorkflow,
  b: PublishedWorkflow | DraftWorkflow
): number => {
  const aDate = dayjs(a.date)
  const bDate = dayjs(b.date)
  if (aDate.isBefore(bDate)) {
    return 1
  } else if (aDate.isAfter(bDate)) {
    return -1
  } else {
    return 0
  }
}

export const filteredWfs = (
  wfs: RootState['workflows']['wfs'],
  filter: RootState['filter']
): (PublishedWorkflow | DraftWorkflow)[] => {
  const { wfName, authors, publishStatus, wfType, sortBy } = filter

  const filteredWfs = Object.values(wfs).filter((wf) => {
    if (
      wfName.length &&
      !wf.config.workflow.name.toLowerCase().includes(wfName.toLowerCase())
    ) {
      return false
    }
    if (
      authors.length &&
      !extractAuthors(wf).some((a) => authors.includes(a))
    ) {
      return false
    }
    if (!publishStatus.includes(isPublished(wf) ? 'published' : 'draft')) {
      return false
    }
    if (extractWfType(wf) && !wfType.includes(extractWfType(wf))) {
      return false
    }
    return true
  })

  filteredWfs.sort((a, b) => {
    if (sortBy === 'name') {
      return compareWfName(a, b)
    } else if (sortBy === 'date') {
      return compareDate(a, b)
    }
    return 0
  })

  return filteredWfs
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
  const timeSince = dateToTimeSince(wf.date)
  return `${isPublished(wf) ? 'Published' : 'Created'} ${timeSince}`
}
