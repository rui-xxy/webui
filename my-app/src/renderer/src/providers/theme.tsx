import { HeroUIProvider } from "@heroui/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider locale="zh-CN">
      <main className="nerv text-foreground bg-background min-h-screen">
        {children}
      </main>
    </HeroUIProvider>
  );
}
