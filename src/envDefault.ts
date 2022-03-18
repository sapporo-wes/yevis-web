const DEFAULT_WF_REPO = 'ddbj/yevis-workflows'
const DEFAULT_WF_REPO_GH_PAGES_BRANCH = 'gh-pages'
const DEFAULT_TRS_ENDPOINT = 'https://ddbj.github.io/yevis-workflows/'

export const wfRepo = (): string => {
  const envWfRepo = import.meta.env.VITE_WF_REPO
  if (typeof envWfRepo === 'boolean') {
    return DEFAULT_WF_REPO
  }
  return envWfRepo || DEFAULT_WF_REPO
}

export const wfRepoGhPagesBranch = (): string => {
  const envWfRepoGhPagesBranch = import.meta.env.VITE_WF_REPO_GH_PAGES_BRANCH
  if (typeof envWfRepoGhPagesBranch === 'boolean') {
    return DEFAULT_WF_REPO_GH_PAGES_BRANCH
  }
  return envWfRepoGhPagesBranch || DEFAULT_WF_REPO_GH_PAGES_BRANCH
}

export const trsEndpoint = (): string => {
  const envTrsEndpoint = import.meta.env.VITE_TRS_ENDPOINT
  if (typeof envTrsEndpoint === 'boolean') {
    return DEFAULT_TRS_ENDPOINT
  }
  return envTrsEndpoint || DEFAULT_TRS_ENDPOINT
}
