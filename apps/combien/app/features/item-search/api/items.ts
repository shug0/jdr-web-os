import { API_ENDPOINT } from "@/app/features/item-search/constants/constants";
import { mapRawItemsToItems } from "@/app/features/item-search/utils/item-mapper";
import { fetchWithTimeout } from "@workspace/data/client";
import type { Item } from "@/app/features/item-search/types/types";

type LogEntry = {
  timestamp: string;
  message: string;
  type: "info" | "error" | "warning";
};

export async function fetchItems(): Promise<{
  items: Item[];
  logs: LogEntry[];
  error: Error | null;
}> {
  const logs: LogEntry[] = [];

  const addLog = (
    message: string,
    type: "info" | "error" | "warning" = "info",
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    logs.push({ timestamp, message, type });
    console[type === "error" ? "error" : type === "warning" ? "warn" : "log"](
      message,
    );
  };

  try {
    addLog(`Fetching data from: ${API_ENDPOINT}`);

    const response = await fetchWithTimeout(API_ENDPOINT, {
      // biome-ignore lint/suspicious/noExplicitAny: Next.js adds `next` to RequestInit
      next: { revalidate: 60 } as any,
      headers: { Accept: "application/json" },
    });

    addLog(
      `Response received with status: ${response.status} ${response.statusText}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const items = mapRawItemsToItems(data);

    addLog(`Successfully fetched and mapped ${items.length} items.`);
    return { items, logs, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    addLog(`Failed to fetch items: ${error.message}`, "error");
    return { items: [], logs, error };
  } finally {
    addLog("Fetch operation finished.");
  }
}
