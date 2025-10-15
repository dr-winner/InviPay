import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChipiProvider } from "@chipi-pay/chipi-sdk"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const queryClient = new QueryClient()

export const metadata: Metadata = {
  title: "InviPay - Instant Payments",
  description: "Send money instantly with invisible crypto technology",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${spaceGrotesk.variable} ${GeistMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <ChipiProvider
            publicKey={process.env.NEXT_PUBLIC_CHIPI_PUBLIC_KEY}
            merchantWallet={process.env.NEXT_PUBLIC_CHIPI_MERCHANT_WALLET}
          >
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
            <Analytics />
          </ChipiProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
