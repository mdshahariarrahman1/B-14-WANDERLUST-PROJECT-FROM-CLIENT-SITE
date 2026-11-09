import Image from "next/image"
import Link from "next/link"
import type { SVGProps } from "react"

import { ArrowUpRightIcon } from "lucide-react"

function XLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function LinkedinLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Destinations", href: "#destinations" },
  { label: "My Bookings", href: "#bookings" },
  { label: "My Profile", href: "/profile" },
] as const

const SUPPORT_LINKS = [
  { label: "Help Center", href: "#help-center" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
] as const

const SOCIAL_LINKS = [
  { label: "X (formerly Twitter)", href: "#", icon: XLogoIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinLogoIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
] as const

const linkClassName =
  "text-lg font-light text-neutral-200 transition-colors hover:text-brand"

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-360 px-6 pb-6 pt-16 sm:pt-20 lg:px-20 lg:pt-28">
        <div>
          <Image
            src="/images/Wanderlast-1.png"
            alt="Wanderlast"
            width={542}
            height={80}
            className="h-auto w-full max-w-[320px] lg:h-20 lg:w-auto lg:max-w-none"
          />
          <p className="mt-6 text-[17px] font-light text-neutral-300">
            Your gateway to extraordinary travel experiences around the world.
          </p>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-18 lg:grid-cols-[460px_293px_294px_1fr] lg:gap-x-0">
          <div>
            <h2 className="text-[15px] uppercase tracking-[0.08em] text-white">
              Newsletter
            </h2>
            <p className="mt-4 text-sm font-light text-neutral-400">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <form className="mt-4 flex h-11.5 w-full max-w-[320px] items-center bg-[#1f1f1f]">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="Enter email"
                className="h-full w-full min-w-0 flex-1 bg-transparent px-4 text-base text-white outline-none placeholder:text-neutral-500"
              />
              <button
                type="button"
                aria-label="Subscribe to the newsletter"
                className="mr-3 inline-flex size-9 shrink-0 items-center justify-center text-white/90 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <ArrowUpRightIcon aria-hidden="true" className="size-5" />
              </button>
            </form>
          </div>

          <nav aria-label="Quick links">
            <h2 className="text-[15px] uppercase tracking-[0.08em] text-white">
              Quick Links
            </h2>
            <ul className="mt-6 space-y-4">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h2 className="text-[15px] uppercase tracking-[0.08em] text-white">
              Support
            </h2>
            <ul className="mt-6 space-y-4">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[15px] uppercase tracking-[0.08em] text-white">
              Contact Us
            </h2>
            <ul className="mt-6 space-y-4 text-lg font-light text-neutral-200">
              <li>
                <a href="tel:+17869011622" className={linkClassName}>
                  786 901 1622
                </a>
              </li>
              <li>
                <a href="mailto:info@wandarland.com" className={linkClassName}>
                  info@wandarland.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-neutral-800 pb-2 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-neutral-400">
            © 2026 Wanderlust. All rights reserved.
          </p>
          <ul className="flex items-center gap-9">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex text-neutral-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <social.icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
