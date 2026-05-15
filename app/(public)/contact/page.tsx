import Image from "next/image"
import Link from "next/link"
import {
  Clock,
  Globe,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Contact Us | Precaz",
  description: "Get in touch with Precaz for precast concrete solutions and inquiries.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-foreground font-sans">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[400px] flex items-center pt-8 bg-[#f9fafb]">
        {/* Background Image full width with low opacity */}
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="Office building"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Content container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 py-16 text-center">
          <div className="text-[13px] font-medium text-gray-500 mb-6 flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-[#ea580c] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#1a120d] font-bold">Contact Us</span>
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ea580c] mb-4">
            LET'S CONNECT
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#2f1b12] sm:text-5xl lg:text-[54px] lg:leading-[1.1]">
            Get in Touch with Precaz
          </h1>
          <p className="mt-6 text-[16px] leading-7 text-gray-600 max-w-2xl mx-auto">
            We are here to answer any questions you may have about our precast concrete solutions, pricing, or partnerships. Reach out to us and we'll respond as soon as we can.
          </p>
        </div>
      </section>

      {/* CONTACT INFO & FORM SECTION */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-20 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          
          {/* LEFT: CONTACT INFO */}
          <div className="space-y-12">
            <div>
              <h2 className="text-[28px] font-black text-[#2f1b12] mb-8">Our Offices</h2>
              
              {/* Head Office */}
              <div className="mb-10">
                <h3 className="text-[18px] font-bold text-[#ea580c] mb-6 flex items-center gap-2">
                  <BuildingIcon className="h-5 w-5" /> Head Office
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-[#ea580c]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#2f1b12] mb-1">Address</h4>
                      <p className="text-[14px] text-gray-500 leading-relaxed">
                        Jl. Industri Raya No. 88<br/>
                        Kawasan Industri Delta Silicon 3<br/>
                        Cikarang, Bekasi 17530, Indonesia
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-[#ea580c]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#2f1b12] mb-1">Phone</h4>
                      <p className="text-[14px] text-gray-500 leading-relaxed">
                        +62 811-1000-0262<br/>
                        (021) 899-12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-[#ea580c]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#2f1b12] mb-1">Email</h4>
                      <p className="text-[14px] text-gray-500 leading-relaxed">
                        info@precaz.com<br/>
                        sales@precaz.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-[#ea580c]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#2f1b12] mb-1">Business Hours</h4>
                      <p className="text-[14px] text-gray-500 leading-relaxed">
                        Senin - Jumat: 08:00 - 17:00 WIB<br/>
                        Sabtu - Minggu: Tutup
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100 my-8" />

              {/* Manufacturing Plant */}
              <div>
                <h3 className="text-[18px] font-bold text-[#ea580c] mb-6 flex items-center gap-2">
                  <FactoryIcon className="h-5 w-5" /> Manufacturing Plant
                </h3>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#2f1b12] mb-1">Plant Address</h4>
                    <p className="text-[14px] text-gray-500 leading-relaxed">
                      Kawasan Industri Suryacipta<br/>
                      Jl. Surya Utama Kav. I-1<br/>
                      Karawang 41361, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-bold text-[#2f1b12] mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                {[Globe, MessageCircle, Mail, Link2].map((Icon, i) => (
                  <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#ea580c] hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-[28px] font-black text-[#2f1b12] mb-3">Send Us a Message</h2>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#2f1b12]">First Name *</label>
                  <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#2f1b12]">Last Name *</label>
                  <input type="text" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="Doe" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#2f1b12]">Email Address *</label>
                  <input type="email" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="john@company.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#2f1b12]">Phone Number</label>
                  <input type="tel" className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]" placeholder="+62 812 3456 7890" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#2f1b12]">Subject *</label>
                <select className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] bg-white text-gray-600 appearance-none">
                  <option value="">Select a subject...</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#2f1b12]">Message *</label>
                <textarea className="w-full p-4 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] min-h-[150px] resize-y" placeholder="Tell us about your project or inquiry..." />
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" id="privacy" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#ea580c] focus:ring-[#ea580c]" />
                <label htmlFor="privacy" className="text-[13px] text-gray-500 leading-relaxed">
                  I agree to the <Link href="/privacy" className="text-[#ea580c] hover:underline">Privacy Policy</Link> and consent to having Precaz store my submitted information to respond to my inquiry.
                </label>
              </div>

              <Button type="button" className="w-full h-14 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-[15px] rounded-xl">
                Send Message <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="w-full h-[400px] bg-gray-200 relative">
         <Image 
           src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2000&q=80" 
           alt="Map location" 
           fill 
           className="object-cover opacity-80" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="h-16 w-16 bg-[#ea580c] text-white rounded-full flex items-center justify-center shadow-xl mb-4 border-4 border-white animate-bounce">
              <MapPin className="h-8 w-8" />
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-[#2f1b12] text-[14px]">
              Precaz Head Office
            </div>
         </div>
      </section>
    </main>
  )
}

function BuildingIcon(props: any) {
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
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

function FactoryIcon(props: any) {
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
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </svg>
  )
}
