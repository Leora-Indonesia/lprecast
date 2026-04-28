import type { ReactNode } from "react"
import {
  ArrowRight,
  Bell,
  Blocks,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Cpu,
  LayoutDashboard,
  Lock,
  ShieldCheck,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Status = "Done" | "In Progress" | "Planned"

type StatusTone = {
  badge: string
  panel: string
}

const statusTone: Record<Status, StatusTone> = {
  Done: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
    panel:
      "border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
  },
  "In Progress": {
    badge: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300",
    panel:
      "border-amber-200/80 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20",
  },
  Planned: {
    badge: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
    panel:
      "border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50",
  },
}

const roleScope = [
  {
    role: "Admin",
    status: "Done" as Status,
    summary: "Dashboard, vendor ops, approval workspace, notifications.",
  },
  {
    role: "Vendor",
    status: "Done" as Status,
    summary: "Register, onboarding, dashboard, profile, notifications, tender visibility dasar.",
  },
  {
    role: "Client",
    status: "In Progress" as Status,
    summary: "Dashboard dan profile/intake foundation sudah ada, full lane belum selesai.",
  },
  {
    role: "SPV",
    status: "Planned" as Status,
    summary: "Verifikasi progress dan monitoring lane masih tahap berikutnya.",
  },
]

const capabilities = [
  ["Vendor registration", "Done"],
  ["Vendor onboarding/profile completion", "Done"],
  ["Admin vendor review and approval", "Done"],
  ["Notifications dasar", "Done"],
  ["Vendor dashboard", "Done"],
  ["Admin dashboard", "Done"],
  ["Client dashboard scaffold", "Done"],
  ["PWA foundation", "Done"],
  ["Vendor tender list visibility", "In Progress"],
  ["Vendor tender detail and bid flow", "Planned"],
  ["Admin tender management", "Planned"],
  ["SPV verification lane", "Planned"],
] as const

const vendorSurfaces = [
  {
    title: "Vendor - Register",
    detail: "Pendaftaran akun vendor publik dengan validasi dasar.",
    status: "Done" as Status,
    route: "/vendor/register",
  },
  {
    title: "Vendor - Onboarding",
    detail: "Form kelengkapan data perusahaan, dokumen, kontak, area, dan produk.",
    status: "Done" as Status,
    route: "/vendor/onboarding",
  },
  {
    title: "Vendor - Dashboard",
    detail: "Ringkasan status akun, onboarding completeness, tender, dan action items.",
    status: "Done" as Status,
    route: "/vendor/dashboard",
  },
  {
    title: "Vendor - Profile",
    detail: "Kelola ulang data onboarding dalam surface profile yang konsisten.",
    status: "Done" as Status,
    route: "/vendor/profile",
  },
  {
    title: "Vendor - Tenders",
    detail: "Visibility route sudah ada, UI dan bid flow belum matang penuh.",
    status: "In Progress" as Status,
    route: "/vendor/tenders",
  },
  {
    title: "Vendor - Notifications",
    detail: "Inbox notifikasi dengan filter kategori dan mark-as-read.",
    status: "Done" as Status,
    route: "/vendor/notifications",
  },
]

const adminSurfaces = [
  {
    title: "Admin - Dashboard",
    detail: "Ringkasan vendor, pending review, notifikasi, dan kontrol registrasi.",
    status: "Done" as Status,
    route: "/admin/dashboard",
  },
  {
    title: "Admin - Vendors List",
    detail: "Table vendor dengan status dan entry point ke detail review.",
    status: "Done" as Status,
    route: "/admin/vendors",
  },
  {
    title: "Admin - Vendor Detail",
    detail: "Overview lengkap profil, dokumen, produk, operasional, dan kontak.",
    status: "Done" as Status,
    route: "/admin/vendors/[id]",
  },
  {
    title: "Admin - Approval Workspace",
    detail: "Workspace split-view untuk audit vendor dan checklist approval.",
    status: "Done" as Status,
    route: "/admin/vendors/[id]/approval",
  },
  {
    title: "Admin - Notifications",
    detail: "Inbox notifikasi admin untuk vendor dan event operasional dasar.",
    status: "Done" as Status,
    route: "/admin/notifications",
  },
  {
    title: "Admin - Tenders",
    detail: "Route foundation ada, manajemen tender masih coming soon.",
    status: "Planned" as Status,
    route: "/admin/tenders",
  },
]

