import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
import {
  ArrowRight,
  BarChart3,
  Blocks,
  Building2,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  Eye,
  Factory,
  FileCheck,
  FileEdit,
  Leaf,
  Monitor,
  Shield,
  ShieldCheck,
  Target,
  Truck,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About Us | Precaz",
  description: "Learn more about Precaz - Building the Future with Precision.",
}

const stats = [
  { value: "150+", label: "Projects Completed", icon: Building2 },
  { value: "250,000+", label: "Precast Elements Supplied", icon: Blocks },
  { value: "50+", label: "Expert Team Members", icon: Users },
  { value: "10+", label: "Years of Experience", icon: CalendarDays },
]

const expertise = [
  {
    title: "Design Support",
    desc: "Membantu perencanaan desain precast yang efektif dan efisien.",
    icon: FileEdit,
  },
  {
    title: "Manufacturing",
    desc: "Proses produksi modern dengan kontrol kualitas berstandar tinggi.",
    icon: Factory,
  },
  {
    title: "Logistics",
    desc: "Pengiriman tepat waktu dengan sistem manajemen logistik yang andal.",
    icon: Truck,
  },
  {
    title: "Installation",
    desc: "Instalasi profesional oleh tim berpengalaman di lapangan.",
    icon: Building2, // Using Building2 as proxy for crane/installation
  },
  {
    title: "Monitoring",
    desc: "Pantau progres proyek secara real-time melalui aplikasi Precaz.",
    icon: Monitor,
  },
]

const team = [
  {
    name: "Andi Pratama",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Dewi Lestari",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Budi Santoso",
    role: "Head of Engineering",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Fajar Nugroho",
    role: "Head of Technology",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  },
]

