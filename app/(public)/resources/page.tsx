import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  Headset,
  Layers,
  LayoutGrid,
  Newspaper,
  PlayCircle,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "Resources | Precaz",
  description: "Knowledge Center & Resources. Access our comprehensive guides, specifications, and case studies.",
}

const categories = [
  { id: "all", label: "All Resources", icon: LayoutGrid, active: true },
  { id: "catalog", label: "Product Catalogs", icon: Layers },
  { id: "guide", label: "Installation Guides", icon: BookOpen },
  { id: "datasheet", label: "Technical Datasheets", icon: FileText },
  { id: "case", label: "Case Studies", icon: PlayCircle },
  { id: "article", label: "Articles & News", icon: Newspaper },
]

const resources = [
  {
    title: "Complete Precast Product Catalog 2026",
    type: "Catalog",
    date: "Jan 15, 2026",
    size: "12.5 MB",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
    desc: "Panduan lengkap seluruh lini produk precast Precaz beserta spesifikasi teknis dan panduan aplikasinya.",
  },
  {
    title: "Instalasi Precast Wall Panel: Best Practices",
    type: "Guide",
    date: "Feb 02, 2026",
    size: "8.2 MB",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    desc: "Langkah demi langkah prosedur instalasi precast wall panel untuk keamanan dan efisiensi maksimal.",
  },
  {
    title: "Technical Datasheet: U-Ditch & Cover",
    type: "Datasheet",
    date: "Mar 10, 2026",
    size: "4.1 MB",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    desc: "Spesifikasi material, dimensi, dan kapasitas beban untuk produk U-Ditch dan Cover Slab.",
  },
  {
    title: "Studi Kasus: Percepatan Proyek Gudang Logistik",
    type: "Case Study",
    date: "Mar 28, 2026",
    size: "Read Time: 5 Min",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    desc: "Bagaimana penggunaan precast menghemat waktu konstruksi hingga 40% pada proyek mega warehouse.",
  },
  {
    title: "Mengapa Beton Precast Lebih Ramah Lingkungan?",
    type: "Article",
    date: "Apr 05, 2026",
    size: "Read Time: 4 Min",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    desc: "Analisis pengurangan emisi karbon dan minimasi limbah konstruksi dengan metode precast.",
  },
  {
    title: "Panduan Memilih Mutu Beton (K-Rating) yang Tepat",
    type: "Guide",
    date: "Apr 18, 2026",
    size: "5.5 MB",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    desc: "Referensi teknis untuk menentukan spesifikasi kuat tekan beton sesuai kebutuhan struktur proyek Anda.",
  },
]

