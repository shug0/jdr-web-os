"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Card, CardContent } from "@workspace/ui/components/card";
import { getUserProxies } from "@/app/actions/notion-proxy";
import ProxyCard from "./proxy-card";
import EmptyProxyState from "./empty-proxy-state";
import ErrorHandler from "@/components/common/error-handler";

interface ProxiesListProps {
  onCreateNew: () => void;
}

export default function ProxiesList({ onCreateNew }: ProxiesListProps) {
  const [proxies, setProxies] = useState<Array<{
    created_at: string | null;
    id: string;
    is_public: boolean | null;
    items_count: number | null;
    last_synced: string | null;
    notion_database_id: string;
    notion_database_name: string;
    user_id: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's proxies
  const loadProxies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getUserProxies();
      if (result.success) {
        setProxies(result.data || []); // Use result.data instead of result.proxies and provide a default empty array
      } else {
        setError(result.error);
        console.error(result.error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error loading proxies:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load proxies on component mount
  useEffect(() => {
    loadProxies();
  }, [loadProxies]);

  if (isLoading) {
    return <ProxyListSkeleton />;
  }

  if (error) {
    return <ErrorHandler error={error} title="Failed to load proxies" />;
  }

  if (proxies.length === 0) {
    return <EmptyProxyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="space-y-4">
      {proxies.map((proxy) => (
        <ProxyCard 
          key={proxy.id} 
          proxy={{
            ...proxy,
            items_count: proxy.items_count ?? undefined, // Convert null to undefined
          }} 
          onSync={loadProxies} 
        />
      ))}
    </div>
  );
}

function ProxyListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
