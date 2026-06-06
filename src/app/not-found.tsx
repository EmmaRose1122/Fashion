import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-24">
            <div className="max-w-xl text-center space-y-8">
                <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                        {SITE_NAME} — Editorial
                    </span>
                    <h1 className="font-heading text-7xl md:text-8xl font-bold text-text-primary">
                        404
                    </h1>
                    <p className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
                        Page Not Found
                    </p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                    <p className="text-base text-text-secondary leading-relaxed">
                        The story you're looking for has moved, been retired, or never existed in our journal.
                    </p>
                    <p className="text-xs text-text-secondary/60 italic">
                        Quiet luxury, sometimes, includes a graceful exit.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-sm font-semibold transition-colors"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/jobs"
                        className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-4 px-2 border-b border-transparent hover:border-accent transition-all"
                    >
                        Browse Opportunities →
                    </Link>
                </div>
            </div>
        </div>
    );
}