const process = [
  {
    step: 1,
    title: "Understand",
    desc: "Kami memahami kebutuhan dan tujuan proyek Anda.",
    icon: FileCheck,
  },
  {
    step: 2,
    title: "Plan",
    desc: "Perencanaan detail dengan teknologi dan data akurat.",
    icon: BarChart3,
  },
  {
    step: 3,
    title: "Execute",
    desc: "Produksi dan instalasi dengan standar kualitas tinggi.",
    icon: Factory,
  },
  {
    step: 4,
    title: "Deliver",
    desc: "Serahkan hasil terbaik dengan monitoring real-time.",
    icon: CheckCircle2,
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-foreground font-sans pb-16">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[500px] lg:min-h-[600px] flex items-center">
        {/* Background Image full width */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80"
            alt="Construction workers"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* White Gradient overlay on the left */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/95 to-transparent w-full md:w-[80%] lg:w-[65%]" />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white to-transparent w-full md:w-[60%] lg:w-[45%]" />

        {/* Content container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 py-20 lg:py-28">
          <div className="max-w-xl">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f97316]">
              ABOUT PRECAZ
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-tight text-[#2f1b12] sm:text-6xl lg:text-[60px] lg:leading-[1.1]">
              Building the Future <span className="text-[#ea580c]">with Precision</span>
            </h1>
            <p className="mt-6 text-[17px] leading-8 text-gray-700">
              Precaz adalah solusi lengkap untuk pengadaan dan instalasi precast concrete dengan dukungan teknologi monitoring real-time.
            </p>
            <div className="mt-8">
              <Button
                asChild
                className="bg-[#ea580c] text-white hover:bg-[#c2410c] h-14 px-8 text-base font-bold rounded-lg shadow-md"
              >
                <Link href="#contact">Get to Know Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION STRIP */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 md:px-8 -mt-16 md:-mt-16">
        <div className="bg-white rounded-[20px] shadow-xl border border-gray-100 p-8 lg:p-10">
          <div className="grid gap-10 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="flex gap-5 items-start px-2 lg:px-8 first:pl-0">
              <div className="mt-1 flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#ffedd5] text-[#ea580c]">
                <Target className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[19px] font-black text-[#2f1b12]">Our Mission</h2>
                <p className="mt-2 text-[14px] leading-6 text-gray-500">
                  Menyediakan solusi precast terintegrasi yang inovatif, efisien, dan berkelanjutan untuk mendukung pembangunan konstruksi modern di Indonesia.
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-start px-2 lg:px-8 last:pr-0 pt-8 md:pt-0">
              <div className="mt-1 flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#ffedd5] text-[#ea580c]">
                <Eye className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[19px] font-black text-[#2f1b12]">Our Vision</h2>
                <p className="mt-2 text-[14px] leading-6 text-gray-500">
                  Menjadi mitra terpercaya dalam industri konstruksi precast dengan teknologi terdepan dan layanan yang memberikan nilai tambah bagi setiap proyek.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <section className="bg-[#1a120d] px-4 py-16 md:px-8 md:py-20 text-white mt-16 md:mt-24">
        <div className="mx-auto max-w-7xl grid gap-10 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col md:flex-row items-center md:items-start gap-5 lg:justify-center text-center md:text-left ${i !== 0 ? 'lg:border-l lg:border-[#3e261b]' : ''}`}>
              <div className="text-[#ea580c] shrink-0 lg:pl-10">
                <stat.icon className="h-10 w-10 md:h-12 md:w-12" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-3xl md:text-[34px] font-black">{stat.value}</div>
                <div className="text-[13px] md:text-[14px] font-medium text-white/70 mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE PRECAZ */}
      <section className="w-full bg-[#fafaf9] px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c]">
              WHY CHOOSE PRECAZ
            </div>
            <h2 className="mt-4 text-[36px] font-black tracking-tight text-[#2f1b12] leading-[1.1]">
              Where Expertise Meets Innovation
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-gray-500">
              Kami menggabungkan keahlian industri precast dengan teknologi digital untuk memberikan solusi terbaik bagi setiap kebutuhan proyek Anda.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { title: "Solusi Terintegrasi", desc: "Pengadaan hingga instalasi dalam satu layanan." },
                { title: "Kualitas Terjamin", desc: "Produk precast berkualitas tinggi sesuai standar." },
                { title: "Teknologi Real-time", desc: "Monitoring proyek secara akurat dan transparan." },
                { title: "Tim Profesional", desc: "Didukung oleh tenaga ahli berpengalaman." },
                { title: "Komitmen Keberlanjutan", desc: "Proses produksi yang ramah lingkungan." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border border-[#ea580c] text-[#ea580c] shrink-0 bg-[#fff7ed]">
                    <CheckSquare className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <div className="text-[14px] leading-relaxed">
                    <span className="font-bold text-[#2f1b12]">{item.title}:</span> <span className="text-gray-500">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80"
                alt="Precast products"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 md:bottom-8 md:-left-12 bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-[320px] border border-gray-100 flex gap-4 items-start">
               <div className="flex-shrink-0 text-[#ea580c]">
                 <Shield className="h-10 w-10" strokeWidth={1.5} />
               </div>
               <div>
                 <h3 className="font-bold text-[16px] text-[#2f1b12]">Quality You Can Trust</h3>
                 <p className="mt-2 text-[12px] leading-5 text-gray-500">
                   Setiap produk precast kami diproduksi dengan kontrol kualitas ketat untuk memastikan kekuatan, ketahanan, dan presisi terbaik.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR EXPERTISE */}
      <section className="w-full bg-white px-4 py-20 md:px-8 md:py-28 border-t border-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c]">
            OUR EXPERTISE
          </div>
          <h2 className="mt-4 text-[36px] font-black tracking-tight text-[#2f1b12]">
            End-to-End Precast Solutions
          </h2>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {expertise.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#ea580c] mb-6">
                  <item.icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-bold text-[#2f1b12]">{item.title}</h3>
                <p className="mt-3 text-[13px] leading-5 text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR COMMITMENT */}
      <section className="w-full bg-[#f0f4f8] px-4 py-20 md:px-8 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c]">
              OUR COMMITMENT
            </div>
            <h2 className="mt-4 text-[36px] font-black tracking-tight text-[#2f1b12] leading-[1.1]">
              Building Better,<br/>Building Sustainable
            </h2>
            <p className="mt-6 text-[15px] leading-7 text-gray-600 max-w-lg">
              Precaz berkomitmen untuk mendukung pembangunan berkelanjutan melalui inovasi produk dan proses yang ramah lingkungan.
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                { title: "Material Berkualitas", desc: "Menggunakan material terbaik yang kuat dan tahan lama.", icon: ShieldCheck },
                { title: "Proses Ramah Lingkungan", desc: "Produksi efisien untuk mengurangi emisi dan limbah.", icon: Factory },
                { title: "Mendukung Konstruksi Hijau", desc: "Produk precast yang mendukung sertifikasi bangunan hijau.", icon: Leaf },
              ].map((item) => (
                <div key={item.title}>
                   <div className="text-[#ea580c] mb-4">
                     <item.icon className="h-7 w-7" strokeWidth={1.5} />
                   </div>
                   <h3 className="text-[14px] font-bold text-[#2f1b12] leading-tight mb-2">{item.title}</h3>
                   <p className="text-[12px] leading-5 text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:mr-[-10vw]">
             <div className="relative w-full aspect-[4/3] rounded-l-[3rem] overflow-hidden shadow-2xl">
               <Image
                 src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                 alt="Sustainable building"
                 fill
                 className="object-cover"
               />
             </div>
             {/* Floating Badge */}
             <div className="absolute top-10 -left-6 md:top-20 md:-left-12 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col items-center justify-center min-w-[180px]">
               <div className="flex items-center gap-2 text-green-600 mb-2">
                 <Leaf className="h-5 w-5" strokeWidth={2} />
                 <span className="font-bold text-[13px] uppercase tracking-wider">Sustainable Impact</span>
               </div>
               <div className="text-[48px] font-black text-[#2f1b12] leading-none mb-2">30%</div>
               <p className="text-[11px] text-center text-gray-500 leading-tight">Pengurangan limbah konstruksi<br/>dengan solusi precast.</p>
             </div>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="w-full bg-white px-4 py-20 md:px-8 md:py-28">
         <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 items-center">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c]">
                OUR TEAM
              </div>
              <h2 className="mt-4 text-[36px] font-black tracking-tight text-[#2f1b12] leading-[1.1]">
                People Behind Our Success
              </h2>
              <p className="mt-6 text-[15px] leading-7 text-gray-500">
                Kami memiliki tim ahli yang berdedikasi untuk memberikan hasil terbaik di setiap proyek.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {team.map((member) => (
                 <div key={member.name} className="flex flex-col group">
                   <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gray-100">
                     <Image
                       src={member.image}
                       alt={member.name}
                       fill
                       className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale hover:grayscale-0"
                     />
                   </div>
                   <h3 className="text-[15px] font-bold text-[#2f1b12]">{member.name}</h3>
                   <p className="text-[12px] text-gray-500 mt-1">{member.role}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* OUR PROCESS */}
      <section className="w-full bg-[#fafaf9] px-4 py-20 md:px-8 md:py-28 border-t border-gray-100">
         <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c]">
                OUR PROCESS
              </div>
              <h2 className="mt-4 text-[36px] font-black tracking-tight text-[#2f1b12]">
                How We Deliver Excellence
              </h2>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start relative">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[#fed7aa] z-0" />

               {process.map((step, index) => (
                 <Fragment key={step.step}>
                   <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/4 mb-10 md:mb-0 px-4">
                     <div className="relative mb-6">
                       <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white border-2 border-[#ea580c] text-[#ea580c] shadow-lg">
                         <step.icon className="h-8 w-8" strokeWidth={1.5} />
                       </div>
                       <div className="absolute -bottom-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#ea580c] text-white font-bold text-[14px] border-[3px] border-[#fafaf9]">
                         {step.step}
                       </div>
                     </div>
                     <h3 className="text-[17px] font-bold text-[#2f1b12] mb-3">{step.title}</h3>
                     <p className="text-[13px] leading-5 text-gray-500 max-w-[200px]">
                       {step.desc}
                     </p>
                   </div>
                   {index < process.length - 1 && (
                     <div className="hidden md:flex absolute top-[40px] z-10 items-center justify-center text-[#ea580c]" style={{ left: `${(index + 1) * 25}%`, transform: 'translateX(-50%)' }}>
                       <ArrowRight className="h-5 w-5 bg-[#fafaf9] px-1" />
                     </div>
                   )}
                 </Fragment>
               ))}
            </div>
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
              <div className="text-3xl font-black text-white sm:text-[32px]">Let's Build Something Great Together</div>
              <p className="mt-2 text-base text-white/90">
                Hubungi kami hari ini untuk konsultasi gratis dan solusi terbaik untuk proyek Anda.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-white text-[#ea580c] hover:bg-gray-100 px-8 h-12 text-[15px] font-bold shadow-md rounded-md shrink-0">
            <Link href="/contact">Get a Quote Now</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
