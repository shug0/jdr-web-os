"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Loader2, RefreshCw, Globe, Clock, Copy, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { syncNotionDatabase } from "@/app/actions/notion-proxy";
import { useToast } from "@workspace/ui/hooks/use-toast";
import ErrorHandler from "@/components/common/error-handler";
import { TypographySmall } from "@workspace/ui/components/custom/typography";

interface SyncStatus {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

interface ProxyCardProps {
  proxy: {
    id: string;
    notion_database_name: string;
    notion_database_id: string;
    last_synced: string | null;
    items_count?: number;
  };
  onSync: () => void;
}

const { toast } = useToast();
export default function ProxyCard({ proxy, onSync }: ProxyCardProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ status: "idle" });

  // Format date with user's locale and timezone
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never synced";

    try {
      // Create a date object from the ISO string
      const date = new Date(dateString);

      // Format the date using the user's locale and explicitly in local timezone
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  // Sync a database
  const handleSync = async () => {
    setSyncStatus({ status: "loading", message: "Syncing..." });

    try {
      const result = await syncNotionDatabase(proxy.id);
      if (result.success) {
        setSyncStatus({
          status: "success",
          message: result.message || "Sync completed successfully",
        });
        onSync();
        toast({
          title: "Sync completed",
          description: result.message || "Database synchronized successfully",
        });
      } else {
        setSyncStatus({
          status: "error",
          message: result.error || "Sync failed",
        });
        toast({
          title: "Sync failed",
          description: result.error || "Failed to synchronize database",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setSyncStatus({ status: "error", message: errorMessage });
      toast({
        title: "Error",
        description: "An unexpected error occurred during synchronization",
        variant: "destructive",
      });
    }
  };

  // Copy API URL to clipboard
  const copyApiUrl = () => {
    const url = `${window.location.origin}/api/notion-proxy/${proxy.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "URL copied",
          description: "API URL copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
        toast({
          title: "Error",
          description: "Failed to copy URL to clipboard",
          variant: "destructive",
        });
      });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">
              {proxy.notion_database_name}
            </h3>
            <div className="flex items-center mt-1 flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-success/10 text-success border-success flex gap-1 items-center"
              >
                <Globe className="h-3 w-3" />
                Public API
              </Badge>

              <div className="flex items-center text-xs text-gray-500">
                <FileText className="h-3 w-3 mr-1" />
                {proxy.items_count !== undefined
                  ? `${proxy.items_count} items`
                  : "No items"}
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <TypographySmall>
                        {formatDate(proxy.last_synced)}
                      </TypographySmall>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Last synchronized</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={syncStatus.status === "loading"}
            >
              {syncStatus.status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Sync</span>
            </Button>
            <Button variant="outline" size="sm" onClick={copyApiUrl}>
              <Copy className="h-4 w-4" />
              <span className="ml-2">Copy URL</span>
            </Button>
          </div>
        </div>

        {syncStatus.status !== "idle" && syncStatus.message && (
          <ErrorHandler
            error={syncStatus.message}
            variant={
              syncStatus.status === "error"
                ? "error"
                : syncStatus.status === "success"
                  ? "info"
                  : "warning"
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
