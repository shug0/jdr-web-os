'use client'

import { ThemeProvider, ThemeScript } from "../theme";
import { Providers } from "../components/providers";
import { SharedFonts, fontClasses } from "./font-config";

interface WindowLayoutProps {
  children: React.ReactNode;
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
}

export function WindowLayout({ 
  children, 
  metadata = {},
  lang = "fr"
}: WindowLayoutProps) {
  const {
    title = "Application - JDR Coffee",
    description = "Application pour jeux de rôle - JDR Coffee",
    icons = { icon: "/favicon.png" },
    generator = "Claude Code"
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
            <div className="min-h-screen bg-background">
              {children}
            </div>
          </Providers>
        </body>
      </html>
    </ThemeProvider>
  );
}