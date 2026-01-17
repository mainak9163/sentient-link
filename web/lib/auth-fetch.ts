import { getAccessToken, setAccessToken, clearAccessToken } from "./auth-token"

type AuthFetchInit = RequestInit & {
  retry?: boolean
}

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true

  refreshPromise = fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Refresh failed")
      }

      const data = await res.json()
      setAccessToken(data.accessToken)
      return data.accessToken
    })
    .catch(() => {
      clearAccessToken()
      return null
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

export async function authFetch(
  input: RequestInfo,
  init: AuthFetchInit = {}
): Promise<Response> {
  const token = getAccessToken()

  const headers = new Headers(init.headers)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  })

  // ✅ Success
  if (response.status !== 401) {
    return response
  }

  // ❌ Already retried once
  if (init.retry) {
    clearAccessToken()
    window.location.href = "/login"
    throw new Error("Unauthorized")
  }

  // 🔁 Attempt refresh
  const newToken = await refreshAccessToken()

  if (!newToken) {
    window.location.href = "/login"
    throw new Error("Session expired")
  }

  // 🔁 Retry original request ONCE
  return authFetch(input, {
    ...init,
    headers,
    retry: true,
  })
}
