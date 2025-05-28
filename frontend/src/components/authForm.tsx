"use client"

import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { loginSchema, registerSchema } from "@/lib/validations/auth"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { API } from "@/lib/api"
import { toast, Toaster } from "sonner"
import { useRouter } from "next/navigation"
import { login, setUser } from "@/store/authSlice"
import { useDispatch } from "react-redux"

type AuthFormProps = React.ComponentProps<"div"> & {
  type: "login" | "register"
}

export function AuthForm({ type, className, ...props }: AuthFormProps) {
  const isLogin = type === "login"
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const schema = isLogin ? loginSchema : registerSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register"

      const res = await API.post(endpoint, data);
      const token = res.data.access_token
      dispatch(login(token))

      const me = await API.get("/auth/me", {
        headers: {
          Authorization: `bearer ${token}`
        }
      })

      dispatch(setUser(me.data))

      toast.success(isLogin ? "Login successful" : "Account created")
      router.replace("/dashboard")

    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <main>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Login to your account" : "Create an account"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your email below to login to your account"
                : "Enter your details to create an account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                {!isLogin && (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} placeholder="John Doe" />
                    {errors.name && <p className="text-sm text-red-500">{String(errors.name.message)}</p>}
                  </div>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
                  {errors.email && <p className="text-sm text-red-500">{String(errors.email.message)}</p>}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && <p className="text-sm text-red-500">{String(errors.password.message)}</p>}
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center text-sm">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link href="/login" className="underline underline-offset-4">
                      Log in
                    </Link>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}
