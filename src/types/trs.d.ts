/* eslint-disable typescript-sort-keys/interface */

export type ServiceInfo = {
  id: string
  name: string
  type: {
    group: string
    artifact: string
    version: string
  }
  description?: string
  organization: {
    name: string
    url: string
  }
  contactUrl?: string
  documentationUrl?: string
  createdAt?: string
  updatedAt?: string
  environment?: string
  version: string
}

export type CheckSum = {
  checksum: string
  type: string
}

export type FileType =
  | 'TEST_FILE'
  | 'PRIMARY_DESCRIPTOR'
  | 'SECONDARY_DESCRIPTOR'
  | 'CONTAINERFILE'
  | 'OTHER'

export type ToolFile = {
  path?: string
  file_type?: FileType
  checksum?: CheckSum
}

export type ToolClass = {
  id?: string
  name?: string
  description?: string
}

export type Tool = {
  url: string
  id: string
  aliases?: string[]
  organization: string
  name?: string
  tool_class: ToolClass
  description?: string
  meta_version?: string
  has_checker?: boolean
  checker_url?: string
  versions: ToolVersion[]
}

export type ToolVersion = {
  author?: string[]
  name?: string
  url: string
  id: string
  is_production?: boolean
  images?: ImageData[]
  descriptor_type?: DescriptorType[]
  containerfile?: boolean
  meta_version?: string
  verified?: boolean
  verified_source?: string[]
  signed?: boolean
  included_apps?: string[]
}

export type ImageData = {
  registry_host?: string
  image_name?: string
  size?: string
  updated?: string
  checksum?: CheckSum
  image_type?: ImageType
}

export type ImageType = 'Docker' | 'Singularity' | 'Conda'

export type DescriptorType = 'CWL' | 'WDL' | 'NFL' | 'SMK' | 'GALAXY'

export type FileWrapper = {
  content?: string
  checksum?: CheckSum[]
  url?: string
}
