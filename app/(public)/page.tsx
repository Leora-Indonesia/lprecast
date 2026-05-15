import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
import {
  ArrowRight,
  BarChart3,
  Blocks,
  Building2,
  Calculator,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileCheck,
  HardHat,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react"

import { MagicLinkCallback } from "@/components/auth/magic-link-callback"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Precaz - Precast Concrete, Installed with Precision.",
  description:
    "End-to-end procurement and installation of precast concrete systems, powered by real-time project monitoring technology.",
}



const valuePoints = [
  {
    title: "End-to-End Service",
    description: "From procurement to installation",
    icon: FileCheck,
  },
  {
    title: "Precision Installation",
    description: "On time, on standard, every time",
    icon: HardHat,
  },
  {
    title: "Real-time Monitoring",
    description: "Transparent project control at your fingertips",
    icon: BarChart3,
  },
  {
    title: "Quality Assured",
    description: "Reliable, durable, and compliant",
    icon: ShieldCheck,
  },
]

const productCards = [
  {
    title: "Precast Wall Panel",
    description: "Ideal for warehouse, factory, and building wall solutions.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Precast Fence Panel",
    description: "Durable and aesthetic fencing for industrial and residential areas.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "U-Ditch & Box Culvert",
    description: "Complete drainage solutions with various sizes and specifications.",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Road Barrier & Slab",
    description: "Safety barriers and road slabs for infrastructure and road projects.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Custom Precast",
    description: "Custom precast products based on your project requirements and drawings.",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80",
  },
]

const calculatorBenefits = [
  {
    title: "Estimasi Instan",
    desc: "Dapatkan perkiraan kebutuhan dan biaya dalam hitungan detik.",
    icon: Calculator,
  },
  {
    title: "Akurat & Transparan",
    desc: "Perhitungan berbasis data produk dan spesifikasi yang akurat.",
    icon: ShieldCheck,
  },
  {
    title: "Hemat Waktu",
    desc: "Rencanakan proyek lebih cepat tanpa harus menunggu penawaran.",
    icon: Clock,
  },
  {
    title: "Perencanaan Lebih Baik",
    desc: "Bantu Anda membuat keputusan dengan data estimasi yang jelas.",
    icon: BarChart3,
  },
]

const technologyPoints = [
  "Daily Progress Report",
  "Installed Volume Tracking",
  "Quality Checklist",
  "Automatic Reporting",
  "Timeline Progress",
]

const stats = [
  { value: "150+", label: "Projects Completed", icon: Building2 },
  { value: "250,000+", label: "Precast Elements Installed", icon: Blocks },
  { value: "50+", label: "Expert Team Members", icon: Users },
  { value: "10+", label: "Years of Experience", icon: CalendarDays },
]



