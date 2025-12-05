"use server";

import { createClient } from "@workspace/data/server";

export async function diagnoseProxy(proxyId: string) {
  try {
    const supabase = await createClient();

    // Vérifier si le proxy existe
    const { data: proxies, error: proxyError } = await supabase
      .from("notion_proxies")
      .select("*")
      .eq("id", proxyId);

    if (proxyError) {
      return {
        success: false,
        error: proxyError.message,
        code: proxyError.code,
        stage: "proxy_query",
      };
    }

    if (!proxies || proxies.length === 0) {
      return {
        success: false,
        error: "Proxy not found",
        stage: "proxy_check",
      };
    }

    const proxy = proxies[0];

    // Vérifier si les données existent
    const { data: proxyDataArray, error: dataError } = await supabase
      .from("notion_proxy_data")
      .select("*")
      .eq("proxy_id", proxyId)
      .eq("notion_page_id", proxy?.notion_database_id || "");

    if (dataError) {
      return {
        success: false,
        error: dataError.message,
        code: dataError.code,
        stage: "data_query",
        proxy: {
          id: proxy?.id,
          database_id: proxy?.notion_database_id,
          name: proxy?.notion_database_name,
        },
      };
    }

    if (!proxyDataArray || proxyDataArray.length === 0) {
      return {
        success: false,
        error: "No data found for this proxy",
        stage: "data_check",
        proxy: {
          id: proxy?.id,
          database_id: proxy?.notion_database_id,
          name: proxy?.notion_database_name,
          last_synced: proxy?.last_synced,
        },
      };
    }

    const proxyData = proxyDataArray[0];

    return {
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
        id: proxyData?.id,
        created_at: proxyData?.created_at,
        updated_at: proxyData?.updated_at,
        items_count: Array.isArray(proxyData?.data)
          ? proxyData?.data.length
          : 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stage: "unexpected_error",
    };
  }
}
