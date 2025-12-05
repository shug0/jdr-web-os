import { createClient } from "@workspace/data/server";
import { type NextRequest, NextResponse } from "next/server";

// Fonction pour ajouter les headers CORS
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 heures
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proxyId } = body;

    if (!proxyId) {
      const response = NextResponse.json(
        { success: false, error: "Proxy ID is required" },
        { status: 400 },
      );
      return addCorsHeaders(response);
    }

    console.log(`[Debug] Vérification du proxy ID: ${proxyId}`);

    const supabase = await createClient();

    // 1. Vérifier si le proxy existe dans la table notion_proxies
    const { data: proxies, error: proxyError } = await supabase
      .from("notion_proxies")
      .select("*")
      .eq("id", proxyId);

    if (proxyError) {
      console.error(
        "[Debug] Erreur lors de la recherche du proxy:",
        proxyError,
      );
      const response = NextResponse.json(
        {
          success: false,
          error: proxyError.message,
          code: proxyError.code,
          stage: "proxy_query",
        },
        { status: 500 },
      );
      return addCorsHeaders(response);
    }

    if (!proxies || proxies.length === 0) {
      console.log(`[Debug] Aucun proxy trouvé avec l'ID: ${proxyId}`);

      // Rechercher des proxies similaires pour aider au diagnostic
      const { data: similarProxies } = await supabase
        .from("notion_proxies")
        .select("id, notion_database_name")
        .limit(5);

      const response = NextResponse.json(
        {
          success: false,
          error: "Proxy not found",
          stage: "proxy_check",
          availableProxies: similarProxies || [],
        },
        { status: 404 },
      );
      return addCorsHeaders(response);
    }

    const proxy = proxies[0];

    // 2. Vérifier si les données existent dans la table notion_proxy_data
    const { data: proxyDataArray, error: dataError } = await supabase
      .from("notion_proxy_data")
      .select("*")
      .eq("proxy_id", proxyId)
      .eq("notion_page_id", proxy?.notion_database_id || "");

    if (dataError) {
      console.error(
        "[Debug] Erreur lors de la recherche des données:",
        dataError,
      );
      const response = NextResponse.json(
        {
          success: false,
          error: dataError.message,
          code: dataError.code,
          stage: "data_query",
          proxy: {
            id: proxy?.id,
            database_id: proxy?.notion_database_id,
            name: proxy?.notion_database_name,
          },
        },
        { status: 500 },
      );
      return addCorsHeaders(response);
    }

    const hasData = proxyDataArray && proxyDataArray.length > 0;
    const dataCount = hasData
      ? Array.isArray(proxyDataArray[0]?.data)
        ? proxyDataArray[0]?.data.length
        : 0
      : 0;

    // 3. Retourner un rapport complet
    const response = NextResponse.json({
      success: true,
      proxy: {
        id: proxy?.id,
        database_id: proxy?.notion_database_id,
        name: proxy?.notion_database_name,
        created_at: proxy?.created_at,
        last_synced: proxy?.last_synced,
        items_count: proxy?.items_count,
      },
      data: {
        exists: hasData,
        count: dataCount,
        last_updated: hasData ? proxyDataArray[0]?.updated_at : null,
      },
      api_url: `${request.nextUrl.origin}/api/notion-proxy/${proxyId}`,
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error("[Debug] Erreur non gérée:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const response = NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 },
    );
    return addCorsHeaders(response);
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 heures
  return response;
}
