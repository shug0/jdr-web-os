"use client";

import type React from "react";
import { Database, Settings } from "lucide-react";

interface DesktopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DesktopNav({
  activeTab,
  onTabChange,
}: DesktopNavProps) {
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
  };

  return (
    <nav className="hidden md:flex items-center gap-6">
      <button
        type="button"
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          activeTab === "proxies"
            ? "text-primary"
            : "text-gray-700 hover:text-primary"
        }`}
        onClick={() => handleTabClick("proxies")}
      >
        <Database className="h-4 w-4" />
        <span>Proxies</span>
      </button>
      <button
        type="button"
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          activeTab === "settings"
            ? "text-primary"
            : "text-gray-700 hover:text-primary"
        }`}
        onClick={() => handleTabClick("settings")}
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </button>
    </nav>
  );
}