const clientSurfaces = [
  {
    title: "Client - Dashboard",
    detail: "Status profil, jumlah pengajuan, dan next step client lane.",
    status: "Done" as Status,
    route: "/client/dashboard",
  },
  {
    title: "Client - Profile Foundation",
    detail: "Surface pengisian identitas client dan PIC sudah tersedia.",
    status: "Done" as Status,
    route: "/client/profile",
  },
  {
    title: "Client - Milestone & Funding Lane",
    detail: "Approval milestone dan funding reminder belum live.",
    status: "Planned" as Status,
    route: "future lane",
  },
]

const doneNow = [
  "Vendor registration, onboarding, profile, dashboard, notifications.",
  "Admin dashboard, vendor list, vendor detail, approval workspace, notifications.",
  "Client dashboard scaffold dan profile/intake foundation.",
  "PWA base, role guard via proxy, Supabase-backed app structure.",
]

const inProgressNow = [
  "Internal showcase page `/presentasi` untuk presentasi internal dan export PDF.",
  "Vendor tender visibility foundation masih tahap pematangan UI dan flow.",
]

const nextFocus = [
  "Tender publish, compare, dan bid flow end-to-end.",
  "Daily progress upload dan lane verifikasi SPV.",
  "Milestone approval, invoice, funding reminder, dan payment chain.",
  "KPI, monitoring, warning system, dan audit trail lanjutan.",
]

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        "presentation-slide mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-12 sm:px-10 lg:px-12",
        className
      )}
    >
      <div className="mb-8 max-w-3xl space-y-3">
        <div className="text-sm font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {eyebrow}
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
      </div>
      {children}
    </section>
  )
}

function StatusPill({ status }: { status: Status }) {
  return <Badge className={cn("border", statusTone[status].badge)}>{status}</Badge>
}

function MetricCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <Card className="border-border/70 bg-card/70 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-2 text-sm text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  )
}

