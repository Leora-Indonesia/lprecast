import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  Building,
  Building2,
  CalendarDays,
  CheckCircle2,
  Construction,
  Factory,
  HardHat,
  LayoutGrid,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Target,
  Timer,
  TrendingDown,
  Warehouse,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Our Projects & Portfolio | Precaz",
  description: "Discover how Precaz has helped clients across industries achieve success with precast concrete solutions.",
}

const categories = [
  { id: "all", label: "All Projects", icon: LayoutGrid, active: true },
  { id: "infrastructure", label: "Infrastruktur", icon: Construction },
  { id: "commercial", label: "Komersial & Ritel", icon: Building },
  { id: "residential", label: "Perumahan", icon: Building2 },
  { id: "industrial", label: "Fasilitas Industri", icon: Factory },
  { id: "warehouse", label: "Gudang & Logistik", icon: Warehouse },
]

const projects = [
  {
    title: "Toll Road Drainage System",
    category: "Infrastruktur",
    location: "Jawa Barat",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
    desc: "Instalasi U-Ditch sepanjang 15km untuk sistem drainase jalan tol baru.",
  },
  {
    title: "Kawasan Industri Terpadu",
    category: "Fasilitas Industri",
    location: "Cikarang",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    desc: "Suplai dan instalasi precast wall panel dan pagar panel untuk kawasan seluas 50Ha.",
  },
  {
    title: "Mega Warehouse Logistics",
    category: "Gudang & Logistik",
    location: "Karawang",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    desc: "Pembangunan struktur gudang logistik menggunakan kombinasi precast column dan beam.",
  },
  {
    title: "Perumahan Subsidi",
    category: "Perumahan",
    location: "Banten",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    desc: "Aplikasi precast wall system untuk mempercepat pembangunan 1.000 unit rumah.",
  },
  {
    title: "Pabrik Manufaktur Otomotif",
    category: "Fasilitas Industri",
    location: "Purwakarta",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    desc: "Konstruksi pabrik baru menggunakan pondasi tiang pancang dan struktur precast.",
  },
  {
    title: "Pusat Perbelanjaan",
    category: "Komersial & Ritel",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=900&q=80",
    desc: "Suplai precast facade dan retaining wall untuk basement area komersial.",
  },
]

