"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schema/signInSchema"
import { signIn } from "next-auth/react"

const SignIn = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onsubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Error during sign in", {
          description: result.error,
          className: "border-destructive text-destructive",
        })
        return
      }

      if (result?.url) {
        router.replace("/")
        return
      }

      toast.error("Error during sign in", {
        description: "Something went wrong. Please try again.",
        className: "border-destructive text-destructive",
      })
    } catch (error) {
      console.error("Error during sign in:", error)
      toast.error("Error during sign in", {
        description: "Something went wrong. Please try again.",
        className: "border-destructive text-destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ecfeff,_#fff7ed_50%,_#ffffff_100%)] font-sans">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-cyan-200/50 blur-3xl" />
        </div>

        <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/80 bg-white/85 p-10 shadow-xl backdrop-blur-xl sm:p-12">
          <div className="mb-6 space-y-2">
            <h1 className="font-heading text-3xl font-semibold text-slate-900">
              Sign in
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-5">
              <Controller
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email or Username</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="you@example.com or jon"
                      autoComplete="username"
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
                      autoComplete="current-password"
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </div>
  )
}

export default SignIn
