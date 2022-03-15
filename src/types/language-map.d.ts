declare module 'language-map' {
  export interface GhLangItem {
    aceMode: string
    aliases?: string[]
    codemirrorMimeType?: string
    codemirrorMode?: string
    color?: string
    extensions?: string[]
    filenames?: string[]
    fsName?: string
    group?: string
    interpreters?: string[]
    languageId: number
    searchable?: boolean
    tmScope: string
    type: 'data' | 'markup' | 'programming' | 'prose'
    wrap?: boolean
  }

  export interface LanguageMap {
    [key: string]: GhLangItem
  }

  const value: LanguageMap

  export default value
}
