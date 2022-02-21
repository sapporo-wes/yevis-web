export type Config = {
  id: string
  version: string
  license?: string
  authors: Author[]
  zenodo?: Zenodo
  workflow: Workflow
}

export type Author = {
  github_account: string
  name?: string
  affiliation?: string
  orcid?: string
}

export type Workflow = {
  name: string
  readme: string
  language: Language
  files: File[]
  testing: Testing[]
}

export type Language = {
  type?: LanguageType
  version?: string
}

export type LanguageType = 'CWL' | 'WDL' | 'NFL' | 'SMK'

export type File = {
  url: string
  target?: string
  type: FileType
}

export type FileType = 'primary' | 'secondary'

export type Testing = {
  id: string
  files: TestFile[]
}

export type TestFile = {
  url: string
  target?: string
  type: TestFileType
}

export type TestFileType = 'wf_params' | 'wf_engine_params' | 'other'

export type Zenodo = {
  url: string
  id: number
  doi: string
  concept_doi: string
}
