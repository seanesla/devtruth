"use client"

import { useRef, useEffect, useState } from "react"
import { Link } from "next-view-transitions"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useSceneMode } from "@/lib/scene-context"
import { useNavbar } from "@/lib/navbar-context"
import { LiquidGlassNavbar } from "@/components/liquid-glass-navbar"
import { Logo } from "@/components/logo"
import { EnterButton } from "@/components/enter-button"
import { cn } from "@/lib/utils"

// Link configurations for each mode
const landingLinks = [
  { id: "features", href: "#features", label: "Features" },
  { id: "how-it-works", href: "#how-it-works", label: "How It Works" },
]

const dashboardLinks = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard", exact: true },
  { id: "recordings", href: "/dashboard/recordings", label: "Recordings", exact: false },
  { id: "analytics", href: "/dashboard/analytics", label: "Analytics", exact: false },
  { id: "settings", href: "/dashboard/settings", label: "Settings", exact: true },
]

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
}

function NavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        "relative text-sm transition-colors px-3 py-1",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  )
}

function LandingNavLinks() {
  const { activeSection } = useNavbar()

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {landingLinks.map((link) => (
        <NavLink
          key={link.id}
          href={link.href}
          label={link.label}
          isActive={activeSection === link.id}
        />
      ))}
      <div className="ml-2">
        <EnterButton variant="nav" />
      </div>
    </motion.div>
  )
}

function DashboardNavLinks() {
  const { activeDashboardRoute } = useNavbar()

  const isLinkActive = (href: string, exact: boolean) => {
    if (!activeDashboardRoute) return false
    if (exact) return activeDashboardRoute === href
    return activeDashboardRoute.startsWith(href)
  }

  return (
    <motion.nav
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {dashboardLinks.map((link) => (
        <NavLink
          key={link.id}
          href={link.href}
          label={link.label}
          isActive={isLinkActive(link.href, link.exact)}
        />
      ))}
    </motion.nav>
  )
}

export function PersistentNavbar() {
  const { isLoading } = useSceneMode()
  const { navbarMode } = useNavbar()
  const [visible, setVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const hasAppeared = useRef(false)

  // Trigger visibility after loading completes (with delay matching landing page)
  useEffect(() => {
    if (!isLoading && !hasAppeared.current) {
      const timer = setTimeout(() => {
        setVisible(true)
        hasAppeared.current = true
      }, 600) // Match landing page navbar delay
      return () => clearTimeout(timer)
    }
    // If already appeared, keep visible
    if (hasAppeared.current) {
      setVisible(true)
    }
  }, [isLoading])

  // Close mobile menu when navigating
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop: Glass navbar pill - crossfades with mobile */}
      <div
        className={cn(
          "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100",
          "transition-opacity duration-300 ease-in-out"
        )}
      >
        <LiquidGlassNavbar
          className={cn(
            "transition-all duration-1000",
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors"
          >
            <Logo className="h-7 w-auto" />
          </Link>

          <div className="flex items-center gap-6">
            <AnimatePresence mode="wait">
              {navbarMode === "landing" ? (
                <LandingNavLinks key="landing" />
              ) : (
                <DashboardNavLinks key="dashboard" />
              )}
            </AnimatePresence>
          </div>
        </LiquidGlassNavbar>
      </div>

      {/* Mobile: Simple full-width header - crossfades with desktop */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -10
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "pointer-events-auto opacity-100 md:pointer-events-none md:opacity-0",
          "transition-opacity duration-300 ease-in-out"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors"
          >
            <Logo className="h-7 w-auto" />
          </Link>

          <button
            className="p-2 text-foreground/80 hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mx-4 mb-4 rounded-2xl md:hidden"
              style={{
                backdropFilter: "blur(24px) saturate(200%)",
                WebkitBackdropFilter: "blur(24px) saturate(200%)",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: `
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.06),
                  inset 0 -1px 0 0 rgba(0, 0, 0, 0.02),
                  0 8px 32px rgba(0, 0, 0, 0.25),
                  0 2px 8px rgba(0, 0, 0, 0.1)
                `,
              }}
            >
              <motion.nav
                className="flex flex-col gap-1 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {navbarMode === "landing" ? (
                  <>
                    {landingLinks.map((link, index) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={handleMobileNavClick}
                          className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div
                      className="pt-2 px-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 + landingLinks.length * 0.05 }}
                    >
                      <EnterButton variant="nav" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    {dashboardLinks.map((link, index) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={handleMobileNavClick}
                          className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
