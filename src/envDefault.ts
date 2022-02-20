const DEFAULT_WF_REPO = 'ddbj/yevis-workflows'
const DEFAULT_WF_REPO_BRANCH = 'main'
const DEFAULT_TRS_ENDPOINT = 'https://ddbj.github.io/yevis-workflows/'

export const wfRepo = (): string => {
  const envWfRepo = import.meta.env.VITE_WF_REPO
  if (typeof envWfRepo === 'boolean') {
    return DEFAULT_WF_REPO
  }
  return envWfRepo ? envWfRepo : DEFAULT_WF_REPO
}

export const wfRepoBranch = (): string => {
  const envWfRepoBranch = import.meta.env.VITE_WF_REPO_BRANCH
  if (typeof envWfRepoBranch === 'boolean') {
    return DEFAULT_WF_REPO_BRANCH
  }
  return envWfRepoBranch ? envWfRepoBranch : DEFAULT_WF_REPO_BRANCH
}

export const trsEndpoint = (): string => {
  const envTrsEndpoint = import.meta.env.VITE_TRS_ENDPOINT
  if (typeof envTrsEndpoint === 'boolean') {
    return DEFAULT_TRS_ENDPOINT
  }
  return envTrsEndpoint ? envTrsEndpoint : DEFAULT_TRS_ENDPOINT
}
