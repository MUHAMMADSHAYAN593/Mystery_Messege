"use client"

import Link from "next/link"
import { LogOut, MessageCircleMore } from "lucide-react"
import { User } from "next-auth"
import { signOut, useSession } from "next-auth/react"

import { Button } from "./ui/button"

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const displayName = user?.username || user?.name || user?.email || "Member"

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <MessageCircleMore className="size-5" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight text-slate-900">
              Mystery Messages
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Anonymous inbox
            </p>
          </div>
        </Link>

        {session ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <p className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 sm:block">
              Welcome, {displayName}
            </p>
            <Button
              onClick={() => signOut()}
              className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800 sm:px-5"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-full bg-white/80">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800 sm:px-5"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
