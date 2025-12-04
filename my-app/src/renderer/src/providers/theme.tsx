import type { JSX, ReactNode } from 'react'
import { HeroUIProvider, ToastProvider } from '@heroui/react'

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  return (
    <HeroUIProvider locale="zh-CN">
      <main className="min-h-screen bg-background text-foreground">{children}</main>
      <ToastProvider placement="bottom-right" />
    </HeroUIProvider>
  )
}
