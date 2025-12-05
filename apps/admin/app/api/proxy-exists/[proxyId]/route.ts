import { createClient } from "@workspace/data/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxyId: string }> },
) {
  // Gérer les requêtes OPTIONS pour le CORS
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }

  try {
    const resolvedParams = await params;
    const proxyId = resolvedParams.proxyId;

    if (!proxyId) {
      const response = NextResponse.json({ exists: false }, { status: 200 });
      return addCorsHeaders(response);
    }

    const supabase = await createClient();

    // Vérifier simplement si le proxy existe
    const { data, error } = await supabase
      .from("notion_proxies")
      .select("id, notion_database_name")
      .eq("id", proxyId)
      .limit(1);

    const exists = !error && data && data.length > 0;

    const response = NextResponse.json({
      exists,
      name: exists ? data[0]?.notion_database_name : null,
    });

    return addCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json({ exists: false }, { status: 200 });
    return addCorsHeaders(response);
  }
}

// Gérer les requêtes OPTIONS pour le CORS
export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

function handleOptions(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}

function addCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}
