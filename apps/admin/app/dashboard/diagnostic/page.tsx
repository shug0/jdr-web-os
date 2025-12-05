"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Loader2, Search, ArrowLeft } from "lucide-react";
import { diagnoseProxy } from "@/app/actions/proxy-diagnostic";
import { useRouter, useSearchParams } from "next/navigation";

export default function DiagnosticPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [proxyId, setProxyId] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
    code?: string;
    stage?: string;
    proxy?: Record<string, unknown>;
    data?: Record<string, unknown>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Référence pour suivre si le diagnostic a déjà été lancé pour un ID spécifique
  const diagnosedIdRef = useRef<string | null>(null);

  // Utiliser l'ID du proxy depuis l'URL si disponible
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && idFromUrl !== diagnosedIdRef.current) {
      setProxyId(idFromUrl);
      // Marquer cet ID comme déjà diagnostiqué pour éviter les boucles
      diagnosedIdRef.current = idFromUrl;
      // Lancer automatiquement le diagnostic
      handleDiagnose(idFromUrl);
    }
  }, [searchParams]); // Ne pas ajouter handleDiagnose aux dépendances

  const handleDiagnose = async (id?: string) => {
    const idToUse = id || proxyId;
    if (!idToUse.trim()) return;

    setIsLoading(true);
    try {
      const diagnosticResult = await diagnoseProxy(idToUse);
      setResult(diagnosticResult);
    } catch (error) {
      setResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite",
        stage: "action_error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer le clic sur le bouton Diagnostiquer
  const handleDiagnoseClick = () => {
    // Mettre à jour la référence pour éviter une nouvelle exécution automatique
    diagnosedIdRef.current = proxyId;
    handleDiagnose();
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
          <CardTitle>Diagnostic de Proxy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Entrez l'ID du proxy à diagnostiquer"
                value={proxyId}
                onChange={(e) => setProxyId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    diagnosedIdRef.current = proxyId;
                    handleDiagnose();
                  }
                }}
              />
            </div>
            <Button onClick={handleDiagnoseClick} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Diagnostiquer
            </Button>
          </div>

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
                    Erreur: {result.error}
                  </p>
                  <p className="text-sm text-gray-600">Étape: {result.stage}</p>
                  {result.code && (
                    <p className="text-sm text-gray-600">Code: {result.code}</p>
                  )}
                </div>
              )}

              {result.proxy && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">
                    Informations sur le proxy:
                  </h4>
                  <pre className="bg-white p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(result.proxy, null, 2)}
                  </pre>
                </div>
              )}

              {result.data && (
                <div>
                  <h4 className="font-medium mb-1">
                    Informations sur les données:
                  </h4>
                  <pre className="bg-white p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {result.success && (
                <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-success">
                    URL de l'API:{" "}
                    <code className="bg-white px-1 py-0.5 rounded">{`${typeof window !== "undefined" ? window.location.origin : ""}/api/notion-proxy/${proxyId}`}</code>
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
