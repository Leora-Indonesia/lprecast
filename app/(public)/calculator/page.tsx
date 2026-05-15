import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileCheck,
  FileSignature,
  Handshake,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Get a Quote | Precaz",
  description: "Get the right precast solution for your project. Request a quote today.",
}

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-white text-foreground font-sans">
      {/* HERO SECTION */}
      <section className="bg-[#1a120d] px-4 pt-16 pb-32 md:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2f1b12] opacity-50 skew-x-12 translate-x-32" />
        <div className="absolute inset-0 z-0 opacity-10">
           <Image
             src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80"
             alt="Construction"
             fill
             className="object-cover"
           />
        </div>

        <div className="mx-auto max-w-4xl relative z-10 text-center pt-8">
          <div className="text-[13px] font-medium text-white/50 mb-6 flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-[#ea580c] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Get a Quote</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#ea580c] text-[12px] font-bold uppercase tracking-wider mb-6 border border-white/20">
            <Calculator className="h-4 w-4" /> Estimate Your Project
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[54px] lg:leading-[1.1]">
            Get the Right Precast Solution for Your Project
          </h1>
          <p className="mt-6 text-[16px] leading-7 text-white/80 max-w-2xl mx-auto">
            Fill out the form below with your project details and product requirements. Our engineering team will review and provide a comprehensive proposal and quotation.
          </p>
        </div>
      </section>

      {/* FORM AND SIDEBAR SECTION */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 -mt-20 relative z-20 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] items-start">
          
          {/* MAIN FORM */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-10 lg:p-12">
            <form className="space-y-12">
              
              {/* Step 1: Project Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ea580c] text-white font-bold text-[16px]">
                    1
                  </div>
                  <h2 className="text-[22px] font-black text-[#2f1b12]">Project Information</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6 pl-0 md:pl-14">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#2f1b12]">Project Name *</label>
                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="e.g. Mega Warehouse Expansion" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#2f1b12]">Project Location *</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] bg-white text-gray-600 appearance-none">
                      <option value="">Select Province</option>
                      <option value="dki">DKI Jakarta</option>
                      <option value="jabar">Jawa Barat</option>
                      <option value="jateng">Jawa Tengah</option>
                      <option value="jatim">Jawa Timur</option>
                      <option value="banten">Banten</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#2f1b12]">Estimated Timeline *</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] bg-white text-gray-600 appearance-none">
                      <option value="">Select Timeline</option>
                      <option value="immediate">Immediate (Next 30 days)</option>
                      <option value="3months">1 - 3 Months</option>
                      <option value="6months">3 - 6 Months</option>
                      <option value="planning">Planning Phase</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#2f1b12]">Type of Project *</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] bg-white text-gray-600 appearance-none">
                      <option value="">Select Project Type</option>
                      <option value="industrial">Industrial / Factory</option>
                      <option value="warehouse">Warehouse / Logistics</option>
                      <option value="infrastructure">Infrastructure / Roads</option>
                      <option value="commercial">Commercial / Retail</option>
                      <option value="residential">Residential</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Product Requirements */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ea580c] text-white font-bold text-[16px]">
                    2
                  </div>
                  <h2 className="text-[22px] font-black text-[#2f1b12]">Product Requirements</h2>
                </div>
                
                <div className="pl-0 md:pl-14 space-y-6">
                  <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-5 relative">
                    <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#2f1b12]">Product Category *</label>
                        <select className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] bg-white text-gray-600 appearance-none">
                          <option value="">Select Category</option>
                          <option value="wall">Precast Wall Panel</option>
                          <option value="fence">Precast Fence Panel</option>
                          <option value="uditch">U-Ditch & Box Culvert</option>
                          <option value="barrier">Road Barrier & Slab</option>
                          <option value="custom">Custom Precast</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#2f1b12]">Quantity Needed (Approx.) *</label>
                        <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="e.g. 500 pcs or 1000m" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-[#2f1b12]">Dimensions & Specifications / Additional Notes</label>
                      <textarea className="w-full p-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] min-h-[100px] resize-y" placeholder="Detail any specific dimensions, concrete strength (K-rating), or special requirements..." />
                    </div>
                  </div>

                  <Button type="button" variant="outline" className="border-dashed border-2 border-gray-300 text-gray-500 hover:text-[#ea580c] hover:border-[#ea580c] hover:bg-[#fff7ed] w-full h-12 font-bold">
                    + Add Another Product
                  </Button>
                </div>
              </div>

              {/* Step 3: Contact Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ea580c] text-white font-bold text-[16px]">
                    3
                  </div>
                  <h2 className="text-[22px] font-black text-[#2f1b12]">Contact Information</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6 pl-0 md:pl-14">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#2f1b12]">Full Name *</label>
                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#2f1b12]">Company Name *</label>
                    <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="Your company" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#2f1b12]">Email Address *</label>
                    <input type="email" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="name@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#2f1b12]">Phone Number *</label>
                    <input type="tel" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="+62 8xx xxxx xxxx" />
                  </div>
                </div>
              </div>

              <div className="pl-0 md:pl-14 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacy" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#ea580c] focus:ring-[#ea580c]" />
                  <label htmlFor="privacy" className="text-[12px] text-gray-500 leading-relaxed max-w-sm">
                    By submitting this form, you agree to our <Link href="/privacy" className="text-[#ea580c] hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                <Button type="button" className="w-full sm:w-auto h-14 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-[15px] rounded-xl px-10 shrink-0 shadow-lg shadow-orange-500/20">
                  Request Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

            </form>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="bg-[#fafaf9] rounded-3xl p-6 md:p-8 border border-gray-100">
              <h3 className="text-[18px] font-black text-[#2f1b12] mb-6">How It Works</h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
                {[
                  { step: "01", title: "Submit Request", desc: "Isi form detail proyek dan kebutuhan produk.", icon: FileCheck },
                  { step: "02", title: "Review & Consult", desc: "Tim engineer kami akan menghubungi Anda untuk detail teknis.", icon: Search },
                  { step: "03", title: "Get Proposal", desc: "Terima penawaran resmi beserta spesifikasi detail.", icon: FileSignature },
                  { step: "04", title: "Deal & Execution", desc: "Persetujuan dan mulai proses suplai/instalasi.", icon: Handshake },
                ].map((item, i) => (
                  <div key={item.step} className="relative flex items-start gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-[#ea580c] text-[#ea580c] relative z-10 shadow-sm">
                      <item.icon className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <div className="pt-2">
                      <h4 className="text-[14px] font-bold text-[#2f1b12] mb-1">{item.title}</h4>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a120d] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10" />
               <div className="relative z-10">
                 <h3 className="text-[16px] font-bold mb-3">Butuh Bantuan Cepat?</h3>
                 <p className="text-[13px] text-white/70 mb-6 leading-relaxed">
                   Tim sales kami siap membantu Anda via WhatsApp.
                 </p>
                 <a href="#" className="inline-flex items-center justify-center w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors">
                   Chat via WhatsApp
                 </a>
               </div>
            </div>
          </aside>

        </div>
      </section>
    </main>
  )
}
