import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import "./video-player.css"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`} suppressHydrationWarning>
      <head>
        <script src="https://vjs.zencdn.net/8.23.4/video.min.js"></script>
        <link href="https://vjs.zencdn.net/8.23.4/video-js.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/@videojs/http-streaming@3.17.2/dist/videojs-http-streaming.min.js"></script>
        <link href="https://vjs.zencdn.net/7.20.3/alt/video-js-cdn.min.css" rel="stylesheet" />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.app",
}
