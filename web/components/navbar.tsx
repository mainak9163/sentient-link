export const Navbar=()=> {
  return (
    <nav className="border-b px-6 py-4 flex justify-between">
      <span className="font-semibold">SentientLink</span>
      <div className="flex gap-4">
        <a href="/dashboard">Dashboard</a>
        <a href="/links">Links</a>
      </div>
    </nav>
  )
}
