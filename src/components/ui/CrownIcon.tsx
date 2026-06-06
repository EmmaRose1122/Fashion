interface CrownIconProps {
    size?: number;
    className?: string;
    strokeWidth?: number;
}

export function CrownIcon({ size = 24, className = "", strokeWidth = 1.25 }: CrownIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Crown"
        >
            <path
                d="M3 11L7 18L12 7L16 14L20 7L25 18L29 11L27 25H5L3 11Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="3" cy="11" r="1.25" fill="currentColor" />
            <circle cx="29" cy="11" r="1.25" fill="currentColor" />
            <circle cx="12" cy="7" r="1.25" fill="currentColor" />
            <circle cx="20" cy="7" r="1.25" fill="currentColor" />
            <circle cx="16" cy="14" r="1.5" fill="currentColor" />
            <line
                x1="6"
                y1="22"
                x2="26"
                y2="22"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
        </svg>
    );
}
