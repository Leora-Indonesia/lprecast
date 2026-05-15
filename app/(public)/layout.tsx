import { SiteHeader } from "@/components/landing/site-header"
import { SiteFooter } from "@/components/landing/site-footer"
import { Fragment } from "react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Fragment>
      <SiteHeader />
      {children}
      <SiteFooter />
    </Fragment>
  )
}
