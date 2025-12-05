"use client";

import type * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Note: ThemeProvider is now handled by parent layouts (StandaloneBrandLayout, DesktopOSLayout, etc.)
  // to avoid double nesting issues
  return <>{children}</>;
}