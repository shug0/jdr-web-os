"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Loader2, Check, Database, RefreshCw, Plus } from "lucide-react";
import {
  fetchNotionDatabases,
  createNotionProxy,
  getUserProxies,
} from "@/app/actions/notion-proxy";
import { useToast } from "@workspace/ui/hooks/use-toast";
import {
  TypographyH3,
  TypographyP,
} from "@workspace/ui/components/custom/typography";
import ErrorHandler from "@/components/common/error-handler";
import type { NotionDatabase } from "@/types";

interface DatabasesListProps {
  onProxyCreated: () => void;
}

const { toast } = useToast();
export default function DatabasesList({ onProxyCreated }: DatabasesListProps) {
  const [databases, setDatabases] = useState<Array<NotionDatabase>>([]);
  const [proxies, setProxies] = useState<Array<{
    id: string;
    notion_database_id: string;
    [key: string]: unknown;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available Notion databases
  const loadDatabases = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First load existing proxies to check which databases are already proxied
      const proxiesResult = await getUserProxies();
      if (proxiesResult.success) {
        setProxies(proxiesResult.data || []); // Add a fallback empty array
      } else {
        setError(proxiesResult.error);
        toast({
          title: "Error loading proxies",
          description: proxiesResult.error,
          variant: "destructive",
        });
        return;
      }

      // Then load databases
      const result = await fetchNotionDatabases();
      if (result.success) {
        setDatabases(result.data || []); // Add a fallback empty array
      } else {
        setError(result.error);
        toast({
          title: "Error loading databases",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading databases",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new proxy
  const handleCreateProxy = async (
    databaseId: string,
    databaseName: string,
  ) => {
    try {
      const result = await createNotionProxy(databaseId, databaseName);
      if (result.success) {
        onProxyCreated();
        toast({
          title: "Proxy created",
          description:
            "Your Notion database proxy has been created successfully",
        });
      } else {
        toast({
          title: "Error creating proxy",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <DatabasesListSkeleton />;
  }

  if (error) {
    return <ErrorHandler error={error} title="Failed to load databases" />;
  }

  if (databases.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Database className="h-12 w-12 text-gray-400 mb-3" />
          <TypographyH3 className="mb-1">No databases found</TypographyH3>
          <TypographyP className="text-sm text-gray-500 mb-4">
            Click the button below to load your Notion databases
          </TypographyP>
          <Button onClick={loadDatabases}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Load Databases
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <TypographyH3>Available Notion Databases</TypographyH3>
        <Button
          onClick={loadDatabases}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-3">
        {databases.map((db) => {
          const title = db.title?.[0]?.plain_text || "Untitled Database";
          const isAlreadyProxied = proxies.some(
            (p) => p.notion_database_id === db.id,
          );

          return (
            <div
              key={db.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{title}</span>
                {isAlreadyProxied && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-muted text-muted-foreground border-muted"
                  >
                    Already proxied
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => handleCreateProxy(db.id, title)}
                disabled={isAlreadyProxied}
                variant={isAlreadyProxied ? "outline" : "default"}
              >
                {isAlreadyProxied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Proxy
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DatabasesListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  );
}
