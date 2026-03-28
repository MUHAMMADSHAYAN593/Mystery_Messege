"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useDebounceCallback } from "usehooks-ts"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signupSchema } from "@/schema/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const SignUp = () => {
  const [username, setusername] = useState("")
  const [usernameMessege, setUsernameMessege] = useState("")
  const [isUsernameUnique, setIsUsernameUnique] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const debounced = useDebounceCallback(setusername, 300)

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessege("")

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          )

          const message =
            (response.data as { message?: string; messege?: string }).message ??
            (response.data as { messege?: string }).messege ??
            ""
          setUsernameMessege(message)
          setIsUsernameUnique(!!response.data.success)
        } catch (error) {
          const axioserror = error as AxiosError<ApiResponse>
          const message =
            (axioserror.response?.data as { message?: string; messege?: string })
              ?.message ??
            (axioserror.response?.data as { messege?: string })?.messege ??
            "Error checking username"
          setUsernameMessege(message)
          setIsUsernameUnique(false)
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onsubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data)
      toast.success("Success", {
        description: response.data.message,
      })

      router.replace(`/verify/${data.username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error during sign-up:", error)
      const axioserror = error as AxiosError<ApiResponse>
      const errorMessege =
        axioserror.response?.data.message || "Error during sign-up"
      toast.error("Error during sign-up", {
        description: errorMessege,
        className: "border-destructive text-destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfeff,_#fff7ed_50%,_#ffffff_100%)] font-sans">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center gap-12 px-6 py-14 lg:flex-row lg:items-stretch">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-cyan-200/50 blur-3xl" />
        </div>

        <section className="relative z-10 flex w-full flex-1 flex-col justify-center gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-5 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm">
            Mystery Messages
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Join Mystery Messege
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              Create your anonymous inbox and let friends send messages with
              confidence. Keep it playful, keep it safe.
            </p>
          </div>
          <div className="grid gap-4 text-base text-slate-600 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Private by design
              </p>
              <p className="mt-2">No profiles, no pressure — just pure honesty.</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                Thoughtful prompts
              </p>
              <p className="mt-2">Spark conversations with crafted questions.</p>
            </div>
          </div>
        </section>

        <section className="relative z-10 flex w-full max-w-md flex-col justify-center rounded-3xl border border-white/80 bg-white/85 p-10 shadow-xl backdrop-blur-xl sm:p-12">
          <div className="mb-6 space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-slate-900">
              Create account
            </h2>
            <p className="text-base text-slate-600">
              Start your anonymous adventure in under a minute.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-5">
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g jon"
                      autoComplete="off"
                      onChange={(event) => {
                        field.onChange(event)
                        debounced(event.target.value)
                      }}
                    />
                    <FieldDescription
                      className={`flex items-center gap-2 text-base ${
                        isUsernameUnique === true
                          ? "text-emerald-600"
                          : isUsernameUnique === false && username
                            ? "text-rose-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {isCheckingUsername && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      )}
                      <span>
                        {isCheckingUsername
                          ? "Checking availability..."
                          : isUsernameUnique === true && username
                            ? `${username} username is unique.`
                            : isUsernameUnique === false && username
                              ? usernameMessege?.toLowerCase().includes("invalid") ||
                                usernameMessege?.toLowerCase().includes("error")
                                ? usernameMessege
                                : `${username} username is not unique or already occupied.`
                              : usernameMessege || "Pick a unique handle to share."}
                      </span>
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-5 text-base font-semibold text-white hover:bg-slate-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-slate-500">
            By continuing, you agree to keep things kind and constructive.
          </p>
          <p className="mt-4 text-center text-base text-slate-600">
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-slate-900 underline underline-offset-4 transition hover:text-slate-700"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default SignUp
