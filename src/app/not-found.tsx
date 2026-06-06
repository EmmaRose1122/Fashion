import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CrownIcon } from "@/components/ui/CrownIcon";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-24 relative overflow-hidden">
            {/* Decorative gradient */}
            <div
                className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none animate-float"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201,169,110,0.5) 0%, rgba(201,169,110,0) 70%)",
                }}
                aria-hidden="true"
            />
            <div className="relative max-w-2xl text-center space-y-10">
                <Logo size="lg" />

                <div className="space-y-4">
                    <CrownIcon
                        size={48}
                        className="text-accent mx-auto animate-float"
                    />
                    <h1 className="font-heading text-8xl md:text-9xl font-bold shimmer-text">
                        404
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
                        Page Not Found
                    </p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                    <p className="text-base text-text-secondary leading-relaxed">
                        The story you're looking for has moved, been retired, or perhaps never existed in our journal.
                    </p>
                    <p className="text-xs text-text-secondary/60 italic">
                        Even in quiet luxury, sometimes a page gracefully turns.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-text-primary hover:bg-accent text-white px-8 py-4 rounded-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-accent/20"
                    >
                        <CrownIcon size={12} className="text-accent group-hover:text-white transition-colors" />
                        Return Home
                    </Link>
                    <Link
                        href="/jobs"
                        className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent gold-underline font-semibold py-4 px-2 transition-colors"
                    >
                        Browse Careers →
                    </Link>
                </div>
            </div>
        </div>
    );
}
