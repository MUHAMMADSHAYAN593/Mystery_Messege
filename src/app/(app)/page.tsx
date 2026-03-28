"use client"

import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight, Sparkles } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import messeges from "@/data/messeges.json"

const communityMembers = [
  { name: "Sarah", handle: "@sarah", status: "Active now", note: "Shares kind and honest feedback." },
  { name: "Ali", handle: "@ali", status: "Online", note: "Often sends practical advice." },
  { name: "Ayesha", handle: "@ayesha", status: "Active now", note: "Loves motivational messages." },
  { name: "Ahmed", handle: "@ahmed", status: "Away", note: "Helpful with study and productivity tips." },
]

const getInitials = (value: string) =>
  value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfeff,#fff7ed_50%,#ffffff_100%)] font-sans">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-cyan-200/50 blur-3xl" />
        </div>

        <div className="relative z-10 space-y-8">
          <Breadcrumb className="inline-flex rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-sm backdrop-blur">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Discover</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border border-white/80 bg-white/85 shadow-xl backdrop-blur-xl">
              <CardHeader className="space-y-4">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Community Spotlight
                </div>
                <CardTitle className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Dive into anonymous conversations
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  Explore Mystery Messege, where people can share thoughts freely
                  while your identity stays private and protected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <AvatarGroup>
                  {communityMembers.map((member, index) => (
                    <HoverCard key={member.handle} openDelay={120} closeDelay={80}>
                      <HoverCardTrigger asChild>
                        <Avatar size="lg" className="cursor-pointer ring-2 ring-white">
                          <AvatarImage
                            src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
                              member.name
                            )}`}
                            alt={member.name}
                          />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          <AvatarBadge
                            className={
                              index % 2 === 0 ? "bg-emerald-500" : "bg-amber-500"
                            }
                          />
                        </Avatar>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl">
                        <div className="flex items-start gap-3">
                          <Avatar size="lg">
                            <AvatarImage
                              src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
                                member.name
                              )}`}
                              alt={member.name}
                            />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900">{member.name}</p>
                            <p className="text-sm text-slate-500">{member.handle}</p>
                            <p className="mt-2 text-sm text-slate-600">{member.note}</p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-emerald-700">
                              {member.status}
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                  <AvatarGroupCount>+24</AvatarGroupCount>
                </AvatarGroup>

                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-emerald-200 bg-white/90"
                  >
                    <Link href="/sign-up">Create your inbox</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/80 bg-white/85 shadow-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-slate-900">Live pulse</CardTitle>
                <CardDescription className="text-slate-600">
                  A quick look at what makes this space engaging.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    Shared safely
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">100%</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Identity remains hidden by design.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
                    New vibes daily
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {messeges.length}+
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Sample messages currently in rotation.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-emerald-100 bg-emerald-50/60 text-xs font-medium uppercase tracking-wide text-emerald-700">
                <Sparkles className="mr-2 size-3.5" />
                Built for honest feedback
              </CardFooter>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-semibold text-slate-900">
                Message highlights
              </h2>
              <p className="text-sm text-slate-600">
                Glimpse real examples of what your inbox can feel like.
              </p>
            </div>

            <Carousel
              plugins={[
                Autoplay({
                  delay: 2200,
                  stopOnInteraction: false,
                }),
              ]}
              opts={{ loop: true }}
              className="w-full"
            >
              <CarouselContent>
                {messeges.map((messege, index) => (
                  <CarouselItem key={`${messege.tittle}-${index}`} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full border border-white/80 bg-white/85 shadow-lg shadow-slate-200/60 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="line-clamp-1 text-slate-900">
                          {messege.tittle}
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                          {messege.recived}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="line-clamp-3 text-[15px] leading-relaxed text-slate-700">
                          {messege.content}
                        </p>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700"
                            >
                              Preview sender profile
                            </button>
                          </HoverCardTrigger>
                          <HoverCardContent className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
                                    messege.tittle
                                  )}`}
                                  alt={messege.tittle}
                                />
                                <AvatarFallback>{getInitials(messege.tittle)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  Anonymous Sender
                                </p>
                                <p className="text-xs text-slate-500">
                                  {messege.recived}
                                </p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 bg-white/90" />
              <CarouselNext className="-right-2 bg-white/90" />
            </Carousel>
          </section>
        </div>
      </div>
    </main>
  )
}
