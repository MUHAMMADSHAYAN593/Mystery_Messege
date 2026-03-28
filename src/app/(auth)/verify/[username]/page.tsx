"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { verifySchema } from "@/schema/verifySchema"
import { ApiResponse } from "@/types/ApiResponse"


const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const username =
    typeof params.username === "string" ? decodeURIComponent(params.username) : ""

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  const onsubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username,
        code: data.code,
      })

      if (!response.data.success) {
        toast.error("Verification failed", {
          description: response.data.message || "Please try again.",
          className: "border-destructive text-destructive",
        })
        return
      }

      toast.success("Success", {
        description: response.data.message,
      })
      router.replace("/sign-in")
    } catch (error) {
      console.error("Error during verification:", error)
      const axioserror = error as AxiosError<ApiResponse>
      const errorMessege =
        axioserror.response?.data.message || "Error during verification"

      toast.error("Verification failed", {
        description: errorMessege,
        className: "border-destructive text-destructive",
      })
    } finally {
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
            Account Security
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Verify your Mystery Messages account
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              You are almost in. Enter the six-digit verification code we sent to
              your inbox and unlock your anonymous message page.
            </p>
          </div>
          <div className="grid gap-4 text-base text-slate-600 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Fast setup
              </p>
              <p className="mt-2">Verification takes only a few seconds.</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
                Safer inbox
              </p>
              <p className="mt-2">Confirming your email keeps your account secure.</p>
            </div>
          </div>
        </section>

        <section className="relative z-10 flex w-full max-w-md flex-col justify-center rounded-3xl border border-white/80 bg-white/85 p-10 shadow-xl backdrop-blur-xl sm:p-12">
          <div className="mb-6 space-y-2">
            <h2 className="font-heading text-2xl font-semibold text-slate-900">
              Confirm code
            </h2>
            <p className="text-base text-slate-600">
              Enter the 6-digit code for{" "}
              <span className="font-semibold text-slate-900">@{username}</span>.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-5">
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Verification code</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="123456"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      maxLength={6}
                      onChange={(event) => {
                        const value = event.target.value.replace(/\D/g, "").slice(0, 6)
                        field.onChange(value)
                      }}
                    />
                    <FieldDescription>
                      We sent this to your email during sign up.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-5 text-base font-semibold text-white hover:bg-slate-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify Account"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Didn&apos;t receive it? Check spam or promotions folders.
          </p>
          <p className="mt-4 text-center text-base text-slate-600">
            Need to create another account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-slate-900 underline underline-offset-4 transition hover:text-slate-700"
            >
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default VerifyAccount
