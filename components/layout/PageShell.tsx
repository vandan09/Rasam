import DemoBanner from "@/components/ui/DemoBanner"

interface Props {
  children: React.ReactNode
  showDemoBanner?: boolean
}

export default function PageShell({ children, showDemoBanner = true }: Props) {
  const isDemo =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE !== "false"

  return (
    <>
      {showDemoBanner && isDemo && <DemoBanner />}
      {children}
    </>
  )
}
