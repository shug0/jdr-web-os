import { createClient } from "@workspace/data/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Gérer les requêtes OPTIONS pour le CORS
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }

  try {
    const supabase = await createClient();

    // Récupérer tous les proxies
    const { data, error } = await supabase
      .from("notion_proxies")
      .select("id, notion_database_name, last_synced, items_count")
      .order("created_at", { ascending: false });

    if (error) {
      const response = NextResponse.json(
        { error: "Failed to fetch proxies" },
        { status: 500 },
      );
      return addCorsHeaders(response);
    }

    const response = NextResponse.json(data || []);
    return addCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
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
