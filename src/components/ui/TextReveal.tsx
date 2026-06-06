"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type TagName = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

interface TextRevealProps {
    children: ReactNode;
    as?: TagName;
    className?: string;
    delay?: number;
    duration?: number;
    threshold?: number;
    direction?: "up" | "down" | "left" | "right" | "fade";
    once?: boolean;
}

export function TextReveal({
    children,
    as = "div",
    className = "",
    delay = 0,
    duration = 800,
    threshold = 0.15,
    direction = "up",
    once = true,
}: TextRevealProps) {
    const ref = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        if (once) observer.unobserve(entry.target);
                    } else if (!once) {
                        setVisible(false);
                    }
                });
            },
            { threshold, rootMargin: "0px 0px -50px 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, once]);

    const transform = (() => {
        if (visible) return "translate3d(0,0,0)";
        switch (direction) {
            case "up":
                return "translate3d(0, 24px, 0)";
            case "down":
                return "translate3d(0, -24px, 0)";
            case "left":
                return "translate3d(24px, 0, 0)";
            case "right":
                return "translate3d(-24px, 0, 0)";
            default:
                return "translate3d(0,0,0)";
        }
    })();

    const style: React.CSSProperties = {
        opacity: visible ? 1 : 0,
        transform,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
    };

    switch (as) {
        case "h1":
            return (
                <h1 ref={ref as React.RefObject<HTMLHeadingElement>} className={`text-reveal ${className}`} style={style}>
                    {children}
                </h1>
            );
        case "h2":
            return (
                <h2 ref={ref as React.RefObject<HTMLHeadingElement>} className={`text-reveal ${className}`} style={style}>
                    {children}
                </h2>
            );
        case "h3":
            return (
                <h3 ref={ref as React.RefObject<HTMLHeadingElement>} className={`text-reveal ${className}`} style={style}>
                    {children}
                </h3>
            );
        case "h4":
            return (
                <h4 ref={ref as React.RefObject<HTMLHeadingElement>} className={`text-reveal ${className}`} style={style}>
                    {children}
                </h4>
            );
        case "p":
            return (
                <p ref={ref as React.RefObject<HTMLParagraphElement>} className={`text-reveal ${className}`} style={style}>
                    {children}
                </p>
            );
        case "span":
            return (
                <span ref={ref as React.RefObject<HTMLSpanElement>} className={`text-reveal ${className}`} style={style}>
                    {children}
                </span>
            );
        case "div":
        default:
            return (
                <div ref={ref as React.RefObject<HTMLDivElement>} className={`text-reveal ${className}`} style={style}>
                    {children}
                </div>
            );
    }
}
