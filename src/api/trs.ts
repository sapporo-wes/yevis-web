import { request } from 'https://cdn.skypack.dev/@octokit/request'
import yaml from 'js-yaml'
import semver from 'semver'

import { trsEndpoint, wfRepo, wfRepoGhPagesBranch } from '@/envDefault'
import { PublishStatus } from '@/store/filter'
import {
  DraftWorkflow,
  DraftWorkflows,
  PublishedWorkflow,
  PublishedWorkflows,
} from '@/store/workflows'
import { Config } from '@/types/ghTrs'
import { ServiceInfo, Tool, ToolVersion } from '@/types/trs'

export const getServiceInfo = async (): Promise<ServiceInfo> => {
  const res = await fetch(`${trsEndpoint().replace(/\/$/, '')}/service-info`, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to get ${trsEndpoint().replace(
        /\/$/,
        ''
      )}/service-info with error: ${res.status} ${res.statusText}`
    )
  }
  return await res.json()
}

export const isGhTrs = async (): Promise<void> => {
  const serviceInfo = await getServiceInfo()
  const artifact = serviceInfo.type.artifact
  if (!artifact) {
    throw new Error('Failed to get artifact from service-info')
  }
  const version = serviceInfo.type.version
  if (!version) {
    throw new Error('Failed to get version from service-info')
  }
  if (!(artifact === 'gh-trs' && version === '2.0.1')) {
    throw new Error(
      `The ddbj/yevis-web only supports artifact: gh-trs and version: 2.0.1 as a TRS API. The response from service-info is artifact: ${artifact} and version: ${version}`
    )
  }
}

export const getTools = async (): Promise<Tool[]> => {
  const res = await fetch(`${trsEndpoint().replace(/\/$/, '')}/tools`, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to get ${trsEndpoint().replace(/\/$/, '')}/tools with error: ${
        res.status
      } ${res.statusText}`
    )
  }
  return await res.json()
}

export const getTool = async (toolId: string): Promise<Tool> => {
  const res = await fetch(
    `${trsEndpoint().replace(/\/$/, '')}/tools/${toolId}`,
    {
      method: 'GET',
    }
  )
  if (!res.ok) {
    throw new Error(
      `Failed to get ${trsEndpoint().replace(
        /\/$/,
        ''
      )}/tools/${toolId} with error: ${res.status} ${res.statusText}`
    )
  }
  return await res.json()
}

export const getToolVersion = async (
  toolId: string,
  version: string
): Promise<ToolVersion> => {
  const res = await fetch(
    `${trsEndpoint().replace(/\/$/, '')}/tools/${toolId}/versions/${version}`,
    {
      method: 'GET',
    }
  )
  if (!res.ok) {
    throw new Error(
      `Failed to get ${trsEndpoint().replace(
        /\/$/,
        ''
      )}/tools/${toolId}/versions/${version} with error: ${res.status} ${
        res.statusText
      }`
    )
  }
  return await res.json()
}

export const getGhTrsConfig = async (
  id: string,
  version: string
): Promise<Config> => {
  const res = await fetch(
    `${trsEndpoint().replace(
      /\/$/,
      ''
    )}/tools/${id}/versions/${version}/gh-trs-config.json`,
    {
      method: 'GET',
    }
  )
  if (!res.ok) {
    throw new Error(
      `Failed to get ${trsEndpoint().replace(
        /\/$/,
        ''
      )}/tools/${id}/versions/${version}/gh-trs-config.json with error: ${
        res.status
      } ${res.statusText}`
    )
  }
  return await res.json()
}

// params: [id, version][]
// return: { `${id}_${version}`: Config }
export const getGhTrsConfigs = async (
  idVersions: [string, string][]
): Promise<Record<string, Config>> => {
  const configs: Record<string, Config> = {} // key: ${id}_${version}
  const results = await Promise.all(
    idVersions.map(([id, version]) => getGhTrsConfig(id, version))
  )
  results.forEach((config) => {
    configs[`${config.id}_${config.version}`] = config
  })
  return configs
}

// https://docs.github.com/en/rest/reference/commits#list-commits
export const getLastModifiedDate = async (
  id: string,
  version: string
): Promise<string> => {
  const commits = await request('GET /repos/{owner}/{repo}/commits', {
    owner: wfRepo().split('/')[0],
    path: `tools/${id}/versions/${version}/gh-trs-config.json`,
    per_page: 1,
    repo: wfRepo().split('/')[1],
    sha: wfRepoGhPagesBranch(),
  })
  if (commits.data.length === 0) {
    throw new Error(`Failed to get last modified date of ${id}_${version}`)
  }
  const date = commits.data[0].commit.committer.date || null
  if (date === null) {
    throw new Error(`Failed to get last modified date of ${id}_${version}`)
  }
  return date
}

// params: [id, version][]
// return: { `${id}_${version}`: dateStr }
export const getLastModifiedDates = async (
  idVersions: [string, string][]
): Promise<Record<string, string>> => {
  const dates: Record<string, string> = {} // key: ${id}_${version}
  const results = await Promise.all(
    idVersions.map(([id, version]) => getLastModifiedDate(id, version))
  )
  results.forEach((date, i) => {
    dates[`${idVersions[i][0]}_${idVersions[i][1]}`] = date
  })
  return dates
}

export const latestToolVersion = (tool: Tool): ToolVersion => {
  const sortedTools = tool.versions.sort((a, b) => {
    const aVer = a.url.split('/').pop() || '0.0.0'
    const bVer = b.url.split('/').pop() || '0.0.0'
    return semver.compare(aVer, bVer)
  })
  return sortedTools[sortedTools.length - 1]
}

