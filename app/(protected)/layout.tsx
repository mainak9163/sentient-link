import { Navbar } from "@/components/navbar"


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  )
}
