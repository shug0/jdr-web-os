import type React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@workspace/ui/components/custom/toaster";
import { SupabaseProvider } from "@workspace/data/client";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
