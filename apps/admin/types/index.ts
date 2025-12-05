import type { Database, NotionProxy, NotionProxyData } from "@workspace/data";

// Re-export types de base de Supabase
export type { NotionProxy, NotionProxyData };

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

export interface SuccessResponse<T> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse extends ApiResponse<never> {
  success: false;
  error: string;
  code?: string;
}

// Types pour Notion API
export interface NotionDatabase {
  id: string;
  title: [{ plain_text: string }];
  object: "database";
  created_time: string;
  last_edited_time: string;
  icon?: {
    type: "emoji" | "external" | "file";
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
  cover?: {
    type: "external" | "file";
    external?: { url: string };
    file?: { url: string };
  };
  properties: Record<string, NotionProperty>;
}

export interface NotionProperty {
  id: string;
  name: string;
  type: string;
  [key: string]: unknown; // Pour les propriétés spécifiques à chaque type
}

export interface NotionPage {
  id: string;
  object: "page";
  created_time: string;
  last_edited_time: string;
  parent: {
    type: "database_id";
    database_id: string;
  };
  properties: Record<string, unknown>;
  url: string;
}

export interface NotionSearchResponse {
  object: "list";
  results: NotionDatabase[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface NotionQueryResponse {
  object: "list";
  results: NotionPage[];
  next_cursor: string | null;
  has_more: boolean;
}

// Types pour les composants
export interface SyncStatus {
  [proxyId: string]: {
    status: "loading" | "success" | "error";
    message: string;
  };
}

// Types pour les erreurs
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Types pour les créateurs de proxy
export interface CreateProxyRequest {
  databaseId: string;
  databaseName: string;
}

export interface CreateProxyResponse {
  proxyId: string;
}

// Types pour la synchronisation
export interface SyncProxyRequest {
  proxyId: string;
}

export interface SyncProxyResponse {
  itemsCount: number;
}

// Types pour les données JSON
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// Type helper pour les clients Supabase
export type SupabaseClient = unknown;

// Réexport du type Database
export type { Database } from "@workspace/data";
