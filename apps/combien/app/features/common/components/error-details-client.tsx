"use client";

import { fetchItems } from "@/app/features/item-search/api/items";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { API_ENDPOINT } from "@/app/features/item-search/constants/constants";
import { SearchContainerClient } from "@/app/features/item-search/components";
import { LoadingSpinner } from "@/app/features/common/components/loading-spinner";
import type { Item } from "@/app/features/item-search/types/types";

interface ErrorLog {
  timestamp: string;
  message: string;
  type: "info" | "error" | "warning";
}

interface ErrorDetailsClientProps {
  initialError: Error;
  initialLogs: ErrorLog[];
}

export function ErrorDetailsClient({
  initialError,
  initialLogs,
}: ErrorDetailsClientProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<Error | null>(initialError);
  const [logs, setLogs] = useState<ErrorLog[]>(initialLogs);
  const [retrySuccess, setRetrySuccess] = useState(false);

  const addLog = (
    message: string,
    type: "info" | "error" | "warning" = "info",
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, message, type }]);
    console[type === "error" ? "error" : type === "warning" ? "warn" : "log"](
      message,
    );
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    addLog("Tentative de récupération des données côté client...", "info");

    try {
      const {
        items: fetchedItems,
        logs: fetchedLogs,
        error: fetchedError,
      } = await fetchItems();
      setLogs((prev) => [...prev, ...fetchedLogs]); // Append logs from fetchItems

      if (fetchedError) {
        throw fetchedError;
      }

      addLog("Données récupérées avec succès côté client");
      setItems(fetchedItems);
      setError(null);
      setRetrySuccess(true);
    } catch (err) {
      const newError = err instanceof Error ? err : new Error(String(err));
      addLog(
        `Échec de la récupération côté client: ${newError.message}`,
        "error",
      );
      setError(newError);
    } finally {
      setIsRetrying(false);
    }
  };

  if (isRetrying) {
    return <LoadingSpinner message="Nouvelle tentative de chargement..." />;
  }

  if (retrySuccess) {
    return <SearchContainerClient initialItems={items} />;
  }

  return (
    <div className="w-full py-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="text-lg">
          Erreur de chargement des données
        </AlertTitle>
        <AlertDescription>
          <div className="mt-2 mb-4">
            <p className="font-medium">
              {error?.message ||
                "Une erreur s'est produite lors du chargement des données"}
            </p>
            <p className="text-sm mt-1">URL: {API_ENDPOINT}</p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Masquer les détails
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Afficher les détails
                </>
              )}
            </Button>

            <Button
              onClick={handleRetry}
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer côté client
            </Button>
          </div>

          {showDetails && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="bg-destructive/10 p-2 border-b">
                <h3 className="font-medium">Logs de débogage</h3>
              </div>
              <div className="max-h-60 overflow-y-auto p-2 bg-background/50">
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    Aucun log disponible
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {logs.map((log) => (
                      <li
                        key={`${log.timestamp}-${log.message}`}
                        className={cn("text-sm p-1 rounded", {
                          "text-destructive bg-destructive/10":
                            log.type === "error",
                          "text-accent-foreground bg-accent/10":
                            log.type === "warning",
                          "text-muted-foreground": log.type === "info",
                        })}
                      >
                        <span className="font-mono text-xs mr-2">
                          [{log.timestamp}]
                        </span>
                        {log.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {error && (
                <div className="border-t p-2 bg-destructive/5">
                  <h4 className="text-sm font-medium mb-1">
                    Détails de l'erreur:
                  </h4>
                  <pre className="text-xs overflow-x-auto p-2 bg-background/50 rounded border">
                    {error.stack || error.toString()}
                  </pre>
                </div>
              )}
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
