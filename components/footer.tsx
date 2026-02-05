import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PollenLogo } from "@/components/shared/pollen-logo"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#002244] via-[#003366] to-[#004488] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[140%] bg-[#00CC66]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[140%] bg-[#00CC66]/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-grid-8"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Newsletter Section */}
        {/* <div className="py-16 border-b border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-white/70 mb-8">
              Subscribe to our newsletter for the latest news and insights on financial inclusion and technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Your email address"
                type="email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00CC66]"
              />
              <Button className="bg-[#00CC66] hover:bg-[#00BB55] text-white rounded-full group transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-[#00CC66]/20">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div> */}

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <PollenLogo size={40} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="text-2xl font-black tracking-tight text-white">
                  Pollen<span className="text-[#4C4EFB]">AI</span>
                </span>
              </Link>
              <p className="text-white/70">Empowering financial inclusion with AI and blockchain technology.</p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center">
                    <ChevronLink />
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-white/70 hover:text-white transition-colors flex items-center">
                    <ChevronLink />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-white/70 hover:text-white transition-colors flex items-center">
                    <ChevronLink />
                    Services
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/innovations"
                    className="text-white/70 hover:text-white transition-colors flex items-center"
                  >
                    <ChevronLink />
                    Innovations
                  </Link>
                </li> */}
                <li>
                  <Link href="/blog" className="text-white/70 hover:text-white transition-colors flex items-center">
                    <ChevronLink />
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/services"
                    className="text-white/70 hover:text-white transition-colors flex items-center"
                  >
                    <ChevronLink />
                    Digital Loans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-white/70 hover:text-white transition-colors flex items-center"
                  >
                    <ChevronLink />
                    Village Accounts
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/services/climate-financing"
                    className="text-white/70 hover:text-white transition-colors flex items-center"
                  >
                    <ChevronLink />
                    Climate Financing
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/services/credit-scoring"
                    className="text-white/70 hover:text-white transition-colors flex items-center"
                  >
                    <ChevronLink />
                    AI Credit Scoring
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Contact Us</h4>
              <address className="not-italic text-white/70 space-y-4">
                <p className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-[#00CC66] flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    123 Innovation Street
                    <br />
                    Lusaka, Zambia
                  </span>
                </p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-[#00CC66] flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>support@pollenzm.com</span>
                </p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-[#00CC66] flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+260964499767</span>
                </p>
              </address>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/10 py-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Pollen AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function ChevronLink() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-2 text-[#00CC66]"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

