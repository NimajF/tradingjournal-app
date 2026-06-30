"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [error, submitAction, isPending] = useActionState<
    string | null,
    FormData
  >(async (prev, formData) => {
    const res = await signIn(
      formData.get("email") as string,
      formData.get("password") as string,
    );
    return res?.error || null;
  }, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
          <p className="text-sm text-muted-fg">Access your trading journal</p>
        </div>

        <form action={submitAction} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-muted-fg mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-muted-fg" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-subtle-fg"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-muted-fg mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-muted-fg" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-subtle-fg"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-accent hover:bg-accent-hover text-accent-fg font-medium py-2 rounded-md disabled:opacity-50 transition-colors"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-fg">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-accent hover:text-accent-hover"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
