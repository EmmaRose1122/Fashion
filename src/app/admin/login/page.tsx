"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="flex-1 flex items-center justify-center bg-background px-6 py-24">
      <div className="w-full max-w-md bg-surface border border-border p-8 md:p-12 rounded-sm space-y-8 text-center">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Security Gate</span>
          <h1 className="font-heading text-3xl font-bold">LUXE Dashboard</h1>
          <p className="text-xs text-text-secondary">Enter your passcode to access console</p>
        </div>

        <form action={action} className="space-y-6 text-left">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
              Passcode
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full text-sm border border-border bg-background px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary placeholder:text-text-secondary/35"
              placeholder="••••••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 p-3 rounded-sm">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full text-xs uppercase tracking-widest bg-text-primary hover:bg-accent disabled:bg-text-secondary/40 text-white py-4 rounded-sm font-semibold transition-colors"
          >
            {isPending ? "Verifying Access..." : "Enter Console"}
          </button>
        </form>
      </div>
    </div>
  );
}
