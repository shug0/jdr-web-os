"use client";

import Logo from "@/components/common/logo";
import LogoutButton from "@/components/common/auth/logout-button";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

interface HeaderProps {
  userEmail: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({
  userEmail,
  activeTab,
  onTabChange,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo size={24} />
          <h1 className="text-xl font-bold text-gray-900">
            Admin - jdr.coffee
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <DesktopNav activeTab={activeTab} onTabChange={onTabChange} />
          <MobileNav
            userEmail={userEmail}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />

          <div className="flex items-center">
            <LogoutButton userEmail={userEmail} />
          </div>
        </div>
      </div>
    </header>
  );
}
