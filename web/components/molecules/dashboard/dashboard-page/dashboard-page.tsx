import { FC } from "react"
import { CreateLinkForm } from "@/components/molecules/dashboard/create-link-form/create-link-form"
import { DashboardPageProps } from "./dashboard-page.types"

export const DashboardPage: FC<DashboardPageProps> = () => {
  return (
    <div className="max-w-xl space-y-6 w-full">
      <CreateLinkForm />
    </div>
  )
}
