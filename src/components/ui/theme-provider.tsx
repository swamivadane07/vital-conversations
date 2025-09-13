import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: any
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}