import { Navbar } from "@/components/navbar"


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="p-6 flex-1 flex flex-col justify-center items-center">{children}</main>
    </div>
  )
}
