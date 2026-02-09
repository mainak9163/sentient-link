const STORAGE_KEY = "accessToken"
const AUTH_EVENT = "auth-token-change"

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
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT))
  }
}

export function clearAccessToken() {
  accessToken = null
  sessionStorage.removeItem(STORAGE_KEY)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT))
  }
}
