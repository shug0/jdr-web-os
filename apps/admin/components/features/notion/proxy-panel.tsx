"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Database, Plus } from "lucide-react";
import { Toaster } from "@workspace/ui/components/custom/toaster";
import ProxiesList from "./proxies-list";
import DatabasesList from "./databases-list";

export default function NotionProxyPanel() {
  const [activeTab, setActiveTab] = useState("proxies");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notion Proxy</CardTitle>
          <CardDescription>
            Connect Notion databases and access simplified data via public API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="proxies" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>My Proxies</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create New Proxy</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="proxies">
              <ProxiesList onCreateNew={() => setActiveTab("create")} />
            </TabsContent>

            <TabsContent value="create">
              <DatabasesList onProxyCreated={() => setActiveTab("proxies")} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 text-xs text-gray-500">
          <p>Notion Proxy</p>
          <p>Data is refreshed on demand</p>
        </CardFooter>
      </Card>
      <Toaster />
    </>
  );
}
