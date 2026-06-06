"use client";

import { useEffect, useRef, useState, useMemo, ReactNode, Children, isValidElement, cloneElement } from "react";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    threshold?: number;
    stagger?: number;
    once?: boolean;
    as?: "section" | "div" | "article" | "header" | "footer" | "main" | "aside";
}

export function AnimatedSection({
    children,
    className = "",
    delay = 0,
    duration = 800,
    threshold = 0.12,
    stagger = 90,
    once = true,
    as: Tag = "section",
}: AnimatedSectionProps) {
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
            { threshold, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, once]);

    const items = useMemo(
        () =>
            Children.toArray(children).filter((child) => isValidElement(child)),
        [children]
    );

    const isStaggered = items.length > 1;

    const Component: any = Tag;

    if (!isStaggered) {
        return (
            <Component
                ref={ref}
                className={className}
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translate3d(0,0,0)" : "translate3d(0,24px,0)",
                    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                    willChange: "opacity, transform",
                }}
            >
                {children}
            </Component>
        );
    }

    return (
        <Component ref={ref} className={className}>
            {items.map((child, i) => {
                const childDelay = delay + i * stagger;
                const style: React.CSSProperties = {
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translate3d(0,0,0)" : "translate3d(0,18px,0)",
                    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${childDelay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${childDelay}ms`,
                    willChange: "opacity, transform",
                };
                const childEl = child as React.ReactElement<{ style?: React.CSSProperties }>;
                const existingStyle = childEl.props?.style ?? {};
                return cloneElement(childEl, {
                    style: { ...existingStyle, ...style },
                });
            })}
        </Component>
    );
}
