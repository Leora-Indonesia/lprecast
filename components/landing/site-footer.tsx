import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"

const footerLinks = {
  quickLinks: ["Home", "Products", "Calculator", "Technology", "Projects", "About Us", "Contact"],
  resources: ["Product Catalog", "Installation Guide", "Case Studies", "FAQ", "News & Articles"],
}

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-white px-4 pt-16 md:px-8 border-t border-gray-200">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr_1.2fr] pb-16">
        <div className="pr-0 lg:pr-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center text-[#f97316]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-2xl font-black tracking-tight text-[#1a120d]">precaz</div>
          </Link>
          <p className="mt-5 text-[13px] leading-6 text-gray-500">
            Precaz is a leading precast concrete specialist with expertise in procurement and installation. We combine field experience with modern technology to deliver superior results.
          </p>
          <div className="mt-6 flex gap-3 text-[#1a120d]">
            <a href="#" className="h-8 w-8 rounded-full bg-[#1a120d] text-white flex items-center justify-center hover:bg-[#f97316] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-[#1a120d] text-white flex items-center justify-center hover:bg-[#f97316] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-[#1a120d] text-white flex items-center justify-center hover:bg-[#f97316] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold text-[#1a120d]">Quick Links</h3>
          <div className="mt-5 space-y-3 text-[13px] text-gray-500 font-medium">
            {footerLinks.quickLinks.map((item) => (
              <div key={item}>
                <Link href="#" className="hover:text-[#f97316] transition-colors">{item}</Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold text-[#1a120d]">Resources</h3>
          <div className="mt-5 space-y-3 text-[13px] text-gray-500 font-medium">
            {footerLinks.resources.map((item) => (
              <div key={item}>
                <Link href="#" className="hover:text-[#f97316] transition-colors">{item}</Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold text-[#1a120d]">Calculator Access</h3>
          <p className="mt-5 text-[13px] leading-6 text-gray-500">
            Login atau daftar untuk menyimpan perhitungan dan melihat riwayat proyek.
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline" size="sm" className="border-gray-300 text-[#1a120d] hover:bg-gray-50 flex-1 font-bold">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="bg-[#ea580c] text-white hover:bg-[#c2410c] flex-1 font-bold border-none">
              <Link href="/vendor/register">Sign Up</Link>
            </Button>
          </div>
          <div className="mt-3 text-[11px] text-gray-500 flex items-center gap-1.5 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Akses gratis
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 ml-1" />
            Tanpa kartu kredit
          </div>
        </div>

        <div className="pl-0 lg:pl-4">
          <h3 className="text-[15px] font-bold text-[#1a120d]">Contact Us</h3>
          <div className="mt-5 space-y-4 text-[13px] text-[#1a120d] font-medium">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#ea580c] shrink-0" strokeWidth={2.5} />
              <span>+62 811-1000-0262</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#ea580c] shrink-0" strokeWidth={2.5} />
              <span>info@precaz.com</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[#ea580c] shrink-0" strokeWidth={2.5} />
              <span className="leading-5 text-gray-500">Jl. Industri Raya No. 88<br/>Kawasan Industri Delta Silicon 3<br/>Cikarang, Bekasi 17530<br/>Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#2f1b12] -mx-4 md:-mx-8 px-4 md:px-8 py-6 text-[13px] text-white/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>&copy; {new Date().getFullYear()} Precaz. All Rights Reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms/client" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
