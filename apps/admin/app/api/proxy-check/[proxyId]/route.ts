import { createClient } from "@workspace/data/server";
import { type NextRequest, NextResponse } from "next/server";

// Fonction pour ajouter les headers CORS
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 heures
  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxyId: string }> },
) {
  try {
    const resolvedParams = await params;
    const proxyId = resolvedParams.proxyId;
    console.log(`[API Check] Vérification du proxy ID: ${proxyId}`);

    if (!proxyId) {
      const response = NextResponse.json(
        { exists: false, error: "Proxy ID is required" },
        { status: 400 },
      );
      return addCorsHeaders(response);
    }

    const supabase = await createClient();

    // Vérifier si le proxy existe
    const { data, error } = await supabase
      .from("notion_proxies")
      .select("id, notion_database_name")
      .eq("id", proxyId);

    if (error) {
      console.error("[API Check] Erreur Supabase:", error);
      const response = NextResponse.json(
        {
          exists: false,
          error: error.message,
          code: error.code,
        },
        { status: 500 },
      );
      return addCorsHeaders(response);
    }

    const exists = data && data.length > 0;
    const response = NextResponse.json({
      exists,
      proxy: exists ? data[0] : null,
      message: exists ? "Proxy found" : "No proxy found with the provided ID",
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error("[API Check] Erreur non gérée:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const response = NextResponse.json(
      {
        exists: false,
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
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 heures
  return response;
}
