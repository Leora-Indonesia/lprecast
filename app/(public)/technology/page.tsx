import Image from "next/image"
import Link from "next/link"
import {
  Activity,
  ArrowRight,
  BarChart,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Database,
  Download,
  Eye,
  FileText,
  Lock,
  MonitorSmartphone,
  PieChart,
  Settings,
  ShieldCheck,
  Smartphone,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Technology | Precaz",
  description: "Smarter Construction with Real-Time Technology. Discover how our digital platform provides full visibility and control over your precast projects.",
}

const features = [
  { id: "daily", label: "Daily Progress Report", icon: ClipboardCheck, active: true },
  { id: "volume", label: "Installed Volume Tracking", icon: BarChart },
  { id: "quality", label: "Quality Checklist", icon: ShieldCheck },
  { id: "reporting", label: "Automatic Reporting", icon: FileText },
  { id: "timeline", label: "Timeline Progress", icon: Clock },
]

const benefits = [
  {
    title: "Transparansi Penuh",
    desc: "Pantau setiap aktivitas proyek dari pabrik hingga instalasi di lapangan secara real-time.",
    icon: Eye,
  },
  {
    title: "Pengambilan Keputusan Cepat",
    desc: "Data akurat yang diperbarui setiap hari memungkinkan Anda merespons isu lebih awal.",
    icon: Activity,
  },
  {
    title: "Akses Kapan Saja",
    desc: "Aplikasi berbasis web yang responsif dapat diakses dari PC, tablet, maupun smartphone.",
    icon: Smartphone,
  },
  {
    title: "Keamanan Data Terjamin",
    desc: "Semua informasi proyek disimpan secara aman dan hanya dapat diakses oleh pihak berwenang.",
    icon: Lock,
  },
  {
    title: "Efisiensi Operasional",
    desc: "Otomatisasi laporan mengurangi beban administrasi dan human error secara signifikan.",
    icon: Settings,
  },
  {
    title: "Data Historis Tersimpan",
    desc: "Seluruh riwayat proyek tersimpan rapi sebagai referensi untuk proyek Anda di masa depan.",
    icon: Database,
  },
]

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-white text-foreground font-sans">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[450px] lg:min-h-[500px] flex items-center pt-8 bg-[#f8fafc]">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a120d 2px, transparent 2px)', backgroundSize: '32px 32px' }} />

        {/* Content container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 py-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div className="max-w-2xl">
            <div className="text-[13px] font-medium text-gray-500 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-[#f97316] transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1a120d] font-bold">Technology</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffedd5] text-[#ea580c] text-[12px] font-bold uppercase tracking-wider mb-6">
              <MonitorSmartphone className="h-4 w-4" /> Digital Platform
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#2f1b12] sm:text-5xl lg:text-[54px] lg:leading-[1.1]">
              Smarter Construction with Real-Time Technology
            </h1>
            <p className="mt-6 text-[16px] leading-7 text-gray-700 max-w-xl">
              We integrate advanced digital tools to give you full visibility and control over your precast projects. Track progress, ensure quality, and manage timelines effortlessly from anywhere.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild className="bg-[#ea580c] text-white hover:bg-[#c2410c] h-12 px-8 text-[15px] font-bold shadow-md rounded-md">
                <Link href="/login">Login to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 text-[#2f1b12] hover:bg-white h-12 px-8 text-[15px] font-bold rounded-md bg-transparent">
                <Link href="/contact">Request Demo</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
               <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                  alt="Dashboard Interface"
                  fill
                  className="object-cover"
                />
            </div>
            {/* Floating element */}
            <div className="absolute -bottom-6 -left-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
               <div className="bg-[#dcfce7] text-[#166534] p-3 rounded-full">
                 <TrendingUp className="h-6 w-6" />
               </div>
               <div>
                 <div className="text-[12px] text-gray-500 font-bold uppercase">Progress Updated</div>
                 <div className="text-[16px] font-black text-[#2f1b12]">100% On Track</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
          
          {/* SIDEBAR */}
          <aside className="space-y-8">
            <div>
              <h2 className="text-[17px] font-black text-[#2f1b12] mb-5">Platform Features</h2>
              <div className="space-y-2">
                {features.map((feat) => (
                  <button
                    key={feat.id}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-bold transition-all ${
                      feat.active 
                        ? 'bg-[#ea580c] text-white shadow-md transform scale-[1.02]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#2f1b12]'
                    }`}
                  >
                    <feat.icon className={`h-5 w-5 ${feat.active ? 'text-white' : 'opacity-70'}`} strokeWidth={2} />
                    {feat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2f1b12] to-[#4a3023] rounded-2xl p-6 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10" />
              <h3 className="text-[16px] font-bold mb-2 relative z-10">Need a Live Demo?</h3>
              <p className="text-[13px] text-white/80 mb-6 leading-relaxed relative z-10">
                Experience the power of our real-time monitoring platform for your next project.
              </p>
              <Button className="w-full bg-white text-[#2f1b12] hover:bg-gray-100 font-bold relative z-10">
                Schedule a Demo
              </Button>
            </div>
          </aside>

          {/* FEATURE DETAILS */}
          <div>
            <div className="mb-8">
              <h2 className="text-[28px] font-black text-[#2f1b12] leading-tight">Daily Progress Report</h2>
              <p className="text-[15px] text-gray-500 mt-3 max-w-2xl leading-relaxed">
                Stay updated with comprehensive daily reports generated directly from the field. Our platform captures every critical milestone and updates it to your dashboard instantly.
              </p>
            </div>

            <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 mb-10">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                alt="Daily Progress Dashboard"
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-[18px] font-black text-[#2f1b12] mb-6">End-to-End Visibility Features</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Real-time Data Sync", desc: "Data lapangan tersinkronisasi ke server seketika untuk analisis instan.", icon: Activity },
                { title: "Visual Evidence", desc: "Dilengkapi dengan foto progres harian sebagai bukti kerja konkret.", icon: Eye },
                { title: "Interactive Charts", desc: "Grafik interaktif untuk membandingkan plan vs actual progress.", icon: PieChart },
                { title: "Exportable Reports", desc: "Unduh laporan dalam format PDF atau Excel dengan satu klik.", icon: Download },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-white hover:border-[#fed7aa] transition-colors group">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                    <item.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#2f1b12] mb-1">{item.title}</h4>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="bg-[#fafaf9] border-t border-gray-100 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-3">
              THE ADVANTAGES
            </div>
            <h2 className="text-[32px] font-black text-[#2f1b12] tracking-tight mb-4">
              Why Use Precaz Technology?
            </h2>
            <p className="text-[15px] text-gray-500">
              Transforming traditional construction management into a seamless, data-driven experience.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-[#ea580c] mb-6">
                  <item.icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-bold text-[#2f1b12] mb-3">{item.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#2f1b12] px-4 py-16 md:px-8 relative overflow-hidden">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="border border-white/20 p-4 rounded-xl">
              <MonitorSmartphone className="h-10 w-10 text-[#ea580c]" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-3xl font-black text-white sm:text-[32px]">Experience the Future of Construction</div>
              <p className="mt-2 text-[15px] text-white/70">
                Log in to your dashboard now or request a demo to see our platform in action.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
            <Button asChild size="lg" className="bg-[#ea580c] text-white hover:bg-[#c2410c] px-8 h-12 text-[15px] font-bold border-none w-full sm:w-auto">
              <Link href="/login">Login to Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 h-12 text-[15px] font-bold bg-transparent w-full sm:w-auto">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
