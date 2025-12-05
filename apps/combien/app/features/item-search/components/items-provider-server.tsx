import { SearchContainerClient } from "@/app/features/item-search/components";
import { ErrorDetailsClient } from "@/app/features/common/components/error-details-client";
import { fetchItems } from "@/app/features/item-search/api/items";

export async function ItemsProviderServer() {
  const { items, logs, error } = await fetchItems();
  if (error) {
    return <ErrorDetailsClient initialError={error} initialLogs={logs} />;
  }
  return <SearchContainerClient initialItems={items} />;
}
