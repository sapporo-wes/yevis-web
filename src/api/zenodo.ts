import { FileContent } from '@/store/workflow'
import { Config } from '@/types/ghTrs'

export interface ZenodoFiles {
  contents: {
    key: string
    links: {
      self: string
    }
    mimetype: string
    size: number
  }[]
  size: number
}

const fetchZenodoFile = async (
  zenodoFilesId: string,
  isSandbox: boolean
): Promise<ZenodoFiles> => {
  const response = await fetch(
    `https://${
      isSandbox ? 'sandbox.' : ''
    }zenodo.org/api/files/${zenodoFilesId}`,
    {
      headers: {
        Accept: 'application/json',
      },
      method: 'GET',
    }
  )
  if (!response.ok) {
    throw new Error(
      `Failed to fetch zenodo files: ${response.status} ${response.statusText}`
    )
  }
  return (await response.json()) as ZenodoFiles
}

// params: [zenodoId, isSandbox]
const fetchZenodoFiles = async (
  zenodoFilesIds: [string, boolean][]
): Promise<{ [id: string]: ZenodoFiles }> => {
  const zenodoFiles: { [id: string]: ZenodoFiles } = {}
  const orgIds = Array.from(
    new Set(
      zenodoFilesIds
        .filter(([_id, isSandbox]) => !isSandbox)
        .map(([id, _isSandbox]) => id)
    )
  )
  const sandboxIds = Array.from(
    new Set(
      zenodoFilesIds
        .filter(([_id, isSandbox]) => isSandbox)
        .map(([id, _isSandbox]) => id)
    )
  )

  const results = await Promise.all([
    ...orgIds.map((id) => fetchZenodoFile(id, false)),
    ...sandboxIds.map((id) => fetchZenodoFile(id, true)),
  ])
  results.forEach((result, index) => {
    zenodoFiles[zenodoFilesIds[index][0]] = result
  })
  return zenodoFiles
}

const MIMETYPE_WHITELIST = [
  'application/octet-stream',
  'application/json',
  'text/plain',
  'text/csv',
  'text/tab-separated-values',
]

const isFetchableZenodoFile = (
  content: ZenodoFiles['contents'][number]
): boolean => {
  return MIMETYPE_WHITELIST.includes(content.mimetype) && content.size < 100000
}

const FILETYPE_WHITELIST = [
  'txt',
  'md',
  'yaml',
  'yml',
  'json',
  'csv',
  'tsv',
  'cwl',
  'wdl',
  'nfl',
]

export const isFetchableFileExt = (url: string): boolean => {
  const ext = url.split('.').pop() || ''
  return FILETYPE_WHITELIST.includes(ext)
}

const fetchText = async (url: string): Promise<string> => {
  const res = await fetch(url, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch content from ${url}`)
  }
  return res.text()
}

interface FileContentTarget extends FileContent {
  target: string
}

const ZENODO_EXPR =
  /^https:\/\/(sandbox\.)?zenodo\.org\/api\/files\/((\w|-)+)\/(.+)$/

const fetchFileContent = async (
  file: FileContentTarget,
  zenodoFiles: { [id: string]: ZenodoFiles }
): Promise<FileContentTarget> => {
  const result = Object.assign({}, file)
  const zenodoMatch = file.url.match(ZENODO_EXPR)
  if (zenodoMatch) {
    const zenodoFilesId = zenodoMatch[2]
    const zenodoFilesContent = zenodoFiles[zenodoFilesId].contents.find(
      (content) => content.key === zenodoMatch[4]
    )

    if (
      typeof zenodoFilesContent !== 'undefined' &&
      isFetchableZenodoFile(zenodoFilesContent)
    ) {
      try {
        const text = await fetchText(file.url)
        result.content = text
      } catch (err) {
        result.error = (err as Error).message
      }
    } else {
      result.error = 'This file cannot be fetched. (e.g. binary file)'
    }
  } else {
    if (isFetchableFileExt(file.url)) {
      try {
        const text = await fetchText(file.url)
        result.content = text
      } catch (err) {
        result.error = (err as Error).message
      }
    } else {
      result.error =
        'This file cannot be fetched because unsupported file type.'
    }
  }

  return result
}

// Basically, all files are uploaded to zenodo via yevis.
// zenodo url example: https://sandbox.zenodo.org/api/files/0c73ef44-3892-4b55-84e0-0c1e533e4be4/README.md"
export const fetchConfigContents = async (
  config: Config
): Promise<{ [target: string]: FileContent }> => {
  const contents: FileContentTarget[] = [
    {
      content: null,
      error: null,
      target: 'readme',
      url: config.workflow.readme,
    },
  ]
  config.workflow.files.forEach((file) => {
    if (typeof file.target !== 'undefined') {
      contents.push({
        content: null,
        error: null,
        target: file.target,
        url: file.url,
      })
    }
  })
  config.workflow.testing.forEach((test) => {
    test.files.forEach((file) => {
      if (typeof file.target !== 'undefined') {
        contents.push({
          content: null,
          error: null,
          target: file.target,
          url: file.url,
        })
      }
    })
  })

  const zenodoFilesIds: [string, boolean][] = Object.values(contents)
    .map((content) => content.url)
    .map((url) => {
      const match = url.match(ZENODO_EXPR)
      if (match) {
        return [match[2], match[1] === 'sandbox.']
      } else {
        return [null, null]
      }
    })
    .filter(([id, _]) => id !== null) as [string, boolean][]
  const zenodoFiles = await fetchZenodoFiles(zenodoFilesIds)
  const fetchedContents = await Promise.all(
    contents.map((content) => fetchFileContent(content, zenodoFiles))
  )

  const result: { [target: string]: FileContent } = {}
  fetchedContents.forEach((content) => {
    result[content.target] = content
  })

  return result
}
