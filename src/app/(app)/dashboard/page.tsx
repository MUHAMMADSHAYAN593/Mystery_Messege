"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Copy, ExternalLink, Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import MessegeCard from "@/components/MessegeCard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Messege } from "@/models/User"
import { AcceptMessageSchema } from "@/schema/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"

const Dashboard = () => {
  const { data: session, status } = useSession()
  const user = session?.user as User | undefined
  const username = user?.username || ""

  const [messeges, setMesseges] = useState<Messege[]>([])
  const [isMessegesLoading, setIsMessegesLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState("")

  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  })

  const { watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessege = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messeges")
      setValue(
        "acceptMessages",
        response.data.isAcceptingMessege ??
          response.data.isAcceptingMessage ??
          false
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Unable to load inbox setting", {
        description: axiosError.response?.data.message || "Please try again.",
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMesseges = useCallback(async (refresh = false) => {
    setIsMessegesLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messeges")
      setMesseges(response.data.messeges || [])
      if (refresh) {
        toast.success("Inbox refreshed", {
          description: "Showing latest anonymous messages.",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Unable to load messages", {
        description: axiosError.response?.data.message || "Please try again.",
      })
    } finally {
      setIsMessegesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status !== "authenticated") return
    void fetchMesseges()
    void fetchAcceptMessege()
  }, [status, fetchAcceptMessege, fetchMesseges])

  useEffect(() => {
    if (!username || typeof window === "undefined") return
    setProfileUrl(`${window.location.origin}/u/${username}`)
  }, [username])

  const handleSwitchState = async (checked: boolean) => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messeges", {
        acceptMesseges: checked,
      })
      setValue("acceptMessages", checked)
      toast.success("Inbox setting updated", {
        description: response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Unable to update inbox setting", {
        description: axiosError.response?.data.message || "Please try again.",
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const getMessegeId = useCallback((messege: Messege) => {
    if (typeof messege._id === "string") return messege._id
    if (
      messege._id &&
      typeof (messege._id as { toString?: () => string }).toString === "function"
    ) {
      return (messege._id as { toString: () => string }).toString()
    }
    return ""
  }, [])

  const handleDeleteMessege = useCallback(
    (messegeId: string) => {
      setMesseges((prevMesseges) =>
        prevMesseges.filter((messege) => getMessegeId(messege) !== messegeId)
      )
    },
    [getMessegeId]
  )

  const copyToClipboard = async () => {
    if (!profileUrl) return
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success("Profile link copied")
    } catch (error) {
      console.log("Failed to copy profile url", error)
      toast.error("Unable to copy link", {
        description: "Please copy it manually.",
      })
    }
  }

  const totalMesseges = useMemo(() => messeges.length, [messeges])

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-slate-600" />
      </div>
    )
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-[70vh] px-6 py-12">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/80 bg-white/85 p-10 text-center shadow-xl backdrop-blur">
          <h1 className="font-heading text-3xl font-semibold text-slate-900">
            Please sign in
          </h1>
          <p className="mt-3 text-slate-600">
            Sign in to manage your anonymous inbox.
          </p>
          <Button asChild className="mt-6 rounded-full bg-slate-900 text-white">
            <Link href="/sign-in">Go to sign in</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfeff,#fff7ed_50%,#ffffff_100%)] font-sans">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-cyan-200/50 blur-3xl" />
        </div>

        <section className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-5 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm">
              Dashboard
            </div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Welcome back{username ? `, @${username}` : ""}
            </h1>
            <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
              Share your profile link, manage inbox availability, and review
              messages in one place.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border border-white/80 bg-white/85 shadow-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-slate-900">Your public link</CardTitle>
                <CardDescription className="text-slate-600">
                  Anyone with this link can send you an anonymous message.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={profileUrl}
                  readOnly
                  className="h-10 rounded-xl border-emerald-100 bg-white/90"
                  placeholder="Generating your link..."
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={copyToClipboard}
                    disabled={!profileUrl}
                    className="rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800"
                  >
                    <Copy className="size-4" />
                    Copy
                  </Button>
                  {username ? (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-emerald-200 bg-white/90"
                    >
                      <Link href={`/u/${username}`}>
                        <ExternalLink className="size-4" />
                        Open profile
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="rounded-full border-emerald-200 bg-white/90"
                      disabled
                    >
                      <ExternalLink className="size-4" />
                      Open profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/80 bg-white/85 shadow-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-slate-900">Inbox settings</CardTitle>
                <CardDescription className="text-slate-600">
                  Control whether people can send you new anonymous messages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      Accept new messages
                    </p>
                    <p className="text-xs text-slate-600">
                      Status: {acceptMessages ? "ON" : "OFF"}
                    </p>
                  </div>
                  <Switch
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchState}
                    disabled={isSwitchLoading}
                    aria-label="Toggle accepting messages"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t border-emerald-100 bg-emerald-50/60 text-xs font-medium uppercase tracking-wide text-emerald-700">
                <span>Changes apply instantly</span>
                {isSwitchLoading ? <Loader2 className="size-4 animate-spin" /> : null}
              </CardFooter>
            </Card>
          </div>

          <Separator className="bg-white/80" />

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-slate-900">
                  Inbox messages
                </h2>
                <p className="text-sm text-slate-600">
                  {totalMesseges} message{totalMesseges === 1 ? "" : "s"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => void fetchMesseges(true)}
                disabled={isMessegesLoading}
                className="rounded-full border-emerald-200 bg-white/90"
              >
                {isMessegesLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCcw className="size-4" />
                )}
                Refresh
              </Button>
            </div>

            {isMessegesLoading && messeges.length === 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-36 animate-pulse rounded-2xl border border-white/70 bg-white/70" />
                <div className="h-36 animate-pulse rounded-2xl border border-white/70 bg-white/70" />
              </div>
            ) : messeges.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {messeges.map((messege, index) => {
                  const messegeId = getMessegeId(messege)
                  return (
                    <MessegeCard
                      key={messegeId || `${index}-${messege.createdAt}`}
                      messege={messege}
                      onMessegeDelete={handleDeleteMessege}
                    />
                  )
                })}
              </div>
            ) : (
              <Card className="border border-dashed border-emerald-200 bg-white/80 shadow-sm">
                <CardContent className="py-10 text-center">
                  <p className="text-base font-medium text-slate-700">
                    No messages yet
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Share your profile link above to start receiving anonymous
                    feedback.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
