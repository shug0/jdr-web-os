import type { Item } from "@/app/features/item-search/types/types";
import {
  rawItemsSchema,
  type rawItemSchema,
} from "@/app/features/item-search/schemas/item.schemas";
import type { z } from "zod";

type RawItem = z.infer<typeof rawItemSchema>;

export function mapRawItemsToItems(rawItems: unknown): Item[] {
  const validatedItems: RawItem[] = rawItemsSchema.parse(rawItems);

  return validatedItems.map((rawItem) => ({
    id: rawItem.id || `unknown-${Math.random()}`,
    name: rawItem.name || "Objet sans nom",
    category: rawItem.family || "Non catégorisé",
    subcategory: rawItem.sub_family || "",
    price: rawItem.price_gold || 0,
    currency: "pièces d'or",
    rarity: rawItem.availability || "Commun",
    description: rawItem.more || "Aucune description disponible",
    properties: rawItem.damage || [],
    weight: rawItem.weight_kg || 0,
    imageUrl: undefined,
  }));
}
