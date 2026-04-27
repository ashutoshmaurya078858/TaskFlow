"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useLogin } from "@/app/(auth)/api/use-login";
import { loginSchema } from "@/app/(auth)/shemas";
import { signUpWithGoogle } from "@/lib/oauth";
// Optional: If you use lucide-react, an alert icon looks great here
// import { AlertTriangle } from "lucide-react";

const SignInCard = () => {
  const { mutate, isPending, isError, error } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    mutate(data);
  };

  return (
    <div className=" flex items-center justify-center px-4 w-full">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-violet-700/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-black/5 border border-black/10 backdrop-blur-xl shadow-2xl shadow-black/50 rounded-2xl text-black">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-black/40 text-sm">
              Sign in to continue to your workspace.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ✅ NEW: Global Error Banner */}
            {isError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                {/* <AlertTriangle className="w-4 h-4" /> */}
                <p>
                  {error?.message ||
                    "Invalid email or password. Please try again."}
                </p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-black/60 text-xs uppercase tracking-widest"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-black/5 border-black/10 text-black placeholder:text-black/20 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg h-11"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-black/60 text-xs uppercase tracking-widest"
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-black/5 border-black/10 text-black placeholder:text-black/20 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg h-11"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                onClick={() => signUpWithGoogle()}
                disabled={isPending}
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-black font-semibold rounded-lg mt-2 transition-colors"
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-black/30 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            <div className="grid">
              <Button
                onClick={() => signUpWithGoogle()}
                type="button"
                variant="outline"
                className="h-11 bg-black/5 border-black/10 text-black/70 hover:bg-black/10 hover:text-black rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FcGoogle />
                Google
              </Button>

            
            </div>

            <p className="text-center text-black/30 text-sm mt-6">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInCard;