const whyChooseUs = [
  {
    title: "Reliable Quality",
    desc: "Material dan pengerjaan berstandar tinggi yang tahan uji waktu.",
    icon: ShieldCheck,
  },
  {
    title: "Timely Execution",
    desc: "Manajemen waktu yang ketat untuk menjamin proyek selesai tepat waktu.",
    icon: Timer,
  },
  {
    title: "Innovative Technology",
    desc: "Didukung aplikasi monitoring untuk memantau progres secara real-time.",
    icon: Target,
  },
  {
    title: "Cost Management",
    desc: "Solusi efisien yang meminimalkan waste dan mengoptimalkan anggaran.",
    icon: TrendingDown,
  },
  {
    title: "Safety First",
    desc: "Penerapan standar K3 yang ketat di setiap proses kerja lapangan.",
    icon: HardHat,
  },
  {
    title: "End-to-End Service",
    desc: "Layanan terintegrasi mulai dari perencanaan, suplai, hingga instalasi.",
    icon: Briefcase,
  },
]

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white text-foreground font-sans">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[450px] lg:min-h-[500px] flex items-center pt-8">
        {/* Background Image full width */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80"
            alt="Construction projects"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* White Gradient overlay on the left */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/95 to-transparent w-full md:w-[80%] lg:w-[65%]" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white to-transparent w-full md:w-[60%] lg:w-[45%]" />

        {/* Content container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 py-16">
          <div className="max-w-xl">
            <div className="text-[13px] font-medium text-gray-500 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-[#ea580c] transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1a120d] font-bold">Projects</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#2f1b12] sm:text-5xl lg:text-[54px] lg:leading-[1.1]">
              Our Projects & Portfolio
            </h1>
            <p className="mt-6 text-[16px] leading-7 text-gray-700">
              Discover how Precaz has helped clients across industries achieve success with precast concrete solutions and professional installation.
            </p>
          </div>
        </div>
      </section>

      {/* HERO BADGES STRIP */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 md:px-8 -mt-10 mb-16">
        <div className="bg-[#2f1b12] text-white rounded-[20px] shadow-xl border border-[#3e261b] p-6 lg:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-[#4a3023]">
            {[
              { value: "150+", label: "Projects Completed" },
              { value: "10+", label: "Sectors Served" },
              { value: "100%", label: "On-Time Delivery" },
              { value: "Zero", label: "Accident Target" },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col px-2 lg:px-6 first:pl-0 last:pr-0 pt-4 sm:pt-0">
                <div className="text-3xl font-black text-[#ea580c] mb-1">
                  {badge.value}
                </div>
                <div className="text-[14px] font-medium text-white/70">
                  {badge.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN PORTFOLIO SECTION */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-20">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          
          {/* SIDEBAR */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <h2 className="text-[17px] font-black text-[#2f1b12] mb-4">Filter by Industry</h2>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-bold transition-colors ${
                      cat.active 
                        ? 'bg-[#fff7ed] text-[#ea580c]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#2f1b12]'
                    }`}
                  >
                    <cat.icon className="h-5 w-5 opacity-70" strokeWidth={2} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#fafaf9] rounded-2xl p-6 border border-gray-100 text-center">
              <h3 className="text-[15px] font-bold text-[#2f1b12] mb-2">Ready for Your Next Project?</h3>
              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                Let's discuss how we can bring value to your construction development.
              </p>
              <Button variant="outline" className="w-full border-[#ea580c] text-[#ea580c] hover:bg-[#fff7ed] hover:text-[#c2410c] font-bold">
                Start a Project
              </Button>
            </div>
          </aside>

          {/* PROJECT GRID */}
          <div>
            <div className="mb-8">
              <h2 className="text-[24px] font-black text-[#2f1b12]">Featured Projects</h2>
              <p className="text-[14px] text-gray-500 mt-1">Explore our diverse portfolio of successfully completed precast projects.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.title}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md group"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-bold text-[#ea580c] uppercase tracking-wider">
                      {project.category}
                    </div>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-[18px] font-bold text-[#2f1b12] leading-tight">{project.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-[12px] text-gray-500 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-[#ea580c]" /> {project.location}
                    </div>
                    <p className="mt-4 text-[13px] leading-6 text-gray-600 flex-grow">
                      {project.desc}
                    </p>
                    <Link
                      href="#featured"
                      className="mt-5 inline-flex items-center justify-between w-full pt-4 border-t border-gray-100 text-[13px] font-bold text-[#ea580c] transition-colors hover:text-[#c2410c]"
                    >
                      View Project Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button variant="outline" className="border-gray-300 font-bold px-8 h-12">
                Load More Projects
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* WHY CLIENTS CHOOSE PRECAZ */}
      <section className="bg-[#fafaf9] border-t border-gray-100 px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[32px] font-black text-[#2f1b12] tracking-tight mb-4">
              Why Clients Choose Precaz
            </h2>
            <p className="text-[15px] text-gray-500">
              We are committed to delivering excellence in every project through our core values.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="flex gap-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#ea580c]">
                  <item.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#2f1b12] mb-2">{item.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#ea580c] px-4 py-16 md:px-8 relative overflow-hidden">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="border border-white/30 p-4 rounded-xl">
              <MessageSquare className="h-10 w-10 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-3xl font-black text-white sm:text-[32px]">Discuss Your Next Project With Us</div>
              <p className="mt-2 text-base text-white/90">
                Contact our team for a free consultation and project estimation.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-white text-[#ea580c] hover:bg-gray-100 px-8 h-12 text-[15px] font-bold shadow-md rounded-md shrink-0">
            <Link href="/contact">Get Free Consultation</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
