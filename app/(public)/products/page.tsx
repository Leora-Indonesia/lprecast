import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BoxSelect,
  CheckCircle2,
  Columns,
  Download,
  GripHorizontal,
  Headset,
  Layers,
  LayoutGrid,
  Leaf,
  MapPin,
  PackageSearch,
  PanelTop,
  Puzzle,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Timer,
  TrendingDown,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Our Precast Concrete Products | Precaz",
  description: "Complete range of precast concrete solutions for all types of construction projects.",
}

const categories = [
  { id: "all", label: "All Products", icon: LayoutGrid, active: true },
  { id: "wall", label: "Precast Wall Panel", icon: PanelTop },
  { id: "fence", label: "Precast Fence Panel", icon: GripHorizontal },
  { id: "ditch", label: "U-Ditch & Box Culvert", icon: BoxSelect },
  { id: "barrier", label: "Road Barrier & Slab", icon: ShieldAlert },
  { id: "piles", label: "Piles & Foundations", icon: Layers },
  { id: "beams", label: "Beams & Columns", icon: Columns },
  { id: "lintel", label: "Precast Lintel", icon: PackageSearch },
  { id: "manhole", label: "Manhole & Cover Slab", icon: TargetIcon },
  { id: "retaining", label: "Retaining Wall", icon: LayoutGrid },
  { id: "drainage", label: "Drainage System", icon: BoxSelect },
  { id: "infrastructure", label: "Infrastructure Products", icon: MapPin },
  { id: "custom", label: "Custom Precast", icon: Puzzle },
]

function TargetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

const products = [
  {
    title: "Precast Wall Panel",
    desc: "Ideal for warehouse, factory, and building wall solutions.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Precast Fence Panel",
    desc: "Durable and aesthetic fencing for industrial and residential areas.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "U-Ditch & Box Culvert",
    desc: "Complete drainage solutions with various sizes and specifications.",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Road Barrier & Slab",
    desc: "Safety barriers and road slabs for infrastructure and road projects.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Piles & Foundations",
    desc: "Strong foundation solutions for heavy-load and deep structure systems.",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Beams & Columns",
    desc: "Structural precast elements for building and infrastructure projects.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Precast Lintel",
    desc: "High-strength lintel for doors, windows, and structural openings.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a104fa285?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Manhole & Cover Slab",
    desc: "Reliable access solutions for drainage and utility applications.",
    image: "https://images.unsplash.com/photo-1616080345098-b80c102c9bc3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Retaining Wall",
    desc: "Earth retention systems for slope, road, and land stabilization.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Drainage System",
    desc: "Efficient water management solutions for various infrastructure needs.",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Infrastructure Products",
    desc: "Various precast products for bridges, culverts, and public infrastructure.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Custom Precast",
    desc: "Custom precast products based on your project requirements and drawings.",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80",
  },
]

const features = [
  {
    title: "Faster Construction",
    desc: "Reduces on-site work and installation time significantly.",
    icon: Timer,
  },
  {
    title: "Consistent Quality",
    desc: "Manufactured in controlled factory environment with strict quality control.",
    icon: CheckCircle2,
  },
  {
    title: "Cost Efficient",
    desc: "Lower labor cost and minimal material waste on-site.",
    icon: TrendingDown,
  },
  {
    title: "Strong & Durable",
    desc: "Designed to withstand structural loads and harsh environments.",
    icon: ShieldCheck,
  },
]

