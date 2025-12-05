import type React from "react";
import type { Metadata } from "next";
import { AdaptiveLayout } from "@workspace/features";
import { SupabaseProvider } from "@workspace/data";
import "@workspace/ui/globals.css";
import "./custom.css";

export const metadata: Metadata = {
  title: "Admin - jdr.coffee",
  description: "Admin dashboard for jdr.coffee",
  icons: {
    icon: "/shield_13.png",
    apple: "/shield_13.png",
  },
  generator: "v0.dev",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AdaptiveLayout 
        currentApp="admin"
        metadata={{
          title: 'Admin - jdr.coffee',
          description: 'Admin dashboard for jdr.coffee',
          icons: {
            icon: '/shield_13.png',
            apple: '/shield_13.png'
          },
          generator: 'v0.dev'
        }}
      >
        {children}
      </AdaptiveLayout>
    </SupabaseProvider>
  );
}
