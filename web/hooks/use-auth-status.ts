"use client"

import { useSyncExternalStore } from "react"

const STORAGE_KEY = "accessToken"
const AUTH_EVENT = "auth-token-change"

function subscribe(callback: () => void) {
  const handler = () => callback()

  window.addEventListener("storage", handler)
  window.addEventListener(AUTH_EVENT, handler)

  return () => {
    window.removeEventListener("storage", handler)
    window.removeEventListener(AUTH_EVENT, handler)
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return false
  return !!sessionStorage.getItem(STORAGE_KEY)
}

function getServerSnapshot() {
  return false
}

export function useAuthStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
