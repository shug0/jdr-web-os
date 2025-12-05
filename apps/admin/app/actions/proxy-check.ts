"use server";

import { createClient } from "@workspace/data/server";

export async function checkProxyExists(proxyId: string) {
  try {
    const supabase = await createClient();

    // Vérifier si le proxy existe
    const { data, error } = await supabase
      .from("notion_proxies")
      .select("id, notion_database_name, is_public")
      .eq("id", proxyId)
      .single();

    if (error) {
      console.error("Erreur lors de la vérification du proxy:", error);
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }

    return {
      success: true,
      exists: !!data,
      data,
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du proxy:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue s'est produite",
    };
  }
}
