import { createClient } from "@workspace/data/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxyId: string }> },
) {
  try {
    const resolvedParams = await params;
    const proxyId = resolvedParams.proxyId;

    if (!proxyId) {
      return NextResponse.json(
        { error: "Proxy ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Vérifier si le proxy existe
    const { data: proxy, error: proxyError } = await supabase
      .from("notion_proxies")
      .select(
        "id, notion_database_id, notion_database_name, created_at, last_synced",
      )
      .eq("id", proxyId)
      .single();

    if (proxyError) {
      return NextResponse.json(
        {
          success: false,
          error: proxyError.message,
          code: proxyError.code,
          message: "Erreur lors de la recherche du proxy",
        },
        { status: 404 },
      );
    }

    if (!proxy) {
      return NextResponse.json(
        {
          success: false,
          error: "No proxy found with the provided ID",
          message: "Aucun proxy trouvé avec cet ID",
        },
        { status: 404 },
      );
    }

    // Vérifier si les données existent
    const { data: proxyData, error: dataError } = await supabase
      .from("notion_proxy_data")
      .select("created_at, updated_at")
      .eq("proxy_id", proxyId)
      .eq("notion_page_id", proxy.notion_database_id)
      .single();

    return NextResponse.json({
      success: true,
      proxy: {
        id: proxy.id,
        database_id: proxy.notion_database_id,
        name: proxy.notion_database_name,
        created_at: proxy.created_at,
        last_synced: proxy.last_synced,
      },
      data_status: {
        exists: !dataError && !!proxyData,
        last_updated: proxyData?.updated_at || null,
        error: dataError ? dataError.message : null,
      },
      api_url: `${request.nextUrl.origin}/api/notion-proxy/${proxyId}`,
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Erreur interne du serveur",
      },
      { status: 500 },
    );
  }
}
