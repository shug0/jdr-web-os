"use client";

import { ThemeProvider, ThemeScript } from "@workspace/ui/theme";
import { Wallpaper } from "@workspace/ui/wallpaper";
import { Taskbar } from "@workspace/ui/taskbar";
import { Providers } from "@workspace/ui/components/providers";
import { SharedFonts, fontClasses } from "@workspace/ui/layouts/font-config";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { cn } from "@workspace/ui/lib/utils";

interface StandaloneBrandLayoutProps {
  children: React.ReactNode;
  currentApp: string;
  metadata?: {
    title?: string;
    description?: string;
    icons?: {
      icon?: string;
      apple?: string;
    };
    generator?: string;
  };
  lang?: string;
  className?: string;
}

export function StandaloneBrandLayout({
  children,
  currentApp,
  metadata = {},
  lang = "fr",
  className,
}: StandaloneBrandLayoutProps) {
  const isMobile = useIsMobile();
  const {
    title = "Application - JDR Coffee",
    description = "Application pour jeux de rôle - JDR Coffee",
    icons = { icon: "/favicon.png" },
    generator = "Claude Code",
  } = metadata;

  return (
    <ThemeProvider>
      <html lang={lang} suppressHydrationWarning>
        <head>
          <ThemeScript />
          <title>{title}</title>
          <meta name="description" content={description} />
          {icons.icon && <link rel="icon" href={icons.icon} />}
          {icons.apple && <link rel="apple-touch-icon" href={icons.apple} />}
          <meta name="generator" content={generator} />
          <SharedFonts />
        </head>
        <body className={fontClasses}>
          <Providers>
            <div className={cn("min-h-screen", className)}>
              {!isMobile && <Wallpaper />}

              <Taskbar currentApp={currentApp} />

              <main className={cn(
                "pt-10",
                !isMobile && "md:p-14 md:pt-14 p-0"
              )}>
                {isMobile ? (
                  <div className="p-4 min-h-[calc(100vh-3.5rem)]">
                    {children}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "md:rounded-lg md:border md:bg-background/95 md:shadow-lg md:backdrop-blur-sm",
                      "md:p-6 p-4",
                      "min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-3.5rem-2rem)]"
                    )}
                  >
                    {children}
                  </div>
                )}
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </ThemeProvider>
  );
}
