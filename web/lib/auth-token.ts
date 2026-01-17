const STORAGE_KEY = "accessToken"

let accessToken: string | null = null

export function loadAccessToken() {
  if (typeof window === "undefined") return null

  const stored = sessionStorage.getItem(STORAGE_KEY)
  accessToken = stored
  return stored
}

export function getAccessToken() {
  return accessToken
}

export function setAccessToken(token: string) {
  accessToken = token
  sessionStorage.setItem(STORAGE_KEY, token)
}

export function clearAccessToken() {
  accessToken = null
  sessionStorage.removeItem(STORAGE_KEY)
}
