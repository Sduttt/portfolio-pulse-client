import { NextRequest, NextResponse } from "next/server";

// Add any route prefix here that requires the user to be logged in
const PROTECTED_PREFIXES = [
    "/dashboard",
    "/portfolio",
    "/profile",
    "/trade",
    "/analysis",
];

// Logged-in users visiting these are bounced to /dashboard
const AUTH_ROUTES = ["/auth", "/"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;

    const isProtected = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    );
    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isProtected && !accessToken) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth";
        url.searchParams.set("next", pathname); // restore destination after login
        return NextResponse.redirect(url);
    }

    if (isAuthRoute && accessToken) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Only run middleware on routes that actually need auth checks
    matcher: [
        "/",
        "/dashboard/:path*",
        "/portfolio/:path*",
        "/profile/:path*",
        "/trade/:path*",
        "/analysis/:path*",
        "/auth",
        "/auth/:path*",
    ],
};
