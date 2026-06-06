import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-24 relative overflow-hidden">
            <div
                className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl pointer-events-none animate-float"
                style={{
                    background:
                        "radial-gradient(circle, rgba(181,70,92,0.4) 0%, rgba(181,70,92,0) 70%)",
                }}
                aria-hidden="true"
            />

            <div className="relative max-w-2xl text-center space-y-10">
                <div className="inline-block">
                    <Logo size="lg" />
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
                        Page Not Found
                    </p>
                    <h1 className="font-display text-8xl md:text-9xl font-semibold shimmer-text">
                        404
                    </h1>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                    <p className="font-display italic text-xl md:text-2xl text-text-primary leading-snug">
                        Even in quiet luxury, sometimes a page gracefully turns.
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        The story you're looking for has moved, been retired, or never existed in our journal.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="text-xs uppercase tracking-[0.2em] bg-text-primary hover:bg-accent text-white px-8 py-4 font-semibold transition-colors"
                    >
                        Return to Journal
                    </Link>
                </div>
            </div>
        </div>
    );
}
