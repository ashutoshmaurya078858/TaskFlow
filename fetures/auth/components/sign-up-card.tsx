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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { RegesterSchema } from "@/app/(auth)/shemas";
import { useRegister } from "@/app/(auth)/api/use-register";
import { signUpWithGoogle } from "@/lib/oauth";


const SignUpCard = () => {
  const { mutate, isPending, isError, error } = useRegister();
  
  const form = useForm({
    resolver: zodResolver(RegesterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegesterSchema>) => {
    mutate(data);
  };

  return (
    <div className="  flex items-center justify-center px-4">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-indigo-700/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-black/5 border border-black/10 backdrop-blur-xl shadow-2xl shadow-black/50 rounded-2xl text-black">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Create an account
            </CardTitle>
            <CardDescription className="text-black/40 text-sm">
              Get started — free, no credit card required.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ✅ NEW: Global Error Banner */}
            {isError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <p>{error?.message || "Something went wrong. Please try again."}</p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* FULL NAME */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-black/60 text-xs uppercase tracking-widest"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  className="bg-black/5 border-black/10 text-black placeholder:text-black/20 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-lg h-11"
                  {...form.register("name")}
                />
                {/* ✅ Added missing validation error for Name */}
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

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
                  className="bg-black/5 border-black/10 text-black placeholder:text-black/20 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-lg h-11"
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
                <Label
                  htmlFor="password"
                  className="text-black/60 text-xs uppercase tracking-widest"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-black/5 border-black/10 text-black placeholder:text-black/20 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-lg h-11"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <p className="text-black/30 text-xs leading-relaxed">
                By creating an account, you agree to our{" "}
                <a
                  href="#"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </p>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-black font-semibold rounded-lg mt-2 transition-colors"
              >
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-black/30 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>

            {/* OAuth */}
            <div className="grid">
              <Button
                type="button"
                variant="outline"
                className="h-11 bg-black/5 border-black/10 text-black/70 hover:bg-black/10 hover:text-black rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => signUpWithGoogle()}
              >
                <FcGoogle />
                Google
              </Button>
            </div>

            <p className="text-center text-black/30 text-sm mt-6">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpCard;