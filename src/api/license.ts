export interface LicenseInfo {
  name: string
  url: string
}

export const getLicenseInfo = async (key: string): Promise<LicenseInfo> => {
  const res = await fetch(`https://api.github.com/licenses/${key}`)
  if (!res.ok) {
    throw new Error(`Could not fetch license info for ${key}`)
  }
  const resBody = await res.json()
  if (!resBody.name || !resBody.html_url) {
    throw new Error(`Could not fetch license info for ${key}`)
  }
  return {
    name: resBody.name,
    url: resBody.html_url,
  }
}