const faqs = [
  {
    question: "Apa keunggulan utama menggunakan produk precast Precaz?",
    answer: "Produk precast Precaz diproduksi di pabrik dengan kontrol kualitas yang sangat ketat (Quality Assured), sehingga menjamin konsistensi mutu beton. Selain itu, penggunaan precast mempercepat waktu pengerjaan di lapangan secara signifikan dan mengurangi limbah konstruksi."
  },
  {
    question: "Apakah Precaz melayani pemesanan precast custom (sesuai desain khusus)?",
    answer: "Ya, kami menyediakan layanan Custom Precast. Tim engineering kami siap berkolaborasi dengan Anda untuk mendesain dan memproduksi elemen precast yang disesuaikan dengan gambar kerja dan spesifikasi unik proyek Anda."
  },
  {
    question: "Bagaimana sistem pengiriman dan instalasi produk precast?",
    answer: "Kami menawarkan layanan End-to-End. Kami mengatur logistik pengiriman dari pabrik ke lokasi proyek Anda, dan tim instalator profesional kami siap melakukan pemasangan di lapangan dengan bantuan alat berat."
  },
  {
    question: "Bagaimana cara saya melacak progres pesanan dan proyek saya?",
    answer: "Precaz dilengkapi dengan platform digital untuk monitoring real-time. Setelah Anda menjadi klien, Anda akan mendapatkan akses ke Dashboard di mana Anda dapat melihat update harian, melacak volume terpasang, dan mengunduh laporan."
  },
  {
    question: "Apakah produk Precaz sudah memiliki sertifikasi?",
    answer: "Tentu. Seluruh produk precast kami telah melalui pengujian laboratorium independen dan memenuhi Standar Nasional Indonesia (SNI) serta standar internasional yang relevan untuk konstruksi beton."
  }
]

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white text-foreground font-sans">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[450px] lg:min-h-[500px] flex items-center pt-8 bg-[#2f1b12]">
        {/* Background Image full width with low opacity */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=2000&q=80"
            alt="Library of resources"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Content container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[13px] font-medium text-white/50 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-[#ea580c] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-bold">Resources</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-4">
              KNOWLEDGE CENTER
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[54px] lg:leading-[1.1]">
              Access Our Comprehensive Resources
            </h1>
            <p className="mt-6 text-[16px] leading-7 text-white/80 max-w-lg">
              Temukan katalog produk, panduan instalasi, spesifikasi teknis, dan artikel wawasan industri untuk mendukung kesuksesan proyek konstruksi Anda.
            </p>
            
            <div className="mt-10 relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full h-14 bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          
          {/* SIDEBAR */}
          <aside className="space-y-8">
            <div>
              <h2 className="text-[17px] font-black text-[#2f1b12] mb-5">Categories</h2>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
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
              <h3 className="text-[15px] font-bold text-[#2f1b12] mb-2">Subscribe to Newsletter</h3>
              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                Dapatkan update terbaru mengenai teknologi precast dan insight industri langsung ke inbox Anda.
              </p>
              <input type="email" placeholder="Email Address" className="w-full h-11 px-4 rounded-lg border border-gray-300 text-[13px] mb-3 focus:outline-none focus:border-[#ea580c]" />
              <Button className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold">
                Subscribe Now
              </Button>
            </div>
          </aside>

          {/* RESOURCES GRID */}
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-[28px] font-black text-[#2f1b12] leading-tight">Latest Resources</h2>
              <div className="flex gap-2">
                 {/* Sort/Filter placeholders if needed */}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {resources.map((item) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md group"
                >
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-bold text-[#ea580c] uppercase tracking-wider shadow-sm">
                      {item.type}
                    </div>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[12px] text-gray-500 font-medium mb-3">
                      <span>{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{item.size}</span>
                    </div>
                    <h3 className="text-[18px] font-bold text-[#2f1b12] leading-tight mb-3 group-hover:text-[#ea580c] transition-colors">{item.title}</h3>
                    <p className="text-[14px] leading-relaxed text-gray-600 flex-grow">
                      {item.desc}
                    </p>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      {item.type === "Case Study" || item.type === "Article" ? (
                        <Link href="#" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#ea580c] hover:text-[#c2410c]">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Button variant="outline" className="w-full border-gray-300 text-[#2f1b12] font-bold hover:bg-gray-50 hover:text-[#ea580c]">
                          <Download className="mr-2 h-4 w-4" /> Download File
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" className="border-gray-300 font-bold px-8 h-12">
                Load More Resources
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-[#fafaf9] border-t border-gray-100 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-black text-[#2f1b12] tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[15px] text-gray-500">
              Temukan jawaban untuk pertanyaan umum seputar layanan dan produk Precaz.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b-gray-100 px-2">
                  <AccordionTrigger className="text-[15px] font-bold text-[#2f1b12] hover:text-[#ea580c] text-left leading-relaxed py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] text-gray-600 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#ea580c] px-4 py-16 md:px-8 relative overflow-hidden">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="border border-white/30 p-4 rounded-xl">
              <Headset className="h-10 w-10 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-3xl font-black text-white sm:text-[32px]">Need More Information?</div>
              <p className="mt-2 text-base text-white/90">
                Our support team is always ready to help answer your specific technical questions.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-white text-[#ea580c] hover:bg-gray-100 px-8 h-12 text-[15px] font-bold shadow-md rounded-md shrink-0">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
