import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import Header from "~/components/header";
import { ThemeProvider } from "~/providers/theme-provider";

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const interTight = Inter_Tight({
	variable: "--font-inter-tight",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Neurolab Preorder Waitlist",
	description:
		"Join the Neurolab preorder waitlist. Be among the first to experience the future of AI-powered productivity.",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://neurolab.cc"),
  openGraph: {
    title: "Neurolab Preorder Waitlist",
    description:
      "Join the Neurolab preorder waitlist. Be among the first to experience the future of AI-powered productivity.",
    url: "/",
    siteName: "Neurolab",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Neurolab Preorder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neurolab Preorder Waitlist",
    description:
      "Join the Neurolab preorder waitlist. Be among the first to experience the future of AI-powered productivity.",
    images: ["/twitter-image.png"],
    creator: "@neurolab",
  },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<body
				className={`${interTight.variable} ${geistMono.variable} antialiased flex flex-col h-full`}
			>
				<ThemeProvider>
					<Header />
					<Toaster />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
