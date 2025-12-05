"use client";

import type React from "react";
import { useState } from "react";
import { Database, Settings, Menu } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";

interface MobileNavProps {
  userEmail: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileNav({
  userEmail,
  activeTab,
  onTabChange,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[300px]">
        <nav className="flex flex-col gap-4 mt-8">
          <button
            type="button"
            className={`flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "proxies"
                ? "text-primary bg-primary/5"
                : "text-gray-700 hover:text-primary hover:bg-gray-50"
            }`}
            onClick={() => handleTabClick("proxies")}
          >
            <Database className="h-4 w-4" />
            <span>Proxies</span>
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "settings"
                ? "text-primary bg-primary/5"
                : "text-gray-700 hover:text-primary hover:bg-gray-50"
            }`}
            onClick={() => handleTabClick("settings")}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <Separator className="my-2" />
          <div className="px-2 py-2 text-sm text-gray-500">
            Signed in as: {userEmail}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
