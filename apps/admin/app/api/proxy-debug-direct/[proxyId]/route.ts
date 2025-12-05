import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@workspace/data/server";

// Créer un client Supabase avec la clé de service qui ignore les règles RLS
const supabaseAdmin = createAdminClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxyId: string }> },
) {
  // Gérer les requêtes OPTIONS pour le CORS
  if (request.method === "OPTIONS") {
    return handleOptions();
  }

  try {
    const resolvedParams = await params;
    const proxyId = resolvedParams.proxyId;

    if (!proxyId) {
      return createCorsResponse({ error: "Proxy ID is required" }, 200);
    }

    // Utiliser le client admin qui ignore les règles RLS
    const { data: proxy, error: proxyError } = await supabaseAdmin
      .from("notion_proxies")
      .select("*")
      .eq("id", proxyId)
      .maybeSingle();

    // Vérifier si les données existent
    const { data: proxyData, error: dataError } = await supabaseAdmin
      .from("notion_proxy_data")
      .select("*")
      .eq("proxy_id", proxyId)
      .maybeSingle();

    return createCorsResponse(
      {
        proxy_exists: !!proxy,
        proxy_details: proxy || null,
        proxy_error: proxyError ? proxyError.message : null,
        data_exists: !!proxyData,
        data_details: proxyData
          ? {
              id: proxyData.id,
              proxy_id: proxyData.proxy_id,
              notion_page_id: proxyData.notion_page_id,
              created_at: proxyData.created_at,
              updated_at: proxyData.updated_at,
              data_count: Array.isArray(proxyData.data)
                ? proxyData.data.length
                : 0,
            }
          : null,
        data_error: dataError ? dataError.message : null,
        api_url: `${request.nextUrl.origin}/api/notion-proxy/${proxyId}`,
      },
      200,
    );
  } catch (error) {
    return createCorsResponse(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      200,
    );
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
