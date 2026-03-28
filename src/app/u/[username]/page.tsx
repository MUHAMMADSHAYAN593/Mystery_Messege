"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, Sparkles, Wand2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { MessageSchema } from "@/schema/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"

const hardcodedSuggestions = [
  "What is something small that made you smile this week?",
  "What quality do you think stands out the most in me?",
  "If you could give me one piece of advice, what would it be?",
  "What is a goal you think I should chase next?",
  "What is one memory you have with me that you still like?",
]

const getInitials = (value: string) =>
  value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

const PublicProfilePage = () => {
  const params = useParams<{ username: string }>()
  const username =
    typeof params.username === "string" ? decodeURIComponent(params.username) : ""
  const profileLabel = username ? `@${username}` : "this user"

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(
    hardcodedSuggestions
  )
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  })

  const previewMessage = form.watch("content") || "Your selected message will appear here..."

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    if (!username) {
      toast.error("Invalid profile link")
      return
    }

    setIsSending(true)
    try {
      const response = await axios.post<ApiResponse>("/api/send-messege", {
        username,
        content: data.content,
      })

      toast.success("Message sent", {
        description: response.data.message,
      })
      form.reset({ content: "" })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Unable to send message", {
        description: axiosError.response?.data.message || "Please try again.",
        className: "border-destructive text-destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleSuggestMessages = async () => {
    setIsSuggesting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messeges")
      const generatedSuggestions =
        response.data.suggestions?.filter(Boolean).slice(0, 5) || []

      if (generatedSuggestions.length === 0) {
        toast.error("No suggestions generated", {
          description: "Try again in a moment.",
        })
        return
      }

      setSuggestedMessages(generatedSuggestions)
      toast.success("New suggestions ready")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Unable to load suggestions", {
        description: axiosError.response?.data.message || "Please try again.",
        className: "border-destructive text-destructive",
      })
    } finally {
      setIsSuggesting(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    form.setValue("content", suggestion, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    toast.success("Suggestion added to message box")
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfeff,#fff7ed_50%,#ffffff_100%)] font-sans">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
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
                <BreadcrumbPage>Public profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border border-white/80 bg-white/85 shadow-xl backdrop-blur-xl">
              <CardHeader className="space-y-4">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Anonymous drop box
                </div>
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Avatar size="lg">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
                        username || "mystery-user"
                      )}`}
                      alt={profileLabel}
                    />
                    <AvatarFallback>{getInitials(username || "MU")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-heading text-2xl text-slate-900 sm:text-4xl">
                      Send a message to {profileLabel}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Your identity stays private. Keep it kind and respectful.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                      name="content"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Your message</FieldLabel>
                          <textarea
                            id={field.name}
                            name={field.name}
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            rows={6}
                            placeholder="Write an anonymous message..."
                            className="min-h-32 w-full rounded-2xl border border-input bg-white/90 px-3 py-2 text-sm text-slate-700 outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                          />
                          <FieldDescription>
                            Click any suggestion below to auto-fill this message box.
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <Button
                        type="submit"
                        disabled={isSending}
                        className="w-full rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800 sm:w-auto"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send message"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset({ content: "" })}
                        className="w-full rounded-full border-emerald-200 bg-white/90 sm:w-auto"
                        disabled={isSending}
                      >
                        Clear
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border border-white/80 bg-white/85 shadow-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-slate-900">Message preview</CardTitle>
                <CardDescription className="text-slate-600">
                  A quick view of what you are about to send.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="text-sm leading-relaxed text-slate-700">{previewMessage}</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-emerald-100 bg-emerald-50/60 text-xs font-medium uppercase tracking-wide text-emerald-700">
                Anonymous and private
              </CardFooter>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-slate-900">
                  Suggestion prompts
                </h2>
                <p className="text-sm text-slate-600">
                  Start with defaults, then generate fresh ideas from API.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleSuggestMessages}
                disabled={isSuggesting}
                className="w-full rounded-full border-emerald-200 bg-white/90 sm:w-auto"
              >
                {isSuggesting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4" />
                    Suggest Messages
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {suggestedMessages.map((suggestion, index) => (
                <HoverCard key={`${suggestion}-${index}`} openDelay={120} closeDelay={80}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="rounded-2xl border border-white/80 bg-white/90 p-4 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/60"
                    >
                      <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">
                        {suggestion}
                      </p>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      Click to use
                    </p>
                    <p className="mt-2 text-sm text-slate-700">{suggestion}</p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>

            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Sparkles className="size-3.5" />
              Tip: Tap a prompt, edit it your way, then send.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

export default PublicProfilePage
