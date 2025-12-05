"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Loader2, Search, ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProxyTestPage() {
  const router = useRouter();
  const [proxyId, setProxyId] = useState("");
  type TestResult = Record<string, unknown>;
  
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [directTestUrl, setDirectTestUrl] = useState("");
  
  // Helper function to safely render unknown values
  const renderValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const handleTest = async () => {
    if (!proxyId.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Test direct de l'API
      const apiUrl = `${window.location.origin}/api/notion-proxy/${proxyId}`;
      setDirectTestUrl(apiUrl);

      // Diagnostic complet
      const debugResponse = await fetch(
        `${window.location.origin}/api/proxy-debug`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ proxyId }),
        },
      );

      const debugData = await debugResponse.json();
      setResult(debugData);
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-gray-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test de Proxy API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Entrez l'ID du proxy à tester"
                value={proxyId}
                onChange={(e) => setProxyId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTest();
                }}
              />
            </div>
            <Button onClick={handleTest} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Tester
            </Button>
          </div>

          {directTestUrl && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm font-medium mb-1">Test direct de l'API:</p>
              <div className="flex items-center justify-between">
                <code className="text-xs bg-white p-2 rounded block overflow-x-auto border border-gray-100 flex-1 mr-2">
                  {directTestUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(directTestUrl, "_blank")}
                  className="shrink-0"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ouvrir
                </Button>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3
                className={`text-lg font-medium mb-2 ${result.success ? "text-success" : "text-destructive"}`}
              >
                {result.success
                  ? "Proxy trouvé et fonctionnel"
                  : "Problème détecté"}
              </h3>

              {!result.success && (
                <div className="mb-4">
                  <p className="text-destructive font-medium">
                    Erreur: {renderValue(result.error)}
                  </p>
                  {Boolean(result.stage) && (
                    <p className="text-sm text-gray-600">
                      Étape: {renderValue(result.stage)}
                    </p>
                  )}
                  {Boolean(result.code) && (
                    <p className="text-sm text-gray-600">Code: {renderValue(result.code)}</p>
                  )}

                  {Array.isArray(result.availableProxies) &&
                    result.availableProxies.length > 0 && (
                      <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
                        <p className="font-medium mb-2">Proxies disponibles:</p>
                        <ul className="space-y-2">
                          {Array.isArray(result.availableProxies) && result.availableProxies.map((proxy: unknown) => {
                            const safeProxy = proxy as { id: string; notion_database_name?: string };
                            return (
                            <li
                              key={safeProxy.id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">
                                  {safeProxy.notion_database_name || "Sans nom"}
                                </p>
                                <code className="text-xs">{safeProxy.id}</code>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setProxyId(safeProxy.id);
                                  handleTest();
                                }}
                              >
                                Tester
                              </Button>
                            </li>
                          );
                          })}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {Boolean(result.proxy) && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">
                    Informations sur le proxy:
                  </h4>
                  <pre className="bg-white p-2 rounded text-sm overflow-auto">
                    {renderValue(result.proxy)}
                  </pre>
                </div>
              )}

              {Boolean(result.data) && (
                <div>
                  <h4 className="font-medium mb-1">
                    Informations sur les données:
                  </h4>
                  <pre className="bg-white p-2 rounded text-sm overflow-auto">
                    {renderValue(result.data)}
                  </pre>
                </div>
              )}

              {Boolean(result.success) && Boolean(result.api_url) && (
                <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-success mb-1">URL de l'API:</p>
                  <div className="flex items-center justify-between">
                    <code className="bg-white px-2 py-1 rounded text-sm flex-1 mr-2">
                      {renderValue(result.api_url)}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const url = typeof result.api_url === 'string' ? result.api_url : '';
                        if (url) window.open(url, '_blank');
                      }}
                      className="shrink-0"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Tester
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
