import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const hankenGrotsek = Hanken_Grotesk({
    variable: "--font-hanken-grotesk",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jet-brains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Portfolio Pulse",
    description: "AI Analysis  of yoour portfolio",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${hankenGrotsek.variable} ${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
