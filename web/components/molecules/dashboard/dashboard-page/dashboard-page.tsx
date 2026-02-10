import { FC } from "react"
import { CreateLinkForm } from "@/components/molecules/dashboard/create-link-form/create-link-form"
import { DashboardPageProps } from "./dashboard-page.types"
import { BoxLayout } from "@/components/atoms/box-layout/box-layout"

export const DashboardPage: FC<DashboardPageProps> = () => {
  return (
    <BoxLayout className="max-w-xl space-y-6 w-full">
      <CreateLinkForm />
    </BoxLayout>
  )
}
