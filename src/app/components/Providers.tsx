"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "@/app/contexts/ThemeContext"
import SessionProvider from "@/app/components/SessionProvider"

interface ProvidersProps {
  children: ReactNode
  session: any
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
} 