import { ReactNode } from "react";

interface MarqueeProps {
    children: ReactNode;
    speed?: "slow" | "normal" | "fast";
    direction?: "left" | "right";
    className?: string;
    pauseOnHover?: boolean;
}

const speedMap = {
    slow: "40s",
    normal: "28s",
    fast: "18s",
};

export function Marquee({
    children,
    speed = "normal",
    direction = "left",
    className = "",
    pauseOnHover = true,
}: MarqueeProps) {
    const duration = speedMap[speed];
    const directionClass = direction === "left" ? "marquee-left" : "marquee-right";

    return (
        <div
            className={`relative overflow-hidden ${className} ${pauseOnHover ? "[&:hover_.marquee-track]:pause" : ""
                }`}
            aria-hidden="true"
        >
            <div
                className={`marquee-track flex w-max ${directionClass}`}
                style={{ animationDuration: duration }}
            >
                <div className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
                <div className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
            </div>
        </div>
    );
}