export default function Page() {
  return (
    <Fragment>
      <MagicLinkCallback />

      <main className="min-h-screen bg-[#fafaf9] text-foreground font-sans pb-16">

        {/* HERO SECTION */}
        <section id="home" className="relative w-full min-h-[550px] lg:min-h-[700px] flex items-center">
          {/* Background Image full width */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=80"
              alt="Construction site"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* White Gradient overlay on the left */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/95 to-transparent w-full md:w-[80%] lg:w-[65%]" />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white to-transparent w-full md:w-[60%] lg:w-[45%]" />

          {/* Content container */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 py-20 lg:py-32">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-black tracking-tight text-[#2f1b12] sm:text-6xl lg:text-[64px] lg:leading-[1.1]">
                Precast Concrete,
                <span className="block text-[#f97316] mt-2">Installed with Precision.</span>
              </h1>
              <p className="mt-6 text-[17px] leading-8 text-gray-700 max-w-lg">
                End-to-end procurement and installation of precast concrete systems, powered by real-time project monitoring technology.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="bg-[#f97316] text-white hover:bg-[#ea580c] h-14 px-8 text-base font-bold rounded-lg shadow-md"
                >
                  <Link href="#products">Explore Products</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-400 text-[#2f1b12] hover:bg-white h-14 px-8 text-base font-bold rounded-lg bg-transparent hover:border-gray-600">
                  <Link href="#calculator">Try Calculator</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE POINTS STRIP */}
        <div className="relative z-20 mx-auto max-w-7xl px-4 md:px-8 -mt-16 md:-mt-20">
          <div className="bg-white rounded-[20px] shadow-xl border border-gray-100 p-6 lg:p-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {valuePoints.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="flex gap-4 items-start px-2 lg:px-6 first:pl-0 last:pr-0"
                >
                  <div className="mt-1 flex-shrink-0 text-[#f97316]">
                    <Icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#2f1b12]">{title}</h2>
                    <p className="mt-1 text-[13px] leading-5 text-gray-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCTS SECTION */}
        <section id="products" className="w-full bg-[#f9fafb] px-4 py-16 md:px-8 md:py-24 border-b border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight text-[#1a120d] sm:text-[32px]">
                Our Precast Products
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-[15px] text-gray-500">
                Comprehensive solutions for various construction needs
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {productCards.map((card) => (
                <article
                  key={card.title}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-[15px] font-bold text-[#1a120d] leading-tight">{card.title}</h3>
                    <p className="mt-2 text-[13px] leading-5 text-gray-500 flex-grow">
                      {card.description}
                    </p>
                    <Link
                      href="/vendor/register"
                      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#f97316] transition-colors hover:text-[#ea580c]"
                    >
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CALCULATOR SECTION */}
        <section id="calculator" className="w-full bg-white px-4 py-16 md:px-8 md:py-24 border-b border-gray-100">
          <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
            <div className="pr-0 lg:pr-10">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f97316]">
                PRECAZ CALCULATOR
              </div>
              <h2 className="mt-4 text-[32px] font-black tracking-tight text-[#1a120d] leading-[1.2]">
                Hitung Kebutuhan & Biaya Proyek Secara Mandiri dan Cepat
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-gray-500">
                Gunakan kalkulator Precaz untuk mendapatkan estimasi kebutuhan material precast dan biaya proyek Anda secara instan.
              </p>

              <div className="mt-8 space-y-6">
                {calculatorBenefits.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#fed7aa] bg-[#fff7ed] text-[#f97316]">
                      <item.icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1a120d]">{item.title}</h3>
                      <p className="mt-1 text-[13px] leading-5 text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-3 rounded-lg border border-[#fed7aa] bg-[#fff7ed] p-4 text-[13px] text-[#9a3412]">
                <Lock className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                <p className="leading-relaxed">
                  Untuk melihat hasil perhitungan secara lengkap, detail spesifikasi produk, rincian biaya, dan laporan, Anda perlu <Link href="/vendor/register" className="font-bold hover:underline">Sign Up / Register</Link> terlebih dahulu.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl lg:p-10">
              <h3 className="mb-6 text-[17px] font-bold text-[#1a120d]">Masukkan Detail Proyek Anda</h3>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[13px] font-bold text-[#1a120d]">Jenis Produk</span>
                  <div className="rounded-md border border-gray-300 bg-white px-4 py-3 text-[13px] text-gray-500 flex justify-between items-center cursor-pointer hover:border-gray-400">
                    Pilih jenis produk
                    <ArrowRight className="h-3 w-3 rotate-90 opacity-50" />
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-[13px] font-bold text-[#1a120d]">Tipe / Spesifikasi</span>
                  <div className="rounded-md border border-gray-300 bg-white px-4 py-3 text-[13px] text-gray-500 flex justify-between items-center cursor-pointer hover:border-gray-400">
                    Pilih tipe / spesifikasi
                    <ArrowRight className="h-3 w-3 rotate-90 opacity-50" />
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-[13px] font-bold text-[#1a120d]">Satuan</span>
                  <div className="rounded-md border border-gray-300 bg-white px-4 py-3 text-[13px] text-gray-500 flex justify-between items-center cursor-pointer hover:border-gray-400">
                    Pilih satuan
                    <ArrowRight className="h-3 w-3 rotate-90 opacity-50" />
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-[13px] font-bold text-[#1a120d]">Jumlah / Volume</span>
                  <div className="rounded-md border border-gray-300 bg-white px-4 py-3 text-[13px] text-gray-400">
                    Masukkan jumlah / volume
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-[13px] font-bold text-[#1a120d]">Panjang (mm)</span>
                  <div className="rounded-md border border-gray-300 bg-white px-4 py-3 text-[13px] text-gray-400">
                    Masukkan panjang
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-[13px] font-bold text-[#1a120d]">Tinggi (mm)</span>
                  <div className="rounded-md border border-gray-300 bg-white px-4 py-3 text-[13px] text-gray-400">
                    Masukkan tinggi
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-[13px] font-bold text-[#1a120d]">Tebal (mm)</span>
                  <div className="rounded-md border border-gray-300 bg-white px-4 py-3 text-[13px] text-gray-400">
                    Masukkan tebal
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-[13px] font-bold text-[#1a120d]">Lokasi Proyek</span>
                  <div className="rounded-md border border-gray-300 bg-white px-4 py-3 text-[13px] text-gray-500 flex justify-between items-center cursor-pointer hover:border-gray-400">
                    Pilih lokasi proyek
                    <ArrowRight className="h-3 w-3 rotate-90 opacity-50" />
                  </div>
                </label>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-md border border-[#fed7aa] bg-[#fff7ed] px-4 py-3 text-[13px] text-[#9a3412]">
                <Lock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="font-medium text-center">Sign up atau login untuk melihat hasil perhitungan lengkap</span>
              </div>

              <Button
                className="mt-4 h-12 w-full bg-[#ea580c] text-[15px] font-bold text-white hover:bg-[#c2410c] shadow-sm rounded-md"
                asChild
              >
                <Link href="/login">
                  <Calculator className="mr-2 h-4 w-4" />
                  Hitung Sekarang
                </Link>
              </Button>

              <div className="mt-5 text-center text-[13px] text-gray-500">
                Sudah punya akun? <Link href="/login" className="font-bold text-[#ea580c] hover:underline">Login di sini</Link>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY SECTION */}
        <section id="technology" className="w-full bg-[#fcfcfc] px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f97316]">
                OUR TECHNOLOGY
              </div>
              <h2 className="mt-4 text-[32px] font-black tracking-tight text-[#1a120d]">
                Monitor Your Project in Real Time
              </h2>
              <p className="mt-5 text-[15px] leading-7 text-gray-500">
                Aplikasi monitoring kami memberikan visibilitas penuh dari progres proyek Anda. Kendalikan kualitas, waktu, dan biaya dalam satu platform.
              </p>

              <div className="mt-8 space-y-4">
                {technologyPoints.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-[#f97316] text-[#f97316] shrink-0">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-[15px] font-bold text-[#1a120d]">{item}</span>
                  </div>
                ))}
              </div>

              <Button asChild variant="outline" className="mt-10 border-[#f97316] text-[#f97316] font-bold hover:bg-[#fff7ed] hover:text-[#ea580c] h-12 px-8 rounded-md">
                <Link href="/login">See How It Works</Link>
              </Button>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
               <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                  alt="Dashboard Technology mockup"
                  fill
                  className="object-cover"
                />
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="bg-[#2f1b12] px-4 py-12 md:px-8 md:py-16 text-white border-b border-[#3e261b]">
          <div className="mx-auto max-w-7xl grid gap-8 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col md:flex-row items-center md:items-start gap-4 lg:justify-center text-center md:text-left ${i !== 0 ? 'lg:border-l lg:border-[#4a3023]' : ''}`}>
                <div className="text-[#f97316] shrink-0 lg:pl-8">
                  <stat.icon className="h-10 w-10 md:h-12 md:w-12" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black">{stat.value}</div>
                  <div className="text-[13px] md:text-[14px] font-medium text-white/70 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-[#ea580c] px-4 py-16 md:px-8 relative overflow-hidden">
          <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="border border-white/30 p-4 rounded-xl">
                <FileCheck className="h-10 w-10 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-3xl font-black text-white sm:text-[32px]">Ready to Start Your Project?</div>
                <p className="mt-2 text-base text-white/90">
                  Let's build something great together with Precaz.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-[#ea580c] hover:bg-gray-100 px-8 h-12 text-[15px] font-bold shadow-md rounded-md">
              <Link href="/login">Get a Quote Now</Link>
            </Button>
          </div>
        </section>

      </main>
    </Fragment>
  )
}