export const extractVersionStr = (toolVersion: ToolVersion): string => {
  return toolVersion.url.split('/').pop() || ''
}

export const getPublishedWorkflows = async (): Promise<PublishedWorkflows> => {
  const tools = await getTools()
  const latestToolVersions = tools.map((tool) => latestToolVersion(tool))
  const latestIdVersions: [string, string][] = latestToolVersions.map(
    (toolVersion) => [toolVersion.id, extractVersionStr(toolVersion)]
  )
  const [configs, modifiedDate] = await Promise.all([
    getGhTrsConfigs(latestIdVersions),
    getLastModifiedDates(latestIdVersions),
  ])
  const publishedWorkflows: PublishedWorkflows = {}
  tools.forEach((tool, i) => {
    const id = tool.id
    const version = latestIdVersions[i][1]
    publishedWorkflows[tool.id] = {
      config: configs[`${id}_${version}`],
      date: modifiedDate[`${id}_${version}`],
      toolVersion: latestToolVersions[i],
      version: latestIdVersions[i][1],
    }
  })
  return publishedWorkflows
}

interface PRInfo {
  date: string
  id: string
  prId: number
  version: string
}

// https://docs.github.com/ja/rest/reference/pulls#list-pull-requests
// title example: 'Add workflow, id: aa1017e7-a11e-46d9-8156-2724e31915bb version: 1.0.0'
export const getPullRequests = async (): Promise<PRInfo[]> => {
  const pullRequests = await request('GET /repos/{owner}/{repo}/pulls', {
    owner: wfRepo().split('/')[0],
    repo: wfRepo().split('/')[1],
    state: 'open',
  })
  const titleExpr = /^Add workflow, id: ((\w|-)+) version: ((\d|\.)+)$/
  const prInfos = pullRequests.data
    .map((pr) => {
      const title = pr.title
      const match = title.match(titleExpr)
      if (match === null) {
        return null
      }
      return {
        date: pr.updated_at,
        id: match[1],
        prId: pr.number,
        version: match[3],
      }
    })
    .filter((prInfo) => prInfo !== null) as PRInfo[]
  return prInfos
}

// https://docs.github.com/ja/rest/reference/pulls#list-pull-requests-files
// draft raw url example: https://github.com/ddbj/yevis-workflows-dev/raw/68b0c0d92505c93a37d4b4d7180136d785f631bb/1fdc5861-c146-40f5-bb76-bcb5955cee11/yevis-config-1.0.0.yml
// raw url example: https://raw.githubusercontent.com/ddbj/yevis-workflows-dev/68b0c0d92505c93a37d4b4d7180136d785f631bb/1fdc5861-c146-40f5-bb76-bcb5955cee11/yevis-config-1.0.0.yml
export const getConfigFromPr = async (prId: number): Promise<Config> => {
  const files = await request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
    {
      owner: wfRepo().split('/')[0],
      pull_number: prId,
      repo: wfRepo().split('/')[1],
    }
  )
  const configFile = files.data.find((file) =>
    file.filename.includes('yevis-config')
  )
  if (typeof configFile === 'undefined') {
    throw new Error(`Failed to get draft config url of ${prId}`)
  }
  const draftRawUrl = configFile.raw_url
  const rawUrl = draftRawUrl
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/raw/', '/')
  const res = await fetch(rawUrl, { method: 'GET' })
  if (!res.ok) {
    throw new Error(
      `Failed to get config from ${rawUrl} with error: ${res.status} ${res.statusText}`
    )
  }
  const config = yaml.load(await res.text()) as Config
  return config
}

export const getDraftWorkflows = async (): Promise<DraftWorkflows> => {
  const prs = await getPullRequests()
  const configResults = await Promise.allSettled(
    prs.map((pr) => getConfigFromPr(pr.prId))
  )
  const draftWorkflows: DraftWorkflows = {}
  prs.forEach((pr, i) => {
    if (configResults[i].status === 'fulfilled') {
      const config = (configResults[i] as PromiseFulfilledResult<Config>).value
      draftWorkflows[pr.id] = {
        config,
        date: pr.date,
        prId: pr.prId,
        version: config.version,
      }
    }
  })
  return draftWorkflows
}

export const getAllVersions = async (
  id: string
): Promise<[string, PublishStatus][]> => {
  const [tool, prs] = await Promise.all([getTool(id), getPullRequests()])
  const results: [string, PublishStatus][] = tool.versions.map((tVer) => [
    extractVersionStr(tVer),
    'published',
  ])
  const pr = prs.find((pr) => pr.id === id)
  if (typeof pr !== 'undefined') {
    results.push([pr.version, 'draft'])
  }
  return results
}

export const getPublishedWorkflow = async (
  id: string,
  version: string
): Promise<PublishedWorkflow> => {
  const [toolVersion, config, modifiedDate] = await Promise.all([
    getToolVersion(id, version),
    getGhTrsConfig(id, version),
    getLastModifiedDate(id, version),
  ])
  return {
    config,
    date: modifiedDate,
    toolVersion,
    version,
  }
}

export const getDraftWorkflow = async (
  id: string,
  version: string
): Promise<DraftWorkflow> => {
  const prs = await getPullRequests()
  const pr = prs.find((pr) => pr.id === id && pr.version === version)
  if (typeof pr === 'undefined') {
    throw new Error(`Failed to get draft workflow of ${id}_${version}`)
  }
  const config = await getConfigFromPr(pr.prId)
  return {
    config,
    date: pr.date,
    prId: pr.prId,
    version,
  }
}
