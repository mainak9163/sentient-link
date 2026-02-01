import { LogoutButton } from "./auth/logout-button"

export const Navbar=()=> {
  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center">
      <span className="font-semibold">SentientLink</span>
      <div className="flex gap-4 items-center">
        <a href="/dashboard">Dashboard</a>
        <a href="/links">Links</a>
        <LogoutButton />
      </div>
    </nav>
  )
}
