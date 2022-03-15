import ghLangMap, { GhLangItem } from 'language-map'

import prismTypes from '@/utils/prismTypes'

export const detectPrismType = (path: string): string | undefined => {
  const fileName = `${path.split('/').pop()}`
  const ext = `.${path.split('.').pop()}`
  const ghLangItem = Object.values(ghLangMap).find(
    (item: GhLangItem) =>
      item.extensions?.includes(ext) || item.filenames?.includes(fileName)
  )
  return (
    ghLangItem &&
    prismTypes.find(
      (type) =>
        type === ghLangItem.aceMode || type === ghLangItem.codemirrorMode
    )
  )
}
