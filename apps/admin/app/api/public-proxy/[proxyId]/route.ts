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
      return createCorsResponse([], 200);
    }

    // Utiliser le client admin qui ignore les règles RLS
    const { data: proxyDataArray } = await supabaseAdmin
      .from("notion_proxy_data")
      .select("data")
      .eq("proxy_id", proxyId);

    // Retourner les données ou un tableau vide
    if (
      proxyDataArray &&
      proxyDataArray.length > 0 &&
      proxyDataArray[0]?.data
    ) {
      return createCorsResponse(proxyDataArray[0].data, 200);
    }
      // Retourner un tableau vide au lieu d'une erreur
      return createCorsResponse([], 200);
  } catch (error) {
    console.error("Error fetching proxy data:", error);
    // En cas d'erreur, retourner un tableau vide au lieu d'une erreur
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
