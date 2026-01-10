
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold">SentientLink</h1>
        <p className="text-muted-foreground">
          A simple, powerful URL shortener — intelligence coming soon.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Login
          </a>
          <a
            href="/register"
            className="rounded-md border px-4 py-2"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  )
}
