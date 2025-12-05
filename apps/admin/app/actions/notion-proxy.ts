"use server";

import { createClient } from "@workspace/data/server";
import { revalidatePath } from "next/cache";
import { transformNotionPageData } from "@/services/notion/api";
import type {
  NotionDatabase,
  NotionSearchResponse,
  NotionQueryResponse,
  NotionProxy,
  CreateProxyResponse,
  SyncProxyResponse,
  NotionPage,
  JsonValue,
} from "@/types";

// Utilisons le type NotionPage déjà défini dans les types
// mais créons un alias avec les bonnes propriétés pour la transformation

// Standard error response type
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// Standard success response type
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Type for API responses
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Helper function to create error responses
function createErrorResponse(error: unknown, code?: string): ErrorResponse {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";
  console.error(`Error (${code || "UNKNOWN"}): ${errorMessage}`, error);

  return {
    success: false,
    error: errorMessage,
    code,
  };
}

// Fetch available Notion databases
export async function fetchNotionDatabases(): Promise<
  ApiResponse<NotionDatabase[]>
> {
  try {
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "Notion API key is not configured",
        code: "NOTION_API_KEY_MISSING",
      };
    }

    const response = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { value: "database", property: "object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error:
          errorData.message ||
          `Error: ${response.status} ${response.statusText}`,
        code: "NOTION_API_ERROR",
      };
    }

    const data: NotionSearchResponse = await response.json();
    return {
      success: true,
      data: data.results,
    };
  } catch (error) {
    return createErrorResponse(error, "FETCH_DATABASES_ERROR");
  }
}

// Create a new Notion proxy
export async function createNotionProxy(
  databaseId: string,
  databaseName: string,
): Promise<ApiResponse<CreateProxyResponse>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Authentication required",
        code: "AUTH_REQUIRED",
      };
    }

    // Check if proxy already exists
    const { data: existingProxy } = await supabase
      .from("notion_proxies")
      .select("id")
      .eq("user_id", user.id)
      .eq("notion_database_id", databaseId)
      .single();

    if (existingProxy) {
      return {
        success: true,
        data: { proxyId: existingProxy.id },
        message: "Proxy already exists",
      };
    }

    // Create new proxy
    const { data, error } = await supabase
      .from("notion_proxies")
      .insert({
        user_id: user.id,
        notion_database_id: databaseId,
        notion_database_name: databaseName,
        items_count: 0,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
        code: "DB_INSERT_ERROR",
      };
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { proxyId: data.id },
    };
  } catch (error) {
    return createErrorResponse(error, "CREATE_PROXY_ERROR");
  }
}

// Sync data from Notion to Supabase
export async function syncNotionDatabase(
  proxyId: string,
): Promise<ApiResponse<{ itemsCount: number }>> {
  try {
    const supabase = await createClient();
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "Notion API key is not configured",
        code: "NOTION_API_KEY_MISSING",
      };
    }

    // Get proxy details
    const { data: proxy, error: proxyError } = await supabase
      .from("notion_proxies")
      .select("*")
      .eq("id", proxyId)
      .single();

    if (proxyError || !proxy) {
      return {
        success: false,
        error: proxyError?.message || "Proxy not found",
        code: "PROXY_NOT_FOUND",
      };
    }

    // Fetch database schema
    const schemaResponse = await fetch(
      `https://api.notion.com/v1/databases/${proxy.notion_database_id}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": "2022-06-28",
        },
      },
    );

    if (!schemaResponse.ok) {
      const errorData = await schemaResponse.json();
      return {
        success: false,
        error:
          errorData.message ||
          `Error fetching schema: ${schemaResponse.status}`,
        code: "SCHEMA_FETCH_ERROR",
      };
    }

    const schema = await schemaResponse.json();

    // Fetch database content with pagination
    let allPages: NotionPage[] = [];
    let hasMore = true;
    let nextCursor = undefined;

    while (hasMore) {
      const contentResponse = await fetch(
        `https://api.notion.com/v1/databases/${proxy.notion_database_id}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page_size: 100,
            start_cursor: nextCursor,
          }),
        },
      );

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json();
        return {
          success: false,
          error:
            errorData.message ||
            `Error fetching content: ${contentResponse.status}`,
          code: "CONTENT_FETCH_ERROR",
        };
      }

      const content: NotionQueryResponse = await contentResponse.json();
      allPages = [...allPages, ...content.results];

      hasMore = content.has_more;
      nextCursor = content.next_cursor;
    }

    // Transform all pages and store them in a single array  
    const transformedPages = allPages.map((page) => {
      // The transformNotionPageData function expects a specific shape, so cast appropriately
      return transformNotionPageData(page as NotionPage);
    });

    // Tri alphabétique par la propriété "Name" (ou "name" si la casse varie)
    transformedPages.sort((a, b) => {
      // Récupérer la valeur de Name, en tenant compte des différentes possibilités de casse
      const nameA = (a.Name || a.name || a.NAME || "").toString().toLowerCase();
      const nameB = (b.Name || b.name || b.NAME || "").toString().toLowerCase();

      // Tri alphabétique
      return nameA.localeCompare(nameB);
    });

    // Store all pages in a single record
    const { error: upsertError } = await supabase
      .from("notion_proxy_data")
      .upsert(
        {
          proxy_id: proxyId,
          notion_page_id: proxy.notion_database_id, // Use database ID as the page ID
          data: transformedPages as JsonValue, // Store the entire array of transformed pages as JSON
          last_edited: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "proxy_id,notion_page_id" },
      );

    if (upsertError) {
      return {
        success: false,
        error: upsertError.message,
        code: "DATA_UPSERT_ERROR",
      };
    }

    // Update last synced timestamp and items count
    await supabase
      .from("notion_proxies")
      .update({
        last_synced: new Date().toISOString(),
        items_count: transformedPages.length,
      })
      .eq("id", proxyId);

    revalidatePath("/dashboard");

    return {
      success: true,
      data: { itemsCount: transformedPages.length },
      message: `Synced ${transformedPages.length} pages successfully.`,
    };
  } catch (error) {
    return createErrorResponse(error, "SYNC_DATABASE_ERROR");
  }
}

// Get user's proxies
export async function getUserProxies(): Promise<ApiResponse<NotionProxy[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notion_proxies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
        code: "FETCH_PROXIES_ERROR",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return createErrorResponse(error, "GET_USER_PROXIES_ERROR");
  }
}