function SurfaceCard({
  title,
  detail,
  status,
  route,
}: {
  title: string
  detail: string
  status: Status
  route: string
}) {
  return (
    <Card className={cn("border shadow-none", statusTone[status].panel)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
        <StatusPill status={status} />
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-dashed border-border/80 bg-background/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Screenshot pending</div>
              <div className="mt-1 text-sm text-muted-foreground">Real asset belum disimpan di `public/presentation/`.</div>
            </div>
            <div className="rounded-md border bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
              {route}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PresentationPage() {
  return (
    <main className="bg-background text-foreground">
      <div className="presentation-controls sticky top-0 z-20 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 sm:px-10 lg:px-12">
          <div>
            <div className="text-sm font-semibold">LPrecast Vendor Portal</div>
            <div className="text-xs text-muted-foreground">Internal showcase. Public route for live demo.</div>
          </div>
          <div className="hidden gap-2 lg:flex">
            {[
              ["Scope", "scope"],
              ["Vendor", "vendor"],
              ["Admin", "admin"],
              ["Client", "client"],
              ["Status", "delivery-status"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <Section
        id="cover"
        eyebrow="Section 1"
        title="LPrecast Vendor Portal"
        description="Fondasi portal internal untuk vendor onboarding, admin vendor operations, notifications, dan client foundation ringan. Project modules sengaja tidak masuk showcase utama karena masih tahap development."
      >
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="border-border/70 bg-gradient-to-br from-card via-card to-muted/40 shadow-none">
            <CardContent className="space-y-6 p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="border border-primary/20 bg-primary/10 text-primary">MVP Foundation Delivered</Badge>
                <Badge variant="outline">Internal showcase</Badge>
                <Badge variant="outline">Print-ready sections</Badge>
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  Satu halaman presentasi untuk membaca scope produk saat ini tanpa pindah-pindah route.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Fokus deck ini: vendor onboarding, admin vendor operations, notifications, dashboard foundation, dan client lane awal. Semua status mengikuti repo dan progress tracker.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="rounded-full border bg-background px-4 py-2">Vendor onboarding live</div>
                <div className="rounded-full border bg-background px-4 py-2">Admin approval workspace live</div>
                <div className="rounded-full border bg-background px-4 py-2">Client foundation available</div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <MetricCard title="Showcase focus" value="Vendor + Admin" note="Surface paling matang dan siap demo." />
            <MetricCard title="Client lane" value="Foundation" note="Dashboard dan profile ada, full journey belum." />
            <MetricCard title="Project modules" value="Excluded" note="Belum masuk deck karena masih development." />
          </div>
        </div>
      </Section>

      <Section
        id="problem"
        eyebrow="Section 2"
        title="Masalah operasional yang dirapikan"
        description="Produk ini dibangun untuk merapikan intake vendor, review internal, dan koordinasi status lintas role sebelum lane execution dan payment dibuka lebih jauh."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: Briefcase,
              title: "Tender coordination",
              body: "Visibility tender dan kesiapan vendor sering tersebar di chat, file, dan follow-up manual.",
            },
            {
              icon: ShieldCheck,
              title: "Vendor verification",
              body: "Dokumen legal, data operasional, dan status approval butuh workspace review yang rapi.",
            },
            {
              icon: Bell,
              title: "Status monitoring",
              body: "Notifikasi dan action item perlu surface yang konsisten untuk admin dan vendor.",
            },
            {
              icon: Wallet,
              title: "Lane separation",
              body: "Approval, SPV, milestone, dan payment perlu dipisah jelas agar governance tidak bercampur.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-border/70 shadow-none">
              <CardHeader className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="scope"
        eyebrow="Section 3"
        title="Product scope today"
        description="Role map saat ini sudah jelas. Vendor dan admin jadi surface utama, client baru foundation, SPV dan payment lane belum dibuka penuh."
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle>Role coverage</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {roleScope.map((item) => (
                <div key={item.role} className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-base font-semibold">{item.role}</div>
                    <StatusPill status={item.status} />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle>Lane separation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <div className="font-medium text-foreground">Vendor lane</div>
                <div>Register, onboarding, profile maintenance, notifications, tender visibility dasar.</div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <div className="font-medium text-foreground">Admin lane</div>
                <div>Review vendor, approval decision, operational visibility, notification handling.</div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <div className="font-medium text-foreground">Client and SPV lane</div>
                <div>Client foundation sudah ada. SPV verification dan payment governance masih planned, belum dipresentasikan sebagai live capability.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="already-works"
        eyebrow="Section 4"
        title="What already works"
        description="Bagian ini merangkum capability yang benar-benar bisa diverifikasi dari route, code, dan progress tracker hari ini."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {capabilities.map(([label, status]) => (
            <Card key={label} className={cn("border shadow-none", statusTone[status].panel)}>
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="space-y-1">
                  <div className="font-medium">{label}</div>
                </div>
                <StatusPill status={status} />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="vendor"
        eyebrow="Section 5"
        title="Vendor experience"
        description="Surface vendor sudah cukup lebar untuk demo onboarding end-to-end, account readiness, dan notification flow. Tender masih ditampilkan jujur sebagai visibility foundation."
      >
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <Card className="border-border/70 shadow-none lg:col-span-2">
            <CardContent className="flex h-full items-center justify-center p-8">
              <div className="w-full rounded-3xl border border-dashed border-border/80 bg-muted/20 p-8">
                <div className="mb-4 flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                  Vendor showcase hero
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border bg-background p-5">
                    <div className="font-medium">Vendor - Dashboard</div>
                    <div className="mt-1 text-sm text-muted-foreground">Ringkasan akun, tender, onboarding completeness, dan action items.</div>
                    <div className="mt-4"><StatusPill status="Done" /></div>
                  </div>
                  <div className="rounded-2xl border bg-background p-5">
                    <div className="font-medium">Vendor - Notifications</div>
                    <div className="mt-1 text-sm text-muted-foreground">Filter kategori dan mark-as-read untuk event operasional dasar.</div>
                    <div className="mt-4"><StatusPill status="Done" /></div>
                  </div>
                </div>
                <div className="mt-5 rounded-md border bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
                  Screenshot pending. Candidate assets: `/vendor/dashboard`, `/vendor/notifications`, `/vendor/profile`.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle>Nilai operasional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /><span>Vendor masuk lewat jalur register publik, lalu diarahkan ke onboarding sesuai status.</span></div>
              <div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /><span>Dashboard memusatkan status akun dan next actions tanpa perlu cek manual ke admin.</span></div>
              <div className="flex gap-3"><Clock3 className="mt-0.5 h-4 w-4 text-primary" /><span>Tender route sudah muncul sebagai fondasi visibility, tapi belum diposisikan sebagai flow bidding live.</span></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {vendorSurfaces.map((item) => (
            <SurfaceCard key={item.title} {...item} />
          ))}
        </div>
      </Section>

      <Section
        id="admin"
        eyebrow="Section 6"
        title="Admin experience"
        description="Capability admin paling matang ada di vendor operations: dashboard ringkas, daftar vendor, detail vendor, dan approval workspace yang bisa dipakai review internal."
      >
        <div className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70 shadow-none">
            <CardContent className="flex h-full items-center justify-center p-8">
              <div className="w-full rounded-3xl border border-dashed border-border/80 bg-muted/20 p-8">
                <div className="mb-4 flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <ClipboardList className="h-4 w-4" />
                  Admin approval showcase hero
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border bg-background p-5">
                    <div className="font-medium">Admin - Vendor Detail</div>
                    <div className="mt-1 text-sm text-muted-foreground">Overview lengkap data vendor dan shortcut ke workspace approval.</div>
                    <div className="mt-4"><StatusPill status="Done" /></div>
                  </div>
                  <div className="rounded-2xl border bg-background p-5">
                    <div className="font-medium">Admin - Approval Workspace</div>
                    <div className="mt-1 text-sm text-muted-foreground">Split-view audit data, dokumen, produk, kontak, dan checklist review.</div>
                    <div className="mt-4"><StatusPill status="Done" /></div>
                  </div>
                </div>
                <div className="mt-5 rounded-md border bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
                  Screenshot pending. Candidate assets: `/admin/dashboard`, `/admin/vendors`, `/admin/vendors/[id]/approval`.
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card className="border-border/70 shadow-none">
              <CardHeader>
                <CardTitle>Admin strengths today</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <div className="flex gap-3"><Building2 className="mt-0.5 h-4 w-4 text-primary" /><span>Vendor review jadi surface paling siap presentasi internal.</span></div>
                <div className="flex gap-3"><Bell className="mt-0.5 h-4 w-4 text-primary" /><span>Notification inbox bantu triage event vendor secara cepat.</span></div>
                <div className="flex gap-3"><ArrowRight className="mt-0.5 h-4 w-4 text-primary" /><span>Tender route ada sebagai foundation, tapi belum diklaim live workflow.</span></div>
              </CardContent>
            </Card>
            <Card className="border-border/70 shadow-none">
              <CardHeader>
                <CardTitle>Why this matters</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                Approval vendor sering jadi bottleneck awal. Workspace yang lebih rapi menurunkan friksi sebelum masuk ke lane tender, execution, dan payment berikutnya.
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {adminSurfaces.map((item) => (
            <SurfaceCard key={item.title} {...item} />
          ))}
        </div>
      </Section>

      <Section
        id="client"
        eyebrow="Section 7"
        title="Client experience"
        description="Client lane sudah punya fondasi agar identitas client dan intake awal bisa disiapkan. Full journey milestone approval dan funding tetap ditandai sebagai tahap berikutnya."
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle>Foundation framing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                Dashboard client sudah menampilkan readiness dasar: profil, jumlah pengajuan, dan next action.
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                Profile form client sudah tersedia untuk identitas perusahaan dan PIC.
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                Milestone approval, funding reminder, dan lane finansial belum ditampilkan sebagai live feature.
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/70 shadow-none">
              <CardContent className="flex h-full items-center justify-center p-8">
                <div className="w-full rounded-3xl border border-dashed border-border/80 bg-muted/20 p-8">
                  <div className="mb-4 flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Client showcase hero
                  </div>
                  <div className="rounded-2xl border bg-background p-5">
                    <div className="font-medium">Client - Dashboard</div>
                    <div className="mt-1 text-sm text-muted-foreground">Visibility readiness profile dan action untuk lane client awal.</div>
                    <div className="mt-4"><StatusPill status="Done" /></div>
                  </div>
                  <div className="mt-5 rounded-md border bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
                    Screenshot pending. Candidate asset: `/client/dashboard`.
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {clientSurfaces.map((item) => (
                <Card key={item.title} className={cn("border shadow-none", statusTone[item.status].panel)}>
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{item.title}</div>
                      <StatusPill status={item.status} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
                    <div className="rounded-md border bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
                      {item.route}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="architecture"
        eyebrow="Section 8"
        title="Architecture snapshot"
        description="Fondasi teknis dibangun untuk route-based governance, Supabase-backed data, dan UI yang konsisten dengan desain sistem repo saat ini."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              icon: Blocks,
              title: "Next.js App Router",
              body: "Server components default, route-level organization per role.",
            },
            {
              icon: Cpu,
              title: "Supabase",
              body: "Auth, database, dan data fetching utama terhubung ke repo current state.",
            },
            {
              icon: Lock,
              title: "RLS and role access",
              body: "Protected routes dijaga lewat `proxy.ts` dan stakeholder checks.",
            },
            {
              icon: LayoutDashboard,
              title: "shadcn/ui + Tailwind",
              body: "Visual language konsisten dengan token dan patterns app existing.",
            },
            {
              icon: Smartphone,
              title: "PWA via Serwist",
              body: "App sudah punya offline/pwa foundation untuk instalasi dan runtime caching.",
            },
            {
              icon: ShieldCheck,
              title: "Presentation governance",
              body: "Halaman ini public-whitelisted untuk demo internal tanpa auth blocker.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-border/70 shadow-none">
              <CardHeader className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="delivery-status"
        eyebrow="Section 9"
        title="Delivery status"
        description="Status board ini disusun mengikuti `docs/tasks/PROGRESS.md`, supaya pembaca langsung tahu mana yang selesai, aktif, dan berikutnya."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className={cn("border shadow-none", statusTone.Done.panel)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Done now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              {doneNow.map((item) => (
                <div key={item} className="rounded-xl border border-border/70 bg-background/80 p-3">{item}</div>
              ))}
            </CardContent>
          </Card>

          <Card className={cn("border shadow-none", statusTone["In Progress"].panel)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock3 className="h-5 w-5 text-amber-600" /> In progress now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              {inProgressNow.map((item) => (
                <div key={item} className="rounded-xl border border-border/70 bg-background/80 p-3">{item}</div>
              ))}
            </CardContent>
          </Card>

          <Card className={cn("border shadow-none", statusTone.Planned.panel)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowRight className="h-5 w-5 text-slate-600" /> Next build focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              {nextFocus.map((item) => (
                <div key={item} className="rounded-xl border border-border/70 bg-background/80 p-3">{item}</div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="next-focus"
        eyebrow="Section 10"
        title="Next build focus"
        description="Setelah fondasi onboarding dan admin ops cukup stabil, fokus delivery bergeser ke lane tender yang matang, verifikasi progress, dan governance pembayaran."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Tender maturity",
              body: "Publish, compare, select, dan vendor bid submission yang benar-benar end-to-end.",
            },
            {
              title: "SPV verification",
              body: "Daily progress review, approve/reject, dan variance monitoring terhadap target.",
            },
            {
              title: "Payment governance",
              body: "Milestone approval, invoice verification, client funding reminder, dan payment chain.",
            },
            {
              title: "Monitoring expansion",
              body: "KPI, warning system, audit trail, dan status automation lintas lane.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-border/70 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="closing"
        eyebrow="Section 11"
        title="Closing"
        description="Showcase ini menutup gap antara codebase dan deck internal: tim bisa demo apa yang sudah ada sekarang, sambil tetap jujur soal lane yang belum live."
        className="min-h-[70vh]"
      >
        <Card className="border-border/70 bg-gradient-to-br from-card to-muted/30 shadow-none">
          <CardContent className="grid gap-6 p-8 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Siap dipakai/demo</div>
              <div className="text-lg font-semibold">Vendor onboarding, admin vendor ops, notifications, client foundation.</div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Kenapa penting</div>
              <div className="text-lg font-semibold">Fondasi role, review, dan governance sudah rapi sebelum lane tender dan payment diperluas.</div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Milestone berikutnya</div>
              <div className="text-lg font-semibold">Matangkan tender flow, progress verification, milestone approval, dan monitoring operasional.</div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </main>
  )
}
