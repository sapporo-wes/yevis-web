export const fetchContent = async (url: string): Promise<string> => {
  const res = await fetch(url, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch content from ${url}`)
  }
  return res.text()
}
