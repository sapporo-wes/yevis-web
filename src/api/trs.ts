import { request } from 'https://cdn.skypack.dev/@octokit/request'

import { trsEndpoint, wfRepo, wfRepoGhPagesBranch } from '@/envDefault'
import { Config } from '@/types/ghTrs'
import { ServiceInfo, Tool } from '@/types/trs'

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

export const getGhTrsConfigs = async (
  idVersions: [string, string][]
): Promise<Record<string, Config>> => {
  const configs: Record<string, Config> = {} // key: ${id}_${version}
  const queue = idVersions.map(([id, version]) => getGhTrsConfig(id, version))
  await Promise.allSettled(queue).then((results) => {
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        configs[`${result.value.id}_${result.value.version}`] = result.value
      }
    })
  })
  return configs
}

// https://docs.github.com/en/rest/reference/commits#list-commits
export const getLastModifiedDate = async (
  id: string,
  version: string
): Promise<[string, string, string]> => {
  // const octokit = new Octokit()
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
  return [id, version, date]
}

export const getLastModifiedDates = async (
  idVersions: [string, string][]
): Promise<Record<string, string>> => {
  const dates: Record<string, string> = {} // key: ${id}_${version}
  const queue = idVersions.map(([id, version]) =>
    getLastModifiedDate(id, version)
  )
  await Promise.allSettled(queue).then((results) => {
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        dates[`${result.value[0]}_${result.value[1]}`] = result.value[2]
      }
    })
  })
  return dates
}
