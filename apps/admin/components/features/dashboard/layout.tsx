"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@workspace/ui/components/tabs";
import Header from "./header";
import NotionProxyPanel from "@/components/features/notion/proxy-panel";
import SettingsPanel from "./settings-panel";

interface DashboardLayoutProps {
  userEmail: string;
}

export default function DashboardLayout({ userEmail }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("proxies");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        userEmail={userEmail}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="proxies" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <NotionProxyPanel />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <SettingsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