const whyChooseUs = [
  {
    title: "Quality Assured",
    desc: "Every product meets national and international standards.",
    icon: ShieldCheck,
  },
  {
    title: "Precision Manufacturing",
    desc: "Advanced production technology for accurate and consistent results.",
    icon: TargetIcon,
  },
  {
    title: "On-Time Delivery",
    desc: "Efficient planning and logistics to meet your project schedule.",
    icon: Timer,
  },
  {
    title: "Technical Support",
    desc: "Expert team ready to support your project from start to finish.",
    icon: Headset,
  },
  {
    title: "Sustainable Solution",
    desc: "Environmentally friendly materials and efficient production process.",
    icon: Leaf,
  },
  {
    title: "Customizable",
    desc: "Flexible solutions tailored to your specific project requirements.",
    icon: Wrench,
  },
]

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white text-foreground font-sans">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[450px] lg:min-h-[500px] flex items-center pt-8">
        {/* Background Image full width */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80"
            alt="Precast concrete stacking"
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
              <span className="text-[#1a120d] font-bold">Products</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#2f1b12] sm:text-5xl lg:text-[54px] lg:leading-[1.1]">
              Our Precast Concrete Products
            </h1>
            <p className="mt-6 text-[16px] leading-7 text-gray-700">
              Engineered for strength, built for efficiency. Precaz provides high-quality precast concrete products designed to meet various construction needs with precision and durability.
            </p>
          </div>
        </div>
      </section>

      {/* HERO BADGES STRIP */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 md:px-8 -mt-10 mb-16">
        <div className="bg-white rounded-[20px] shadow-xl border border-gray-100 p-6 lg:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-gray-200">
            {[
              { title: "High Quality", subtitle: "Standards", icon: ShieldCheck },
              { title: "Engineered for", subtitle: "Performance", icon: Settings },
              { title: "Faster Installation", subtitle: "Time", icon: Timer },
              { title: "Cost Effective", subtitle: "Solutions", icon: TrendingDown },
            ].map((badge) => (
              <div key={badge.title} className="flex gap-4 items-center px-2 lg:px-6 first:pl-0 last:pr-0 pt-4 sm:pt-0">
                <div className="text-[#ea580c]">
                  <badge.icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <div className="text-[14px] font-bold text-[#2f1b12] leading-tight">
                  {badge.title}<br/>{badge.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CATALOG SECTION */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-20">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          
          {/* SIDEBAR */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <h2 className="text-[17px] font-black text-[#2f1b12] mb-4">Product Categories</h2>
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
              <h3 className="text-[15px] font-bold text-[#2f1b12] mb-2">Need a Custom Solution?</h3>
              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                We provide custom precast products based on your project requirements.
              </p>
              <Button variant="outline" className="w-full border-[#ea580c] text-[#ea580c] hover:bg-[#fff7ed] hover:text-[#c2410c] font-bold">
                Request Custom Precast
              </Button>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[24px] font-black text-[#2f1b12]">All Precast Products</h2>
                <p className="text-[14px] text-gray-500 mt-1">Complete range of precast concrete solutions for all types of construction projects.</p>
              </div>
              <Button variant="ghost" className="hidden md:flex text-[#ea580c] font-bold hover:text-[#c2410c] hover:bg-[#fff7ed] gap-2">
                Download Catalog <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.title}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md group"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-[16px] font-bold text-[#2f1b12] leading-tight">{product.title}</h3>
                    <p className="mt-2 text-[13px] leading-5 text-gray-500 flex-grow">
                      {product.desc}
                    </p>
                    <Link
                      href="#featured"
                      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#ea580c] transition-colors hover:text-[#c2410c]"
                    >
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PRODUCT DETAIL */}
      <section id="featured" className="border-t border-gray-100 bg-[#fafaf9] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[1fr_1.2fr_0.8fr] gap-10 lg:gap-12">
            
            {/* Features list */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-2">
                FEATURED PRODUCT
              </div>
              <h2 className="text-[32px] font-black text-[#2f1b12] leading-tight mb-4">
                Precast Wall Panel
              </h2>
              <p className="text-[14px] leading-6 text-gray-600 mb-8">
                High-quality precast wall panels designed for strength, durability, and faster installation on every project.
              </p>

              <div className="space-y-6">
                {features.map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="mt-1 text-[#ea580c] shrink-0">
                      <item.icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#2f1b12]">{item.title}</h4>
                      <p className="mt-1 text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="flex flex-col gap-3">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80"
                  alt="Precast Wall Panel Main"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`relative aspect-square rounded-lg overflow-hidden bg-gray-200 cursor-pointer ${i === 1 ? 'ring-2 ring-[#ea580c]' : ''}`}>
                     <Image
                        src={`https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=200&q=80`}
                        alt={`Thumbnail ${i}`}
                        fill
                        className="object-cover"
                      />
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
              <h3 className="text-[17px] font-black text-[#2f1b12] mb-6">Specifications</h3>
              <div className="space-y-0 border-t border-gray-100 flex-grow">
                {[
                  { label: "Thickness", value: "75 mm - 200 mm" },
                  { label: "Height", value: "Up to 3,600 mm" },
                  { label: "Length", value: "Up to 6,000 mm" },
                  { label: "Concrete Strength", value: "K-300 - K-500" },
                  { label: "Reinforcement", value: "High-tensile steel" },
                  { label: "Surface Finish", value: "Smooth / Textured" },
                  { label: "Application", value: "Wall, Partition, Facade" },
                ].map((row, i) => (
                  <div key={row.label} className="flex py-3 border-b border-gray-100 text-[13px]">
                    <span className="w-1/2 text-gray-500 font-medium">{row.label}</span>
                    <span className="w-1/2 text-[#2f1b12] font-bold">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Button className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold h-12 shadow-md">
                  Request a Quote
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-[#2f1b12] hover:bg-gray-50 font-bold h-12">
                  <Download className="mr-2 h-4 w-4" /> Download Datasheet
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[32px] font-black text-[#2f1b12] tracking-tight mb-4">
              Why Choose Precaz Products?
            </h2>
            <p className="text-[15px] text-gray-500">
              We deliver more than just precast. We deliver reliability, quality, and value.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#fff7ed] text-[#ea580c] mb-5">
                  <item.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-[14px] font-bold text-[#2f1b12] mb-2">{item.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
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
              <Headset className="h-10 w-10 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-3xl font-black text-white sm:text-[32px]">Can't Find What You Need?</div>
              <p className="mt-2 text-base text-white/90">
                Our engineering team is ready to help you find the right precast solution.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-white text-[#ea580c] hover:bg-gray-100 px-8 h-12 text-[15px] font-bold shadow-md rounded-md shrink-0">
            <Link href="/contact">Contact Our Engineer</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
