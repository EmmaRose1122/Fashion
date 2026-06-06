"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login } from "@/actions/auth";
import { CrownIcon } from "@/components/ui/CrownIcon";

interface PortalClientProps {
    usingDefaultEmail: boolean;
    usingDefaultPassword: boolean;
    defaultEmail: string;
}

export function PortalClient({
    usingDefaultEmail,
    usingDefaultPassword,
    defaultEmail,
}: PortalClientProps) {
    const [state, action, isPending] = useActionState(login, undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [showHint, setShowHint] = useState(false);

    return (
        <div className="flex-1 flex items-center justify-center bg-background px-6 py-20 min-h-[80vh] relative overflow-hidden">
            <div
                className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl pointer-events-none animate-float"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201,169,110,0.5) 0%, rgba(201,169,110,0) 70%)",
                }}
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full opacity-20 blur-3xl pointer-events-none animate-float"
                style={{
                    background:
                        "radial-gradient(circle, rgba(184,150,62,0.45) 0%, rgba(184,150,62,0) 70%)",
                    animationDelay: "2s",
                }}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-md">
                <div className="bg-surface border border-border p-8 md:p-12 rounded-sm space-y-8 text-center shadow-xl shadow-text-primary/5">
                    <div className="space-y-4">
                        <CrownIcon size={36} className="text-accent mx-auto animate-float" />
                        <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
                            Secure Portal
                        </span>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold">
                            Fashion Hub Studio
                        </h1>
                        <p className="text-xs text-text-secondary">
                            Sign in with your editorial credentials
                        </p>
                    </div>

                    <form action={action} className="space-y-5 text-left">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                autoComplete="email"
                                placeholder="editor@fashionhub.studio"
                                defaultValue={usingDefaultEmail ? defaultEmail : ""}
                                className="w-full text-sm border border-border bg-background px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary placeholder:text-text-secondary/35 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••••••"
                                    className="w-full text-sm border border-border bg-background px-4 py-3 pr-20 rounded-sm focus:outline-none focus:border-accent text-text-primary placeholder:text-text-secondary/35 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent font-bold"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {state?.error && (
                            <div className="space-y-2">
                                <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 p-3 rounded-sm">
                                    {state.error}
                                </p>
                                <p className="text-[10px] text-text-secondary/70 italic">
                                    Tip: hard-refresh (Ctrl+Shift+R) and try again. If the issue persists,
                                    your Vercel env vars may not match.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full text-xs uppercase tracking-widest bg-text-primary hover:bg-accent disabled:bg-text-secondary/40 text-white py-4 rounded-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Verifying Access..." : "Enter Studio"}
                        </button>
                    </form>

                    <div className="pt-4 border-t border-border-light space-y-3">
                        <button
                            type="button"
                            onClick={() => setShowHint((s) => !s)}
                            className="text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent font-bold transition-colors"
                        >
                            {showHint ? "− Hide" : "+ Show"} credential status
                        </button>
                        {showHint && (
                            <div className="text-[10px] text-text-secondary/80 leading-relaxed text-left space-y-2 bg-background/50 border border-border-light rounded-sm p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span>Email source:</span>
                                    <span className={`font-mono font-bold ${usingDefaultEmail ? "text-amber-600" : "text-green-700"}`}>
                                        {usingDefaultEmail ? "DEFAULT" : "ENV VAR"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span>Password source:</span>
                                    <span className={`font-mono font-bold ${usingDefaultPassword ? "text-amber-600" : "text-green-700"}`}>
                                        {usingDefaultPassword ? "DEFAULT" : "ENV VAR"}
                                    </span>
                                </div>
                                {usingDefaultEmail && (
                                    <p className="pt-1 italic">
                                        Form pre-filled with default email:{" "}
                                        <code className="font-mono">{defaultEmail}</code>
                                    </p>
                                )}
                                {usingDefaultPassword && (
                                    <p className="italic">
                                        Default password:{" "}
                                        <code className="font-mono">FH-Curated-2026!Lux-Quiet</code>
                                    </p>
                                )}
                                <p className="italic pt-1 border-t border-border-light mt-2">
                                    Override via <code className="font-mono">ADMIN_EMAIL</code> /{" "}
                                    <code className="font-mono">ADMIN_PASSWORD</code> in Vercel env vars.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center pt-6">
                    <Link
                        href="/"
                        className="text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent gold-underline font-bold transition-colors"
                    >
                        ← Return to Journal
                    </Link>
                </div>
            </div>
        </div>
    );
}
