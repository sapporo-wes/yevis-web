import { request } from 'https://cdn.skypack.dev/@octokit/request'
import yaml from 'js-yaml'
import semver from 'semver'

import { trsEndpoint, wfRepo, wfRepoGhPagesBranch } from '@/envDefault'
import { DraftWorkflows, PublishedWorkflows } from '@/store/workflows'
import { Config } from '@/types/ghTrs'
import { ServiceInfo, Tool, ToolVersion } from '@/types/trs'

export const getServiceInfo = async (): Promise<ServiceInfo> => {
  const res = await fetch(`${trsEndpoint().replace(/\/$/, '')}/service-info`, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch /service-info with error: ${res.status} ${res.statusText}`
    )
  }
  return await res.json()
}

export const isGhTrs = async (): Promise<void> => {
  const serviceInfo = await getServiceInfo()
  const artifact = serviceInfo?.type?.artifact
  if (!artifact) {
    throw new Error('Failed to get artifact from service-info')
  }
  const version = serviceInfo?.type?.version
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
      `Failed to fetch /tools with error: ${res.status} ${res.statusText}`
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
      `Failed to fetch /tools/${id}/versions/${version}/gh-trs-config.json with error: ${res.status} ${res.statusText}`
    )
  }
  return await res.json()
}

// { id: Config }
export const getGhTrsConfigs = async (
  idVersions: [string, string][]
): Promise<Record<string, Config>> => {
  const configs: Record<string, Config> = {} // key: ${id}_${version}
  const results = await Promise.all(
    idVersions.map(([id, version]) => getGhTrsConfig(id, version))
  )
  for (const config of results) {
    configs[config.id] = config
  }
  return configs
}

// https://docs.github.com/en/rest/reference/commits#list-commits
export const getLastModifiedDate = async (
  id: string,
  version: string
): Promise<string> => {
  const commits = await request('GET /repos/{owner}/{repo}/commits', {
    owner: wfRepo().split('/')[0],
    repo: wfRepo().split('/')[1],
    path: `tools/${id}/versions/${version}/gh-trs-config.json`,
    per_page: 1,
    sha: wfRepoGhPagesBranch(),
  })
  if (commits.data.length === 0) {
    throw new Error(`Failed to get last modified date of ${id}_${version}`)
  }
  const date = commits.data[0].commit.committer?.date || null
  if (date === null) {
    throw new Error(`Failed to get last modified date of ${id}_${version}`)
  }
  return date
}

// { id: date }
export const getLastModifiedDates = async (
  idVersions: [string, string][]
): Promise<Record<string, string>> => {
  const dates: Record<string, string> = {} // key: ${id}_${version}
  const results = await Promise.all(
    idVersions.map(([id, version]) => getLastModifiedDate(id, version))
  )
  for (let i = 0; i < results.length; i++) {
    dates[idVersions[i][0]] = results[i]
  }
  return dates
}

export const latestVersion = (tool: Tool): ToolVersion => {
  return tool.versions.sort((a, b) => {
    const aVer = a.url.split('/').pop() || '0.0.0'
    const bVer = b.url.split('/').pop() || '0.0.0'
    return semver.compare(aVer, bVer)
  })[0]
}

export const extractVersion = (toolVersion: ToolVersion): string => {
  return toolVersion.url.split('/').pop() || ''
}

export const getPublishedWorkflows = async (): Promise<PublishedWorkflows> => {
  await isGhTrs()
  const tools = await getTools()
  const latestToolVersions = tools.map((tool) => latestVersion(tool))
  const latestIdVersions: [string, string][] = latestToolVersions.map(
    (toolVersion) => [toolVersion.id, extractVersion(toolVersion)]
  )
  const [configs, modifiedDate] = await Promise.all([
    getGhTrsConfigs(latestIdVersions),
    getLastModifiedDates(latestIdVersions),
  ])
  const publishedWorkflows: PublishedWorkflows = {}
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i]
    publishedWorkflows[tool.id] = {
      tool,
      latest: {
        toolVersion: latestToolVersions[i],
        config: configs[tool.id],
        version: latestIdVersions[i][1],
        modifiedDate: modifiedDate[tool.id],
      },
    }
  }
  return publishedWorkflows
}

// https://docs.github.com/ja/rest/reference/pulls#list-pull-requests
// return [prId, createdAt][]
export const getPullRequestIdDates = async (): Promise<[number, string][]> => {
  const pullRequests = await request('GET /repos/{owner}/{repo}/pulls', {
    owner: wfRepo().split('/')[0],
    repo: wfRepo().split('/')[1],
    state: 'open',
  })
  return pullRequests.data
    .filter((pr) => pr.title.includes('Add'))
    .map((pr) => [pr.number, pr.created_at])
}

// https://docs.github.com/ja/rest/reference/pulls#list-pull-requests-files
// return example: https://github.com/ddbj/yevis-workflows-dev/raw/68b0c0d92505c93a37d4b4d7180136d785f631bb/1fdc5861-c146-40f5-bb76-bcb5955cee11/yevis-config-1.0.0.yml
export const getDraftConfigUrl = async (prId: number): Promise<string> => {
  const files = await request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
    {
      owner: wfRepo().split('/')[0],
      repo: wfRepo().split('/')[1],
      pull_number: prId,
    }
  )
  const configFile = files.data.find((file) =>
    file.filename.includes('yevis-config')
  )
  if (typeof configFile === 'undefined') {
    throw new Error(`Failed to get draft config url of ${prId}`)
  }
  return configFile.raw_url
}

// url example: https://github.com/ddbj/yevis-workflows-dev/raw/68b0c0d92505c93a37d4b4d7180136d785f631bb/1fdc5861-c146-40f5-bb76-bcb5955cee11/yevis-config-1.0.0.yml
// rawUrl example: https://raw.githubusercontent.com/ddbj/yevis-workflows-dev/68b0c0d92505c93a37d4b4d7180136d785f631bb/1fdc5861-c146-40f5-bb76-bcb5955cee11/yevis-config-1.0.0.yml
export const getConfigFromRawUrl = async (
  url: string | null
): Promise<Config> => {
  if (url === null) {
    throw new Error('Failed to get config from raw url because url is null')
  }
  const rawUrl = url
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/raw/', '/')
  const res = await fetch(rawUrl, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to get config from ${url} with error: ${res.status} ${res.statusText}`
    )
  }
  const config = yaml.load(await res.text()) as Config
  return config
}

export const getDraftWorkflows = async (): Promise<DraftWorkflows> => {
  await isGhTrs()
  const prIdDates = await getPullRequestIdDates()
  const configUrlResults = await Promise.allSettled(
    prIdDates.map((idDate) => getDraftConfigUrl(idDate[0]))
  )
  const configUrls = configUrlResults.map((res) =>
    res.status === 'fulfilled' ? res.value : null
  )
  const configResults = await Promise.allSettled(
    configUrls.map((url) => getConfigFromRawUrl(url))
  )
  const configs = configResults.map((res) =>
    res.status === 'fulfilled' ? res.value : null
  )
  const draftWorkflows: DraftWorkflows = {}
  for (let i = 0; i < prIdDates.length; i++) {
    const idDate = prIdDates[i]
    const config = configs[i]
    if (config !== null) {
      draftWorkflows[config.id] = {
        config,
        version: config.version,
        createdDate: idDate[1],
        prId: idDate[0],
      }
    }
  }
  return draftWorkflows
}
