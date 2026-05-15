import Link from "next/link"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Products", href: "/products" },
  { label: "Calculator", href: "/calculator" },
  { label: "Technology", href: "/technology" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center text-[#f97316]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-2xl font-black tracking-tight text-[#1a120d]">precaz</div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[15px] font-bold transition-colors hover:text-[#f97316] py-1 ${item.label === "Home" ? "text-[#f97316] border-b-2 border-[#f97316]" : "text-[#1a120d]"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="hidden sm:inline-flex border-gray-300 text-[#1a120d] font-bold hover:bg-gray-50 h-10 px-6 rounded-md">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="bg-[#f97316] text-white font-bold hover:bg-[#ea580c] h-10 px-6 rounded-md"
          >
            <Link href="/vendor/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
