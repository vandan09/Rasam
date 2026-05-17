import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import DemoBanner from "@/components/ui/DemoBanner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Rasam — What do you actually want to eat?",
  description: "Tell us nothing about food. We'll figure out the rest.",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-[#FAFAF8] text-gray-900 antialiased`}
      >
        <DemoBanner />
        {children}
      </body>
    </html>
  )
}
