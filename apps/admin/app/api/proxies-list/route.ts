import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAllProxyData, getAllProxies } from "@workspace/data/server";

export async function GET(request: NextRequest) {
  // Gérer les requêtes OPTIONS pour le CORS
  if (request.method === "OPTIONS") {
    return handleOptions();
  }

  try {
    // Utiliser les helper functions pour éviter les problèmes de types
    const { data } = await getAllProxies();

    // Récupérer toutes les données de proxy
    const { data: proxyData } = await getAllProxyData();

    // Créer un objet avec les IDs de proxy comme clés
    const proxyDataMap = new Map<string, boolean>();
    if (proxyData) {
      for (const item of proxyData) {
        proxyDataMap.set(item.proxy_id, true);
      }
    }

    // Ajouter une propriété pour indiquer si des données existent pour chaque proxy
    const enrichedData = data
      ? data.map((proxy) => ({
          ...proxy,
          has_data: proxyDataMap.has(proxy.id),
        }))
      : [];

    return createCorsResponse(enrichedData, 200);
  } catch (error) {
    console.error("Error fetching proxies list:", error);
    // En cas d'erreur, retourner un tableau vide
    return createCorsResponse([], 200);
  }
}

// Gérer les requêtes OPTIONS pour le CORS
export function OPTIONS() {
  return handleOptions();
}

function handleOptions() {
  return createCorsResponse(null, 204);
}

// Fonction utilitaire pour créer une réponse avec les headers CORS
function createCorsResponse(body: unknown, status: number) {
  const response =
    body === null
      ? new NextResponse(null, { status })
      : NextResponse.json(body, { status });

  // Ajouter les headers CORS
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
  );
  response.headers.set("Access-Control-Allow-Headers", "*");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}
