import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// 7 days – keeps the user logged in across browser restarts
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
    const body = await req.text();

    const backendRes = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": req.headers.get("Content-Type") ?? "application/json",
        },
        body,
    });

    const data: unknown = await backendRes.json();
    const response = NextResponse.json(data, { status: backendRes.status });

    if (!backendRes.ok) return response;

    // Re-apply backend cookies with persistent Max-Age so they survive browser close
    const setCookies: string[] = backendRes.headers.getSetCookie();
    for (const cookieStr of setCookies) {
        const [nameVal, ...attrParts] = cookieStr.split(";").map((s) => s.trim());
        const eqIdx = nameVal.indexOf("=");
        const name = nameVal.slice(0, eqIdx);
        const value = nameVal.slice(eqIdx + 1);

        const attrs = attrParts.map((a) => a.toLowerCase());
        const sameSiteAttr = attrParts
            .find((a) => a.toLowerCase().startsWith("samesite="))
            ?.split("=")[1]
            ?.toLowerCase() as "lax" | "strict" | "none" | undefined;
        const pathAttr =
            attrParts.find((a) => a.toLowerCase().startsWith("path="))?.split("=")[1] ?? "/";

        response.cookies.set(name, value, {
            httpOnly: attrs.includes("httponly"),
            secure: attrs.includes("secure"),
            sameSite: sameSiteAttr ?? "lax",
            path: pathAttr,
            maxAge: COOKIE_MAX_AGE,
        });
    }

    return response;
}
