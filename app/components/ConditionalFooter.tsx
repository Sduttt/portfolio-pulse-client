"use client";

import { usePathname } from "next/navigation";
import FooterSection from "./FooterSection";

// Add paths here to exclude them from showing the footer
const EXCLUDED_PATHS: string[] = ["/auth"];

export default function ConditionalFooter() {
    const pathname = usePathname();
    const isExcluded = EXCLUDED_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));

    if (isExcluded) return null;

    return <FooterSection />;
}
