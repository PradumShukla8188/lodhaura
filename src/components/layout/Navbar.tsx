"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogIn,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { navLinks, moreNavLinks, villageInfo } from "@/lib/village-data";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeColorPicker } from "@/components/theme/ThemeColorPicker";
import { UserMenu } from "@/components/layout/UserMenu";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-white/20">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-village text-lg font-bold text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              L
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight text-foreground">
                Lodhaura
              </p>
              <p className="text-[10px] text-muted-foreground">
                Village Portal
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                More
                <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="glass-strong absolute right-0 top-full mt-1 min-w-[180px] rounded-xl border border-white/20 py-2 shadow-xl"
                  >
                    {moreNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="hidden sm:inline-flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
            </Button>

            <ThemeColorPicker />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="relative"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <UserMenu />

            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10"
            >
              <form onSubmit={handleSearch} className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search directory, events, services..."
                    className="glass"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Link href="/search">
                    <Button type="button" variant="outline" size="sm">Advanced</Button>
                  </Link>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-strong border-b border-white/20 xl:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-primary/10"
                >
                  {link.label}
                </Link>
              ))}
              <p className="px-4 pt-2 text-xs font-semibold uppercase text-muted-foreground">More</p>
              {moreNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/10"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-4 pt-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {villageInfo.district}, {villageInfo.state}
              </div>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="mt-2 w-full gap-2">
                      <LogIn className="h-4 w-4" />
                      My Dashboard
                    </Button>
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="mt-2 w-full">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="mt-2 w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
