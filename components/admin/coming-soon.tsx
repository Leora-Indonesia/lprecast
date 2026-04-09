import { Construction } from "lucide-react"

interface ComingSoonProps {
  title: string
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Construction className="h-16 w-16 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">
          Fitur ini akan tersedia di Phase 2
        </p>
      </div>
    </div>
  )
}
