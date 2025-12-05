"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import type { Item } from "@/app/features/item-search/types/types";

export function useFuzzySearch(items: Item[], searchTerm: string) {
  const [results, setResults] = useState<Item[]>(items || []);

  const fuse = useMemo(() => {
    if (!items || items.length === 0) return null as Fuse<Item> | null;
    return new Fuse(items, {
      keys: [
        { name: "name", weight: 5 },
        { name: "category", weight: 1 },
        { name: "subcategory", weight: 1 },
        { name: "description", weight: 0.2 },
        { name: "properties", weight: 0.2 },
      ],
      includeScore: true,
      threshold: 0.2,
      ignoreLocation: false,
      location: 0,
      distance: 50,
      useExtendedSearch: true,
      minMatchCharLength: 2,
      ignoreFieldNorm: false,
      shouldSort: true,
      findAllMatches: false,
      ignoreDiacritics: true,
    });
  }, [items]);

  useEffect(() => {
    if (!items) {
      setResults([]);
      return;
    }
    if (searchTerm.trim() === "") {
      setResults(items);
    } else if (fuse) {
      const searchResults = fuse.search(searchTerm);
      setResults(searchResults.map((result) => result.item));
    } else {
      setResults([]);
    }
  }, [searchTerm, items, fuse]);

  return results;
}
