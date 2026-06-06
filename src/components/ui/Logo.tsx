import Link from "next/link";
import { CrownIcon } from "./CrownIcon";

interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "dark" | "light" | "gold";
    showTagline?: boolean;
    href?: string;
    className?: string;
}

const sizeMap = {
    sm: { crown: 16, text: "text-base", gap: "gap-1.5", tagline: "text-[8px]" },
    md: { crown: 20, text: "text-xl", gap: "gap-2", tagline: "text-[9px]" },
    lg: { crown: 26, text: "text-2xl", gap: "gap-2.5", tagline: "text-[10px]" },
    xl: { crown: 40, text: "text-5xl md:text-6xl", gap: "gap-4", tagline: "text-xs" },
};

const variantMap = {
    dark: {
        text: "text-text-primary",
        crown: "text-text-primary",
        tagline: "text-text-secondary",
        accent: "text-accent",
    },
    light: {
        text: "text-white",
        crown: "text-white",
        tagline: "text-white/60",
        accent: "text-accent",
    },
    gold: {
        text: "text-accent",
        crown: "text-accent",
        tagline: "text-accent/70",
        accent: "text-accent-hover",
    },
};

export function Logo({
    size = "md",
    variant = "dark",
    showTagline = false,
    href = "/",
    className = "",
}: LogoProps) {
    const s = sizeMap[size];
    const v = variantMap[variant];

    const content = (
        <span
            className={`inline-flex items-center ${s.gap} group ${className}`}
            aria-label="Fashion Hub home"
        >
            <span
                className={`relative ${v.crown} transition-transform duration-500 ease-out group-hover:-translate-y-0.5`}
            >
                <CrownIcon size={s.crown} strokeWidth={1.25} />
                <span
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    aria-hidden="true"
                />
            </span>
            <span className="flex flex-col leading-none">
                <span
                    className={`font-heading ${s.text} font-bold tracking-[0.18em] ${v.text} transition-colors duration-300`}
                >
                    FASHION HUB
                </span>
                {showTagline && (
                    <span
                        className={`${s.tagline} uppercase tracking-[0.4em] mt-1 ${v.tagline} font-semibold`}
                    >
                        Quiet Luxury · Est. 2026
                    </span>
                )}
            </span>
        </span>
    );

    if (!href) return content;

    return (
        <Link href={href} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
            {content}
        </Link>
    );
}
